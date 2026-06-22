import { NextResponse } from "next/server"
import { z } from "zod"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { buildMemoryBookSharePath } from "@/lib/memory-book/share-slug"
import { hashMemoryBookPin } from "@/lib/memory-book/security"
import { supabaseAdmin } from "@/utils/supabase/admin"

const updatePinSchema = z
  .object({
    pin: z.string().regex(/^\d{6}$/),
    confirmPin: z.string().regex(/^\d{6}$/),
  })
  .refine((value) => value.pin === value.confirmPin, {
    message: "PINs do not match",
    path: ["confirmPin"],
  })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = updatePinSchema.safeParse(
    await request.json().catch(() => ({}))
  )
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Enter a six-digit PIN" },
      { status: 400 }
    )
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book || book.status !== "published") {
    return NextResponse.json(
      { error: "Published memory book not found" },
      { status: 404 }
    )
  }

  const now = new Date().toISOString()
  const { data: updated, error } = await supabaseAdmin
    .from("memory_books")
    .update({
      pin_hash: await hashMemoryBookPin(parsed.data.pin),
      pin_updated_at: now,
      share_version: book.share_version + 1,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("share_slug")
    .single()

  if (error || !updated) {
    return NextResponse.json(
      { error: error?.message || "Unable to change the PIN" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    shareSlug: updated.share_slug,
    displayUrl: `/m/${updated.share_slug}`,
    shareUrl: buildMemoryBookSharePath(updated.share_slug),
  })
}

