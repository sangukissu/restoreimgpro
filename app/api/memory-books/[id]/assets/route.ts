import { NextResponse } from "next/server"
import { z } from "zod"
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
  resolveMemorySource,
} from "@/lib/memory-book/server"
import { MEMORY_BOOK_MAX_ASSIGNED_MEMORIES } from "@/lib/memory-book/limits"
import { supabaseAdmin } from "@/utils/supabase/admin"

const addAssetSchema = z.object({
  sourceType: z.enum([
    "restoration",
    "family_portrait",
    "add_person",
    "animation",
    "nostalgic_hug",
  ]),
  sourceId: z.string().uuid(),
  targetSpreadId: z.string().min(1).max(80).optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = addAssetSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid media selection" }, { status: 400 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const assets = await getMemoryBookAssets(id, user.id)
  if (assets.filter((asset) => !asset.is_hidden).length >= MEMORY_BOOK_MAX_ASSIGNED_MEMORIES) {
    return NextResponse.json(
      { error: "A Family Heritage book can contain up to 20 memories" },
      { status: 409 }
    )
  }

  const existing = assets.find(
    (asset) =>
      asset.source_type === parsed.data.sourceType &&
      asset.source_id === parsed.data.sourceId
  )
  if (existing) {
    return NextResponse.json({ asset: existing })
  }

  const source = await resolveMemorySource(
    user.id,
    parsed.data.sourceType,
    parsed.data.sourceId
  )
  if (!source) {
    return NextResponse.json(
      { error: "This media is unavailable or still processing" },
      { status: 404 }
    )
  }

  const { data: asset, error } = await supabaseAdmin
    .from("memory_book_assets")
    .insert({
      book_id: id,
      user_id: user.id,
      source_type: parsed.data.sourceType,
      source_id: parsed.data.sourceId,
      media_type: source.mediaType,
      source_locator: source.locator,
      original_label: source.label,
      alt_text: source.label,
      position: assets.length,
      metadata: source.posterLocator
        ? { posterLocator: source.posterLocator }
        : {},
    })
    .select("*")
    .single()

  if (error || !asset) {
    return NextResponse.json(
      { error: error?.message || "Unable to add memory" },
      { status: 500 }
    )
  }

  await enqueueMemoryBookJob({
    userId: user.id,
    bookId: id,
    assetId: asset.id,
    jobType: "preserve_asset",
    idempotencyKey: `preserve-asset:${asset.id}`,
  })


  const { data: refreshedAsset } = await supabaseAdmin
    .from("memory_book_assets")
    .select("*")
    .eq("id", asset.id)
    .single()

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
    .eq("user_id", user.id)
    .eq("draft_version", book.draft_version)
    .select("*")
    .maybeSingle()

  return NextResponse.json(
    { asset: refreshedAsset || asset, book: versionedBook || book },
    { status: 201 }
  )
}
