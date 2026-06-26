import { createClient } from "@/utils/supabase/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import { getR2SignedUrl } from "@/lib/r2"
import type {
  CuratorMediaOption,
  MemoryBookAssetRecord,
  MemoryBookRecord,
} from "./types"

export function ownerMediaUrl(
  locator: string,
  mediaType: "image" | "video",
  width?: 320 | 640
) {
  if (
    locator.startsWith("images/") ||
    (locator.startsWith("memory-books/") && mediaType === "image")
  ) {
    const resize = width ? `&width=${width}` : ""
    return `/api/image-proxy?key=${encodeURIComponent(locator)}${resize}`
  }

  if (
    locator.startsWith("videos/") ||
    (locator.startsWith("memory-books/") && mediaType === "video")
  ) {
    return `/api/video-proxy?key=${encodeURIComponent(locator)}`
  }

  return locator
}

export async function requireMemoryBookUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null }
  }

  return { supabase, user }
}

export async function getOwnedMemoryBook(bookId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from("memory_books")
    .select("*")
    .eq("id", bookId)
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    return null
  }

  return data as MemoryBookRecord
}

export async function getMemoryBookAssets(bookId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from("memory_book_assets")
    .select("*")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .order("position", { ascending: true })

  return (data || []) as MemoryBookAssetRecord[]
}

export async function getCuratorMediaLibrary(
  userId: string,
  before?: string | null,
  limit = 24
): Promise<{ items: CuratorMediaOption[]; nextCursor: string | null }> {
  const candidates = await getCuratorMediaCandidates(userId, before, limit)
  await ensureCuratorMediaDerivatives(userId, candidates.items)
  const derivativeMap = await getDerivativeMap(
    userId,
    candidates.items.map((item) => item.id)
  )
  const expiresAt = new Date(Date.now() + 55 * 60 * 1000).toISOString()
  const items = await Promise.all(
    candidates.items.map(async (item) => {
      const derivative = derivativeMap.get(`${item.sourceType}:${item.id}`)
      const status =
        (derivative?.status as CuratorMediaOption["previewStatus"] | undefined) ||
        "queued"
      const [previewUrl, posterUrl, fallbackUrl] = await Promise.all([
        derivative?.thumbnail_small_key
          ? getR2SignedUrl(derivative.thumbnail_small_key, 3600)
          : Promise.resolve(""),
        derivative?.thumbnail_medium_key
          ? getR2SignedUrl(derivative.thumbnail_medium_key, 3600)
          : Promise.resolve(undefined),
        item.previewLocator
          ? signOwnerLocator(item.previewLocator)
          : Promise.resolve(undefined),
      ])
      return {
        id: item.id,
        sourceType: item.sourceType,
        mediaType: item.mediaType,
        title: item.title,
        createdAt: item.createdAt,
        previewUrl,
        posterUrl,
        fallbackUrl,
        previewStatus: status,
        expiresAt,
      }
    })
  )

  return { items, nextCursor: candidates.nextCursor }
}

type CuratorMediaCandidate = {
  id: string
  sourceType: Exclude<MemoryBookAssetRecord["source_type"], "upload">
  mediaType: MemoryBookAssetRecord["media_type"]
  title: string
  createdAt: string
  originalLocator: string
  previewLocator: string
}

async function getCuratorMediaCandidates(
  userId: string,
  before: string | null | undefined,
  limit: number
) {
  const perSourceLimit = Math.max(1, Math.min(limit + 1, 50))
  let restorationsQuery = supabaseAdmin.from("image_restorations").select("id, restored_image_url, created_at").eq("user_id", userId).eq("status", "completed").not("restored_image_url", "is", null).order("created_at", { ascending: false }).limit(perSourceLimit)
  let portraitsQuery = supabaseAdmin.from("family_portraits").select("id, composed_image_url, created_at").eq("user_id", userId).eq("status", "completed").order("created_at", { ascending: false }).limit(perSourceLimit)
  let addPersonQuery = supabaseAdmin.from("add_person_generations").select("id, composed_image_url, created_at").eq("user_id", userId).eq("status", "completed").order("created_at", { ascending: false }).limit(perSourceLimit)
  let animationsQuery = supabaseAdmin.from("video_generations").select("id, video_url, original_image_url, preset_name, created_at").eq("user_id", userId).eq("status", "completed").not("video_url", "is", null).order("created_at", { ascending: false }).limit(perSourceLimit)
  let hugsQuery = supabaseAdmin.from("nostalgic_hug_generations").select("id, video_url, hug_image_url, created_at").eq("user_id", userId).eq("status", "completed").not("video_url", "is", null).order("created_at", { ascending: false }).limit(perSourceLimit)

  if (before) {
    restorationsQuery = restorationsQuery.lt("created_at", before)
    portraitsQuery = portraitsQuery.lt("created_at", before)
    addPersonQuery = addPersonQuery.lt("created_at", before)
    animationsQuery = animationsQuery.lt("created_at", before)
    hugsQuery = hugsQuery.lt("created_at", before)
  }

  const [{ data: restorations }, { data: portraits }, { data: addPersonItems }, { data: animations }, { data: hugs }] = await Promise.all([
    restorationsQuery,
    portraitsQuery,
    addPersonQuery,
    animationsQuery,
    hugsQuery,
  ])

  const combined: CuratorMediaCandidate[] = [
    ...(restorations || []).map((item) => ({ id: item.id, sourceType: "restoration" as const, mediaType: "image" as const, title: "Restored photograph", createdAt: item.created_at, originalLocator: item.restored_image_url, previewLocator: item.restored_image_url })),
    ...(portraits || []).map((item) => ({ id: item.id, sourceType: "family_portrait" as const, mediaType: "image" as const, title: "Family portrait", createdAt: item.created_at, originalLocator: item.composed_image_url, previewLocator: item.composed_image_url })),
    ...(addPersonItems || []).map((item) => ({ id: item.id, sourceType: "add_person" as const, mediaType: "image" as const, title: "Added person photo", createdAt: item.created_at, originalLocator: item.composed_image_url, previewLocator: item.composed_image_url })),
    ...(animations || []).map((item) => ({ id: item.id, sourceType: "animation" as const, mediaType: "video" as const, title: item.preset_name || "Animated memory", createdAt: item.created_at, originalLocator: item.video_url, previewLocator: item.original_image_url || "" })),
    ...(hugs || []).map((item) => ({ id: item.id, sourceType: "nostalgic_hug" as const, mediaType: "video" as const, title: "Nostalgic Hug", createdAt: item.created_at, originalLocator: item.video_url, previewLocator: item.hug_image_url || "" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const items = combined.slice(0, limit)
  return {
    items,
    nextCursor: combined.length > limit && items.length ? items[items.length - 1].createdAt : null,
  }
}

async function ensureCuratorMediaDerivatives(userId: string, items: CuratorMediaCandidate[]) {
  const valid = items.filter((item) => item.previewLocator)
  if (!valid.length) return
  const { data: rows, error } = await supabaseAdmin
    .from("memory_book_media_derivatives")
    .upsert(
      valid.map((item) => ({
        user_id: userId,
        source_type: item.sourceType,
        source_id: item.id,
        media_type: item.mediaType,
        source_locator: item.originalLocator,
        preview_locator: item.previewLocator,
      })),
      { onConflict: "user_id,source_type,source_id" }
    )
    .select("id, source_type, source_id, status")
  if (error) throw error

  await Promise.all(
    (rows || []).filter((row) => row.status === "queued").map((row) =>
      enqueueMemoryBookJob({
        userId,
        jobType: "generate_media_derivatives",
        idempotencyKey: `media-derivative:${row.id}`,
        payload: { derivativeId: row.id },
      })
    )
  )
}

async function getDerivativeMap(userId: string, sourceIds: string[]) {
  if (!sourceIds.length) return new Map<string, any>()
  const { data } = await supabaseAdmin.from("memory_book_media_derivatives").select("*").eq("user_id", userId).in("source_id", sourceIds)
  return new Map((data || []).map((row) => [`${row.source_type}:${row.source_id}`, row]))
}

export async function getOwnerCuratorMediaUrls(
  userId: string,
  sources: Array<{ sourceType: string; sourceId: string }>
) {
  if (!sources.length) return []
  const sourceIds = Array.from(new Set(sources.map((source) => source.sourceId)))
  const requested = new Set(
    sources.map((source) => `${source.sourceType}:${source.sourceId}`)
  )
  const { data } = await supabaseAdmin
    .from("memory_book_media_derivatives")
    .select("*")
    .eq("user_id", userId)
    .in("source_id", sourceIds)
  const expiresAt = new Date(Date.now() + 55 * 60 * 1000).toISOString()
  return Promise.all(
    (data || [])
      .filter((row) => requested.has(`${row.source_type}:${row.source_id}`))
      .map(async (row) => ({
        id: row.source_id as string,
        sourceType: row.source_type as CuratorMediaOption["sourceType"],
        previewUrl: row.thumbnail_small_key
          ? await getR2SignedUrl(row.thumbnail_small_key, 3600)
          : "",
        posterUrl: row.thumbnail_medium_key
          ? await getR2SignedUrl(row.thumbnail_medium_key, 3600)
          : undefined,
        fallbackUrl: row.preview_locator
          ? await signOwnerLocator(row.preview_locator)
          : undefined,
        previewStatus: row.status as CuratorMediaOption["previewStatus"],
        expiresAt,
      }))
  )
}
export async function getOwnerMemoryBookAssetSources(assets: MemoryBookAssetRecord[]) {
  const expiresAt = new Date(Date.now() + 55 * 60 * 1000).toISOString()
  return Promise.all(
    assets.map(async (asset) => {
      const metadata = asset.metadata || {}
      const smallKey = typeof metadata.thumbnailSmallKey === "string" ? metadata.thumbnailSmallKey : null
      const mediumKey = typeof metadata.thumbnailMediumKey === "string" ? metadata.thumbnailMediumKey : null
      const previewFailed = metadata.previewStatus === "failed"
      const fallbackPreview = asset.media_type === "image"
        ? asset.source_type === "upload" && !mediumKey && !previewFailed
          ? null
          : asset.preserved_key || asset.source_locator
        : asset.poster_key || (typeof metadata.posterLocator === "string" ? metadata.posterLocator : null)
      const [src, thumbnail, generatedPoster, fallbackPoster] = await Promise.all([
        signOwnerLocator(asset.preserved_key || asset.source_locator || ""),
        smallKey ? getR2SignedUrl(smallKey, 3600) : Promise.resolve(undefined),
        mediumKey ? getR2SignedUrl(mediumKey, 3600) : Promise.resolve(undefined),
        fallbackPreview ? signOwnerLocator(fallbackPreview) : Promise.resolve(undefined),
      ])
      const previewStatus: "queued" | "processing" | "ready" | "failed" =
        asset.status === "failed"
          ? "failed"
          : asset.status === "processing"
            ? "processing"
            : asset.status === "pending"
              ? "queued"
              : mediumKey
                ? "ready"
                : previewFailed
                  ? "failed"
                  : "queued"
      return {
        id: asset.id,
        mediaType: asset.media_type,
        src: src || "",
        thumbnail: thumbnail || null,
        poster: generatedPoster || fallbackPoster || null,
        downloadUrl: src || null,
        previewStatus,
        expiresAt,
      }
    })
  )
}

async function signOwnerLocator(locator: string) {
  if (!locator) return undefined
  if (/^(images|videos|memory-books|media-derivatives)\//.test(locator)) {
    return getR2SignedUrl(locator, 3600)
  }
  return locator
}

export async function resolveMemorySource(
  userId: string,
  sourceType: MemoryBookAssetRecord["source_type"],
  sourceId: string
) {
  if (sourceType === "restoration") {
    const { data } = await supabaseAdmin
      .from("image_restorations")
      .select("restored_image_url")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.restored_image_url
      ? {
          mediaType: "image" as const,
          locator: data.restored_image_url as string,
          posterLocator: null,
          label: "Restored photograph",
        }
      : null
  }

  if (sourceType === "family_portrait") {
    const { data } = await supabaseAdmin
      .from("family_portraits")
      .select("composed_image_url")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.composed_image_url
      ? {
          mediaType: "image" as const,
          locator: data.composed_image_url as string,
          posterLocator: null,
          label: "Family portrait",
        }
      : null
  }

  if (sourceType === "add_person") {
    const { data } = await supabaseAdmin
      .from("add_person_generations")
      .select("composed_image_url")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.composed_image_url
      ? {
          mediaType: "image" as const,
          locator: data.composed_image_url as string,
          posterLocator: null,
          label: "Added person photo",
        }
      : null
  }
  if (sourceType === "animation") {
    const { data } = await supabaseAdmin
      .from("video_generations")
      .select("video_url, original_image_url, preset_name")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.video_url
      ? {
          mediaType: "video" as const,
          locator: data.video_url as string,
          posterLocator: (data.original_image_url as string | null) || null,
          label: (data.preset_name as string | null) || "Animated memory",
        }
      : null
  }

  if (sourceType === "nostalgic_hug") {
    const { data } = await supabaseAdmin
      .from("nostalgic_hug_generations")
      .select("video_url, hug_image_url")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.video_url
      ? {
          mediaType: "video" as const,
          locator: data.video_url as string,
          posterLocator: (data.hug_image_url as string | null) || null,
          label: "Nostalgic Hug",
        }
      : null
  }

  return null
}

export async function enqueueMemoryBookJob(input: {
  userId: string
  bookId?: string | null
  assetId?: string | null
  jobType:
    | "preserve_asset"
    | "generate_media_derivatives"
    | "polish_copy"
    | "reaction_email"
    | "delete_storage"
    | "draft_expiry_warning"
  idempotencyKey: string
  payload?: Record<string, unknown>
}) {
  const { data, error } = await supabaseAdmin
    .from("memory_book_jobs")
    .upsert(
      {
        user_id: input.userId,
        book_id: input.bookId || null,
        asset_id: input.assetId || null,
        job_type: input.jobType,
        idempotency_key: input.idempotencyKey,
        payload: input.payload || {},
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}
