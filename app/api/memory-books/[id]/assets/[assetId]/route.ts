import { NextResponse } from "next/server"
import { z } from "zod"
import {
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

const updateAssetSchema = z.object({
  expectedVersion: z.number().int().positive(),
  caption: z.string().trim().max(280).optional(),
  alt: z.string().trim().min(1).max(180).optional(),
  position: z.number().int().min(0).max(11).optional(),
  featured: z.boolean().optional(),
  hidden: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = updateAssetSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid memory update" }, { status: 400 })
  }

  const { id, assetId } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }
  if (book.draft_version !== parsed.data.expectedVersion) {
    return NextResponse.json(
      { error: "This draft changed elsewhere", book },
      { status: 409 }
    )
  }

  const { data: asset } = await supabaseAdmin
    .from("memory_book_assets")
    .select("*")
    .eq("id", assetId)
    .eq("book_id", id)
    .eq("user_id", user.id)
    .single()
  if (!asset) {
    return NextResponse.json({ error: "Memory not found" }, { status: 404 })
  }

  const nextVersion = book.draft_version + 1
  const { data: versionedBook } = await supabaseAdmin
    .from("memory_books")
    .update({ draft_version: nextVersion })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("draft_version", book.draft_version)
    .select("*")
    .maybeSingle()

  if (!versionedBook) {
    return NextResponse.json(
      { error: "This draft changed elsewhere" },
      { status: 409 }
    )
  }

  const { data: updatedAsset, error } = await supabaseAdmin
    .from("memory_book_assets")
    .update({
      caption: parsed.data.caption ?? asset.caption,
      alt_text: parsed.data.alt ?? asset.alt_text,
      position: parsed.data.position ?? asset.position,
      is_featured: parsed.data.featured ?? asset.is_featured,
      is_hidden: parsed.data.hidden ?? asset.is_hidden,
    })
    .eq("id", assetId)
    .eq("book_id", id)
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const refreshedAssets = await getMemoryBookAssets(id, user.id)
  const draftDocument = reconcileMemoryBookDraft(
    parseMemoryBookDraft(versionedBook.draft_document),
    refreshedAssets
  )
  const { data: synchronizedBook } = await supabaseAdmin
    .from("memory_books")
    .update({
      title: draftDocument.cover.title.trim() || "Our Family Heritage",
      draft_document: draftDocument,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("draft_version", nextVersion)
    .select("*")
    .maybeSingle()

  return NextResponse.json({
    asset: updatedAsset,
    book: synchronizedBook || versionedBook,
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id, assetId } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const { data: asset } = await supabaseAdmin
    .from("memory_book_assets")
    .select("source_locator, preserved_key, poster_key, metadata")
    .eq("id", assetId)
    .eq("book_id", id)
    .eq("user_id", user.id)
    .single()

  if (!asset) {
    return NextResponse.json({ error: "Memory not found" }, { status: 404 })
  }

  const keys = Array.from(
    new Set(
      [asset.preserved_key, asset.poster_key, asset.source_locator, asset.metadata?.thumbnailSmallKey, asset.metadata?.thumbnailMediumKey].filter(
        (key): key is string =>
          typeof key === "string" && key.startsWith("memory-books/")
      )
    )
  )
  if (keys.length) {
    await enqueueMemoryBookJob({
      userId: user.id,
      bookId: id,
      assetId,
      jobType: "delete_storage",
      idempotencyKey: `delete-memory-asset:${assetId}`,
      payload: { keys },
    })
  }

  await supabaseAdmin
    .from("memory_book_assets")
    .delete()
    .eq("id", assetId)
    .eq("book_id", id)

  const refreshedAssets = await getMemoryBookAssets(id, user.id)
  const draftDocument = reconcileMemoryBookDraft(
    parseMemoryBookDraft(book.draft_document),
    refreshedAssets
  )
  await supabaseAdmin
    .from("memory_books")
    .update({
      title: draftDocument.cover.title.trim() || "Our Family Heritage",
      draft_document: draftDocument,
      draft_version: book.draft_version + 1,
    })
    .eq("id", id)
    .eq("draft_version", book.draft_version)

  return NextResponse.json({ success: true })
}
