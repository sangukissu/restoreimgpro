import { NextResponse } from "next/server"
import { z } from "zod"
import {
  enqueueMemoryBookJob,
  getMemoryBookAssets,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const updateBookSchema = z.object({
  expectedVersion: z.number().int().positive(),
  title: z.string().trim().min(1).max(90).optional(),
  honoree: z.string().trim().max(100).optional(),
  periodLabel: z.string().trim().max(80).optional(),
  dedication: z.string().trim().max(600).optional(),
  notes: z.string().trim().max(420).optional(),
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

  return NextResponse.json({
    book,
    assets,
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

  const nextVersion = current.draft_version + 1
  const update = {
    title: parsed.data.title ?? current.title,
    honoree: parsed.data.honoree ?? current.honoree,
    period_label: parsed.data.periodLabel ?? current.period_label,
    dedication: parsed.data.dedication ?? current.dedication,
    notes: parsed.data.notes ?? current.notes,
    preservation_consent:
      parsed.data.preservationConsent ?? current.preservation_consent,
    downloads_enabled:
      parsed.data.downloadsEnabled ?? current.downloads_enabled,
    music_enabled: parsed.data.musicEnabled ?? current.music_enabled,
    draft_version: nextVersion,
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
        [asset.preserved_key, asset.poster_key, asset.source_locator].filter(
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
