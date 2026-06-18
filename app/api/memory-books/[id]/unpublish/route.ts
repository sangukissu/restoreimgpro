import { NextResponse } from "next/server"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id } = await params
  if (!(await getOwnedMemoryBook(id, user.id))) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const { error } = await supabase.rpc("unpublish_memory_book", {
    p_book_id: id,
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ unpublished: true })
}
