import { NextResponse } from "next/server"
import { z } from "zod"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const completeSchema = z.object({
  assetId: z.string().uuid(),
  key: z.string().min(1).max(500),
})

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

  const expectedPrefix = `memory-books/${user.id}/${id}/${parsed.data.assetId}`
  if (!parsed.data.key.startsWith(expectedPrefix)) {
    return NextResponse.json({ error: "Invalid upload key" }, { status: 403 })
  }

  const { data: asset, error } = await supabaseAdmin
    .from("memory_book_assets")
    .update({
      source_locator: parsed.data.key,
      preserved_key: parsed.data.key,
      status: "ready",
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

  await supabaseAdmin
    .from("memory_books")
    .update({ draft_version: book.draft_version + 1 })
    .eq("id", id)
    .eq("draft_version", book.draft_version)

  return NextResponse.json({ asset })
}
