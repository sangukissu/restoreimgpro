import { NextResponse } from "next/server"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { signMemoryBookShare } from "@/lib/memory-book/security"
import { buildMemoryBookSharePath } from "@/lib/memory-book/share-slug"
import { supabaseAdmin } from "@/utils/supabase/admin"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book || book.status !== "published") {
    return NextResponse.json({ error: "Published memory book not found" }, { status: 404 })
  }

  const nextShareVersion = book.share_version + 1
  const { data: updated, error } = await supabaseAdmin
    .from("memory_books")
    .update({ share_version: nextShareVersion })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("share_token, share_slug, share_version")
    .single()

  if (error || !updated) {
    return NextResponse.json(
      { error: error?.message || "Unable to regenerate link" },
      { status: 500 }
    )
  }

  const signature = signMemoryBookShare(
    updated.share_token,
    updated.share_version
  )
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

  return NextResponse.json({
    shareSlug: updated.share_slug,
    displayUrl: `/m/${updated.share_slug}`,
    shareUrl: `${baseUrl}${buildMemoryBookSharePath(updated.share_slug, signature)}`,
  })
}
