import { NextResponse } from "next/server"
import { z } from "zod"
import {
  parseMemoryBookDraft,
  reconcileMemoryBookDraft,
} from "@/lib/memory-book/draft"
import {
  getMemoryBookAssets,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const reorderSchema = z.object({
  expectedVersion: z.number().int().positive(),
  assetIds: z.array(z.string().uuid()).min(1).max(12),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = reorderSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success || new Set(parsed.data.assetIds).size !== parsed.data.assetIds.length) {
    return NextResponse.json({ error: "Invalid memory order" }, { status: 400 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }
  if (book.draft_version !== parsed.data.expectedVersion) {
    return NextResponse.json({ error: "This draft changed elsewhere" }, { status: 409 })
  }

  const assets = await getMemoryBookAssets(id, user.id)
  const existingIds = new Set(assets.map((asset) => asset.id))
  if (
    parsed.data.assetIds.length !== assets.length ||
    parsed.data.assetIds.some((assetId) => !existingIds.has(assetId))
  ) {
    return NextResponse.json({ error: "Memory list changed; refresh and try again" }, { status: 409 })
  }

  const { data: versionedBook } = await supabaseAdmin
    .from("memory_books")
    .update({ draft_version: book.draft_version + 1 })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("draft_version", book.draft_version)
    .select("*")
    .maybeSingle()
  if (!versionedBook) {
    return NextResponse.json({ error: "This draft changed elsewhere" }, { status: 409 })
  }

  await Promise.all(
    parsed.data.assetIds.map((assetId, position) =>
      supabaseAdmin
        .from("memory_book_assets")
        .update({ position })
        .eq("id", assetId)
        .eq("book_id", id)
    )
  )

  const reorderedAssets = await getMemoryBookAssets(id, user.id)
  const draftDocument = reconcileMemoryBookDraft(
    parseMemoryBookDraft(versionedBook.draft_document),
    reorderedAssets
  )
  const { data: synchronizedBook } = await supabaseAdmin
    .from("memory_books")
    .update({
      title: draftDocument.cover.title.trim() || "Our Family Heritage",
      draft_document: draftDocument,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("draft_version", versionedBook.draft_version)
    .select("*")
    .maybeSingle()

  return NextResponse.json({
    book: synchronizedBook || versionedBook,
    assets: reorderedAssets,
  })
}
