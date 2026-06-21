import { after, NextResponse } from "next/server"
import { z } from "zod"
import { processMemoryBookAssetJobs } from "@/lib/memory-book/jobs"
import {
  assignAssetToMemoryBookDraft,
  assignAssetToMemoryBookSpread,
  parseMemoryBookDraft,
  reconcileMemoryBookDraft,
} from "@/lib/memory-book/draft"
import {
  enqueueMemoryBookJob,
  getMemoryBookAssets,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const completeSchema = z.object({
  assetId: z.string().uuid(),
  key: z.string().min(1).max(500),
  targetSpreadId: z.string().min(1).max(80).optional(),
})

export const maxDuration = 60

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = completeSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload completion" }, { status: 400 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const { data: pendingAsset } = await supabaseAdmin
    .from("memory_book_assets")
    .select("id, source_locator, status, metadata")
    .eq("id", parsed.data.assetId)
    .eq("book_id", id)
    .eq("user_id", user.id)
    .eq("source_type", "upload")
    .single()

  if (
    !pendingAsset ||
    pendingAsset.source_locator !== parsed.data.key ||
    !parsed.data.key.startsWith(`memory-books/${user.id}/${id}/`)
  ) {
    return NextResponse.json({ error: "Invalid upload key" }, { status: 403 })
  }

  const { data: asset, error } = await supabaseAdmin
    .from("memory_book_assets")
    .update({
      source_locator: parsed.data.key,
      preserved_key: parsed.data.key,
      status: "pending",
      metadata: {
        ...(pendingAsset.metadata || {}),
        preservationStatus: "ready",
        previewStatus: "queued",
      },
      error_message: null,
    })
    .eq("id", parsed.data.assetId)
    .eq("book_id", id)
    .eq("user_id", user.id)
    .eq("source_type", "upload")
    .select("*")
    .single()

  if (error || !asset) {
    return NextResponse.json(
      { error: error?.message || "Unable to finish upload" },
      { status: 500 }
    )
  }

  await enqueueMemoryBookJob({
    userId: user.id,
    bookId: id,
    assetId: asset.id,
    jobType: "preserve_asset",
    idempotencyKey: `upload-preview-v2:${asset.id}:${parsed.data.key}`,
    payload: { previewOnly: true },
  })
  const refreshedAssets = await getMemoryBookAssets(id, user.id)
  const reconciledDraft = reconcileMemoryBookDraft(
    parseMemoryBookDraft(book.draft_document),
    refreshedAssets
  )
  const draftDocument = parsed.data.targetSpreadId
    ? assignAssetToMemoryBookSpread(
        reconciledDraft,
        asset.id,
        parsed.data.targetSpreadId
      )
    : assignAssetToMemoryBookDraft(reconciledDraft, asset.id)
  const { data: versionedBook } = await supabaseAdmin
    .from("memory_books")
    .update({
      title: draftDocument.cover.title.trim() || "Our Family Heritage",
      draft_document: draftDocument,
      draft_version: book.draft_version + 1,
    })
    .eq("id", id)
    .eq("draft_version", book.draft_version)
    .select("*")
    .maybeSingle()

  after(async () => {
    await processMemoryBookAssetJobs({
      userId: user.id,
      bookId: id,
      assetIds: [asset.id],
      limit: 1,
    }).catch((error) => {
      console.error("Unable to process uploaded memory preview", error)
    })
  })

  const { data: refreshedAsset } = await supabaseAdmin
    .from("memory_book_assets")
    .select("*")
    .eq("id", asset.id)
    .single()

  return NextResponse.json({
    asset: refreshedAsset || asset,
    book: versionedBook || book,
  })
}
