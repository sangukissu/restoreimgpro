import { GoogleGenAI } from "@google/genai"
import { resend } from "@/lib/resend"
import { deleteImageFromR2 } from "@/lib/r2"
import { supabaseAdmin } from "@/utils/supabase/admin"
import {
  createMemoryBookImagePreviews,
  createSharedMediaDerivatives,
  preserveMemoryBookLocator,
} from "./storage"
import { memoryBookDraftDocumentSchema } from "./types"
import { parseMemoryBookDraft } from "./draft"
import { MEMORY_BOOK_MAX_ASSIGNED_MEMORIES } from "./limits"

type MemoryBookJob = {
  id: string
  book_id: string | null
  asset_id: string | null
  user_id: string
  job_type: "preserve_asset" | "generate_media_derivatives" | "polish_copy" | "reaction_email" | "delete_storage" | "draft_expiry_warning"
  payload: Record<string, unknown>
  attempts: number
  max_attempts: number
  status: "queued" | "running" | "completed" | "failed" | "dead"
}

const POLISH_PROMPT_VERSION = "family-heritage-copy-v1"

async function preserveAsset(job: MemoryBookJob) {
  if (!job.book_id || !job.asset_id) {
    throw new Error("Preservation job is missing book or asset")
  }

  const { data: asset, error } = await supabaseAdmin
    .from("memory_book_assets")
    .select("*")
    .eq("id", job.asset_id)
    .eq("book_id", job.book_id)
    .eq("user_id", job.user_id)
    .single()

  if (error || !asset) {
    throw new Error("Memory asset not found")
  }

  if (!asset.source_locator) {
    throw new Error("Memory asset has no source locator")
  }

  const existingMetadata = (asset.metadata || {}) as Record<string, unknown>
  const hasPreviews =
    typeof existingMetadata.thumbnailSmallKey === "string" &&
    typeof existingMetadata.thumbnailMediumKey === "string"
  if (asset.preserved_key && hasPreviews) {
    if (asset.status !== "ready") {
      await supabaseAdmin
        .from("memory_book_assets")
        .update({
          status: "ready",
          error_message: null,
          metadata: {
            ...existingMetadata,
            preservationStatus: "ready",
            previewStatus: "ready",
          },
        })
        .eq("id", asset.id)
        .eq("book_id", job.book_id)
        .eq("user_id", job.user_id)
    }
    return {
      preservedKey: asset.preserved_key,
      posterKey: asset.poster_key,
      thumbnailSmallKey: existingMetadata.thumbnailSmallKey,
      thumbnailMediumKey: existingMetadata.thumbnailMediumKey,
    }
  }

  await supabaseAdmin
    .from("memory_book_assets")
    .update({ status: "processing", error_message: null })
    .eq("id", asset.id)

  const preservedKey =
    asset.preserved_key ||
    (await preserveMemoryBookLocator({
      locator: asset.source_locator,
      userId: job.user_id,
      bookId: job.book_id,
      assetId: asset.id,
      mediaType: asset.media_type,
    }))

  let posterKey: string | null = asset.poster_key
  const posterLocator =
    typeof asset.metadata?.posterLocator === "string"
      ? asset.metadata.posterLocator
      : null

  if (asset.media_type === "video" && posterLocator && !posterKey) {
    posterKey = await preserveMemoryBookLocator({
      locator: posterLocator,
      userId: job.user_id,
      bookId: job.book_id,
      assetId: `${asset.id}-poster`,
      mediaType: "image",
    })
  }

  const previewSourceKey =
    asset.media_type === "image" ? preservedKey : posterKey
  let previews: {
    thumbnailSmallKey: string
    thumbnailMediumKey: string
  } | null = null
  let previewError: string | null = null
  if (previewSourceKey) {
    try {
      previews = await createMemoryBookImagePreviews({
        sourceKey: previewSourceKey,
        userId: job.user_id,
        bookId: job.book_id,
        assetId: asset.id,
      })
    } catch (error) {
      previewError =
        error instanceof Error ? error.message : "Preview generation failed"
    }
  }

  const requiresImagePreviews = asset.media_type === "image"
  const previewReady = !requiresImagePreviews || Boolean(previews)
  await supabaseAdmin
    .from("memory_book_assets")
    .update({
      status: previewReady ? "ready" : "failed",
      preserved_key: preservedKey,
      poster_key: posterKey,
      metadata: {
        ...existingMetadata,
        preservationStatus: "ready",
        ...(previews || {}),
        previewStatus: previews ? "ready" : previewError ? "failed" : "queued",
        ...(previewError ? { previewError: previewError.slice(0, 500) } : {}),
      },
      error_message: previewReady ? null : previewError || "Preview generation failed",
    })
    .eq("id", asset.id)
    .eq("book_id", job.book_id)
    .eq("user_id", job.user_id)

  if (!previewReady) {
    throw new Error(previewError || "Preview generation failed")
  }

  return { preservedKey, posterKey, ...previews }
}

async function generateMediaDerivatives(job: MemoryBookJob) {
  const derivativeId =
    typeof job.payload.derivativeId === "string"
      ? job.payload.derivativeId
      : null
  if (!derivativeId) throw new Error("Derivative job is missing its record")

  const { data: derivative } = await supabaseAdmin
    .from("memory_book_media_derivatives")
    .select("*")
    .eq("id", derivativeId)
    .eq("user_id", job.user_id)
    .single()
  if (!derivative) throw new Error("Media derivative record not found")

  await supabaseAdmin
    .from("memory_book_media_derivatives")
    .update({ status: "processing", error_message: null })
    .eq("id", derivative.id)

  try {
    const previews = await createSharedMediaDerivatives({
      locator: derivative.preview_locator,
      userId: derivative.user_id,
      sourceType: derivative.source_type,
      sourceId: derivative.source_id,
    })
    await supabaseAdmin
      .from("memory_book_media_derivatives")
      .update({
        status: "ready",
        thumbnail_small_key: previews.thumbnailSmallKey,
        thumbnail_medium_key: previews.thumbnailMediumKey,
        error_message: null,
      })
      .eq("id", derivative.id)
    return previews
  } catch (error) {
    const message = error instanceof Error ? error.message : "Preview generation failed"
    await supabaseAdmin
      .from("memory_book_media_derivatives")
      .update({ status: "failed", error_message: message.slice(0, 500) })
      .eq("id", derivative.id)
    throw error
  }
}

async function polishCopy(job: MemoryBookJob) {
  if (!job.book_id) {
    throw new Error("Polish job is missing book")
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured")
  }

  const { data: book, error } = await supabaseAdmin
    .from("memory_books")
    .select("id, user_id, title, draft_document, draft_version")
    .eq("id", job.book_id)
    .eq("user_id", job.user_id)
    .single()

  if (error || !book) {
    throw new Error("Memory book not found")
  }

  const currentDraft = parseMemoryBookDraft(book.draft_document)
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const prompt = [
    "Polish this family keepsake copy with restraint and warmth.",
    "Do not invent names, dates, relationships, events, or facts.",
    "Preserve every id and assetIds array exactly.",
    "Keep the cover title <= 90 chars, period label <= 80 chars, every heading <= 80 chars, every body <= 420 chars and 40 words, and closingMessage <= 600 chars.",
    "Return only the complete JSON object with the exact same schema.",
    JSON.stringify(currentDraft),
  ].join("\n")

  const response = await genAI.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: [{ text: prompt }],
  })
  const responseText =
    (response as { text?: string }).text ||
    response.candidates?.[0]?.content?.parts?.find((part) => "text" in part)?.text

  if (!responseText) {
    throw new Error("Copy polish returned no text")
  }

  const polishedDraft = memoryBookDraftDocumentSchema.parse(
    JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim())
  )
  const sameStructure = polishedDraft.spreads.every(
    (spread, index) =>
      spread.id === currentDraft.spreads[index]?.id &&
      spread.assetIds.join(":") === currentDraft.spreads[index]?.assetIds.join(":")
  )
  if (!sameStructure || polishedDraft.spreads.length !== currentDraft.spreads.length) {
    throw new Error("Copy polish changed the page structure")
  }

  await supabaseAdmin
    .from("memory_books")
    .update({
      title: polishedDraft.cover.title,
      draft_document: polishedDraft,
      draft_version: book.draft_version + 1,
    })
    .eq("id", book.id)
    .eq("draft_version", book.draft_version)

  return {
    promptVersion: POLISH_PROMPT_VERSION,
    previousDraft: currentDraft,
  }
}
async function sendReactionEmail(job: MemoryBookJob) {
  if (!job.book_id) {
    throw new Error("Reaction email job is missing book")
  }

  const { data: book } = await supabaseAdmin
    .from("memory_books")
    .select("title, user_id")
    .eq("id", job.book_id)
    .single()
  if (!book) {
    throw new Error("Memory book not found")
  }

  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("email, name")
    .eq("user_id", book.user_id)
    .single()
  if (!profile?.email) {
    throw new Error("Book owner has no email")
  }

  const { data: reactions } = await supabaseAdmin
    .from("memory_book_reactions")
    .select("id, reaction, display_name, note, created_at")
    .eq("book_id", job.book_id)
    .in("notification_status", ["pending", "queued"])
    .order("created_at", { ascending: true })
    .limit(20)

  if (!reactions?.length) {
    return { sent: 0 }
  }

  const reactionLines = reactions.map((reaction) => {
    const sender = reaction.display_name || "Someone you shared it with"
    const note = reaction.note ? `: “${reaction.note}”` : ""
    return `- ${sender} reacted ${reaction.reaction.replace("_", " ")}${note}`
  })

  const result = await resend.emails.send({
    from: "BringBack <updates@bringback.pro>",
    replyTo: "support@bringback.pro",
    to: profile.email,
    subject: `New love for “${book.title}”`,
    text: [
      `Hi ${profile.name || "there"},`,
      "",
      "Your Family Heritage keepsake received a new private reaction.",
      "",
      ...reactionLines,
      "",
      `${process.env.NEXT_PUBLIC_APP_URL || "https://bringback.pro"}/dashboard/memory-book/${job.book_id}`,
    ].join("\n"),
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  await supabaseAdmin
    .from("memory_book_reactions")
    .update({ notification_status: "sent" })
    .in("id", reactions.map((reaction) => reaction.id))

  return { sent: reactions.length }
}

async function deleteStorage(job: MemoryBookJob) {
  const keys = Array.isArray(job.payload.keys)
    ? job.payload.keys.filter((key): key is string => typeof key === "string")
    : []

  for (const key of keys) {
    await deleteImageFromR2(key)
  }

  return { deleted: keys.length }
}

async function sendDraftExpiryWarning(job: MemoryBookJob) {
  if (!job.book_id) {
    return { skipped: true }
  }

  const [{ data: book }, { data: profile }] = await Promise.all([
    supabaseAdmin
      .from("memory_books")
      .select("id, title, status, expires_at")
      .eq("id", job.book_id)
      .eq("user_id", job.user_id)
      .single(),
    supabaseAdmin
      .from("user_profiles")
      .select("email, name")
      .eq("user_id", job.user_id)
      .single(),
  ])

  if (!book || book.status === "published" || !profile?.email) {
    return { skipped: true }
  }

  const result = await resend.emails.send({
    from: "BringBack <updates@bringback.pro>",
    replyTo: "support@bringback.pro",
    to: profile.email,
    subject: `Your Family Heritage draft is waiting`,
    text: [
      `Hi ${profile.name || "there"},`,
      "",
      `Your unpublished keepsake “${book.title}” has been inactive and is scheduled for cleanup on ${new Date(book.expires_at).toLocaleDateString("en-US")}.`,
      "Opening or editing the draft resets the 90-day preservation period.",
      "",
      `${process.env.NEXT_PUBLIC_APP_URL || "https://bringback.pro"}/dashboard/memory-book/${book.id}`,
      "",
      "Published keepsakes do not expire.",
    ].join("\n"),
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  return { sent: true }
}

async function processJob(job: MemoryBookJob) {
  if (job.job_type === "preserve_asset") return preserveAsset(job)
  if (job.job_type === "generate_media_derivatives") return generateMediaDerivatives(job)
  if (job.job_type === "polish_copy") return polishCopy(job)
  if (job.job_type === "reaction_email") return sendReactionEmail(job)
  if (job.job_type === "delete_storage") return deleteStorage(job)
  if (job.job_type === "draft_expiry_warning") return sendDraftExpiryWarning(job)
  return { skipped: true }
}

async function enqueueLifecycleWork() {
  const now = new Date()
  const warningCutoff = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data: warningBooks } = await supabaseAdmin
    .from("memory_books")
    .select("id, user_id, expires_at")
    .neq("status", "published")
    .gt("expires_at", now.toISOString())
    .lte("expires_at", warningCutoff.toISOString())
    .limit(100)

  for (const book of warningBooks || []) {
    await supabaseAdmin.from("memory_book_jobs").upsert(
      {
        user_id: book.user_id,
        book_id: book.id,
        job_type: "draft_expiry_warning",
        idempotency_key: `draft-expiry-warning:${book.id}:${book.expires_at.slice(0, 10)}`,
        payload: { expiresAt: book.expires_at },
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
  }

  const { data: expiredBooks } = await supabaseAdmin
    .from("memory_books")
    .select("id, user_id")
    .neq("status", "published")
    .lte("expires_at", now.toISOString())
    .limit(20)

  for (const book of expiredBooks || []) {
    const { data: assets } = await supabaseAdmin
      .from("memory_book_assets")
      .select("source_locator, preserved_key, poster_key, metadata")
      .eq("book_id", book.id)

    const keys = Array.from(
      new Set(
        (assets || []).flatMap((asset) =>
          [asset.preserved_key, asset.poster_key, asset.source_locator, asset.metadata?.thumbnailSmallKey, asset.metadata?.thumbnailMediumKey].filter(
            (key): key is string =>
              typeof key === "string" && key.startsWith("memory-books/")
          )
        )
      )
    )

    await supabaseAdmin.from("memory_book_jobs").upsert(
      {
        user_id: book.user_id,
        book_id: book.id,
        job_type: "delete_storage",
        idempotency_key: `expire-draft-storage:${book.id}`,
        payload: { keys },
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )

    await supabaseAdmin
      .from("memory_books")
      .delete()
      .eq("id", book.id)
      .eq("user_id", book.user_id)
  }
}

async function runClaimedMemoryBookJobs(
  jobs: MemoryBookJob[],
  workerId: string
) {
  const results: Array<{ id: string; status: string; error?: string }> = []

  for (const job of jobs) {
    try {
      const result = await processJob(job)
      await supabaseAdmin
        .from("memory_book_jobs")
        .update({
          status: "completed",
          result,
          completed_at: new Date().toISOString(),
          lease_expires_at: null,
          locked_by: null,
          error_message: null,
        })
        .eq("id", job.id)
        .eq("locked_by", workerId)
      results.push({ id: job.id, status: "completed" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown job failure"
      const exhausted = job.attempts >= job.max_attempts
      const retryDelayMinutes = Math.min(60, 2 ** Math.max(0, job.attempts - 1))

      await supabaseAdmin
        .from("memory_book_jobs")
        .update({
          status: exhausted ? "dead" : "failed",
          error_message: message.slice(0, 1000),
          available_at: new Date(Date.now() + retryDelayMinutes * 60_000).toISOString(),
          lease_expires_at: null,
          locked_by: null,
        })
        .eq("id", job.id)
        .eq("locked_by", workerId)

      if (job.asset_id && job.job_type === "preserve_asset") {
        await supabaseAdmin
          .from("memory_book_assets")
          .update({
            status: exhausted ? "failed" : "pending",
            error_message: message.slice(0, 500),
          })
          .eq("id", job.asset_id)
          .eq("user_id", job.user_id)
      }

      results.push({ id: job.id, status: exhausted ? "dead" : "failed", error: message })
    }
  }

  return results
}

export async function ensureMemoryBookUploadPreviewJobs(input: {
  userId: string
  bookId: string
  assetIds?: string[]
}) {
  let query = supabaseAdmin
    .from("memory_book_assets")
    .select("id, source_locator, preserved_key, status, metadata, updated_at")
    .eq("user_id", input.userId)
    .eq("book_id", input.bookId)
    .eq("source_type", "upload")
    .eq("media_type", "image")
    .eq("is_hidden", false)

  if (input.assetIds?.length) {
    query = query.in("id", input.assetIds)
  }

  const { data: assets, error } = await query
  if (error) throw error

  const previewAssetIds: string[] = []
  for (const asset of assets || []) {
    const metadata = (asset.metadata || {}) as Record<string, unknown>
    const hasPreviews =
      typeof metadata.thumbnailSmallKey === "string" &&
      typeof metadata.thumbnailMediumKey === "string"
    const preservedKey = asset.preserved_key || asset.source_locator
    if (!preservedKey || hasPreviews) continue

    previewAssetIds.push(asset.id)
    const processingIsStale =
      asset.status === "processing" &&
      new Date(asset.updated_at).getTime() < Date.now() - 2 * 60_000
    const needsQueueState =
      processingIsStale ||
      asset.status !== "pending" ||
      metadata.preservationStatus !== "ready" ||
      metadata.previewStatus !== "queued"
    if (needsQueueState) {
      await supabaseAdmin
        .from("memory_book_assets")
        .update({
          preserved_key: preservedKey,
          status: "pending",
          error_message: null,
          metadata: {
            ...metadata,
            preservationStatus: "ready",
            previewStatus: "queued",
          },
        })
        .eq("id", asset.id)
        .eq("user_id", input.userId)
        .eq("book_id", input.bookId)
    }

    const idempotencyKey = `upload-preview-v2:${asset.id}:${preservedKey}`
    await supabaseAdmin
      .from("memory_book_jobs")
      .update({
        status: "completed",
        result: { superseded: true },
        completed_at: new Date().toISOString(),
        lease_expires_at: null,
        locked_by: null,
      })
      .eq("user_id", input.userId)
      .eq("book_id", input.bookId)
      .eq("asset_id", asset.id)
      .eq("job_type", "preserve_asset")
      .in("status", ["queued", "failed"])
      .neq("idempotency_key", idempotencyKey)

    const { data: existingJob } = await supabaseAdmin
      .from("memory_book_jobs")
      .select("id, status")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle()

    if (!existingJob) {
      await supabaseAdmin.from("memory_book_jobs").insert({
        user_id: input.userId,
        book_id: input.bookId,
        asset_id: asset.id,
        job_type: "preserve_asset",
        idempotency_key: idempotencyKey,
        payload: { previewOnly: true },
      })
    } else if (existingJob.status === "completed" || existingJob.status === "dead") {
      await supabaseAdmin
        .from("memory_book_jobs")
        .update({
          status: "queued",
          attempts: 0,
          result: null,
          error_message: null,
          available_at: new Date().toISOString(),
          lease_expires_at: null,
          locked_by: null,
          completed_at: null,
          payload: { previewOnly: true },
        })
        .eq("id", existingJob.id)
    }
  }

  return previewAssetIds
}

export async function processMemoryBookAssetJobs(input: {
  userId: string
  bookId: string
  assetIds: string[]
  limit?: number
}) {
  const assetIds = [...new Set(input.assetIds)].slice(0, MEMORY_BOOK_MAX_ASSIGNED_MEMORIES)
  if (!assetIds.length) return []

  const now = new Date().toISOString()
  await supabaseAdmin
    .from("memory_book_jobs")
    .update({
      status: "failed",
      available_at: now,
      lease_expires_at: null,
      locked_by: null,
      error_message: "Previous preview worker lease expired",
    })
    .eq("user_id", input.userId)
    .eq("book_id", input.bookId)
    .eq("job_type", "preserve_asset")
    .eq("status", "running")
    .in("asset_id", assetIds)
    .lt("lease_expires_at", now)

  const limit = Math.max(1, Math.min(input.limit || assetIds.length, MEMORY_BOOK_MAX_ASSIGNED_MEMORIES))
  const { data: candidates, error } = await supabaseAdmin
    .from("memory_book_jobs")
    .select("*")
    .eq("user_id", input.userId)
    .eq("book_id", input.bookId)
    .eq("job_type", "preserve_asset")
    .in("asset_id", assetIds)
    .in("status", ["queued", "failed"])
    .lte("available_at", now)
    .order("created_at", { ascending: true })
    .limit(limit)
  if (error) throw error

  const workerId = `memory-book-assets-${crypto.randomUUID()}`
  const claimed: MemoryBookJob[] = []
  for (const candidate of (candidates || []) as MemoryBookJob[]) {
    const { data: job } = await supabaseAdmin
      .from("memory_book_jobs")
      .update({
        status: "running",
        attempts: candidate.attempts + 1,
        locked_by: workerId,
        lease_expires_at: new Date(Date.now() + 2 * 60_000).toISOString(),
        error_message: null,
      })
      .eq("id", candidate.id)
      .eq("status", candidate.status)
      .eq("attempts", candidate.attempts)
      .select("*")
      .maybeSingle()
    if (job) claimed.push(job as MemoryBookJob)
  }

  return runClaimedMemoryBookJobs(claimed, workerId)
}

export async function processMemoryBookJobs(limit = 10) {
  await enqueueLifecycleWork()
  const workerId = `memory-book-${crypto.randomUUID()}`
  const { data, error } = await supabaseAdmin.rpc("claim_memory_book_jobs", {
    p_worker_id: workerId,
    p_limit: Math.max(1, Math.min(limit, 25)),
  })

  if (error) throw error
  return runClaimedMemoryBookJobs((data || []) as MemoryBookJob[], workerId)
}