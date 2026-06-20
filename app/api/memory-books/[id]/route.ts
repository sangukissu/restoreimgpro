import { NextResponse } from "next/server"
import { z } from "zod"
import { memoryBookDraftDocumentSchema } from "@/lib/memory-book/types"
import {
  enqueueMemoryBookJob,
  getMemoryBookAssets,
  getOwnerMemoryBookAssetSources,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const updateBookSchema = z.object({
  expectedVersion: z.number().int().positive(),
  draftDocument: memoryBookDraftDocumentSchema.optional(),
  preservationConsent: z.boolean().optional(),
  downloadsEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const [assets, { data: reactions }, { data: entitlement }] = await Promise.all([
    getMemoryBookAssets(id, user.id),
    supabaseAdmin
      .from("memory_book_reactions")
      .select("id, reaction, display_name, note, created_at")
      .eq("book_id", id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("memory_book_entitlements")
      .select("live_book_id, source, granted_at")
      .eq("user_id", user.id)
      .maybeSingle(),
  ])

  const assetSources = await getOwnerMemoryBookAssetSources(assets)
  return NextResponse.json({
    book,
    assets,
    assetSources,
    reactions: reactions || [],
    entitlement,
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = updateBookSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid update", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { id } = await params
  const current = await getOwnedMemoryBook(id, user.id)
  if (!current) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }
  if (current.draft_version !== parsed.data.expectedVersion) {
    return NextResponse.json(
      { error: "This draft changed elsewhere", book: current },
      { status: 409 }
    )
  }

  const nextDraft = parsed.data.draftDocument ?? current.draft_document
  if (parsed.data.draftDocument) {
    const assets = await getMemoryBookAssets(id, user.id)
    const availableIds = new Set(
      assets.filter((asset) => !asset.is_hidden).map((asset) => asset.id)
    )
    const assignedIds = nextDraft.spreads.flatMap((spread) => spread.assetIds)
    if (assignedIds.some((assetId) => !availableIds.has(assetId))) {
      return NextResponse.json(
        { error: "One or more page memories are unavailable" },
        { status: 400 }
      )
    }
  }
  const update = {
    title: nextDraft.cover.title.trim() || "Our Family Heritage",
    draft_document: nextDraft,
    preservation_consent:
      parsed.data.preservationConsent ?? current.preservation_consent,
    downloads_enabled:
      parsed.data.downloadsEnabled ?? current.downloads_enabled,
    music_enabled: parsed.data.musicEnabled ?? current.music_enabled,
    draft_version: current.draft_version + 1,
  }

  const { data: book, error } = await supabaseAdmin
    .from("memory_books")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("draft_version", current.draft_version)
    .select("*")
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!book) {
    return NextResponse.json(
      { error: "This draft changed elsewhere" },
      { status: 409 }
    )
  }

  return NextResponse.json({ book })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const assets = await getMemoryBookAssets(id, user.id)
  const keys = Array.from(
    new Set(
      assets.flatMap((asset) =>
        [asset.preserved_key, asset.poster_key, asset.source_locator, asset.metadata?.thumbnailSmallKey, asset.metadata?.thumbnailMediumKey].filter(
          (key): key is string =>
            typeof key === "string" && key.startsWith("memory-books/")
        )
      )
    )
  )

  if (keys.length) {
    await enqueueMemoryBookJob({
      userId: user.id,
      bookId: id,
      jobType: "delete_storage",
      idempotencyKey: `delete-book-storage:${id}`,
      payload: { keys },
    })
  }

  const { error } = await supabaseAdmin
    .from("memory_books")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
