import { NextResponse } from "next/server"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; reactionId: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id, reactionId } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => ({}))
  const hidden = Boolean(body.hidden)

  const { data, error } = await supabaseAdmin
    .from("memory_book_reactions")
    .update({ hidden })
    .eq("id", reactionId)
    .eq("book_id", id)
    .select("id, hidden")
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Unable to update note" },
      { status: 500 }
    )
  }

  return NextResponse.json({ note: data })
}