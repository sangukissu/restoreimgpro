import { NextResponse } from "next/server"
import { z } from "zod"
import { getR2PresignedUploadUrl } from "@/lib/r2"
import {
  getMemoryBookAssets,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { memoryBookAssetKey } from "@/lib/memory-book/storage"
import { supabaseAdmin } from "@/utils/supabase/admin"

const uploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(12 * 1024 * 1024),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = uploadSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Upload must be a JPG, PNG, or WebP image under 12MB" },
      { status: 400 }
    )
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const assets = await getMemoryBookAssets(id, user.id)
  if (assets.length >= 12) {
    return NextResponse.json(
      { error: "A Family Heritage book can contain up to 12 memories" },
      { status: 409 }
    )
  }

  const { data: asset, error } = await supabaseAdmin
    .from("memory_book_assets")
    .insert({
      book_id: id,
      user_id: user.id,
      source_type: "upload",
      media_type: "image",
      original_label: parsed.data.filename.replace(/[<>]/g, ""),
      alt_text: "Uploaded family memory",
      position: assets.length,
      status: "pending",
      metadata: {
        originalFilename: parsed.data.filename,
        contentType: parsed.data.contentType,
        size: parsed.data.size,
      },
    })
    .select("*")
    .single()

  if (error || !asset) {
    return NextResponse.json(
      { error: error?.message || "Unable to prepare upload" },
      { status: 500 }
    )
  }

  const extension =
    parsed.data.contentType === "image/png"
      ? ".png"
      : parsed.data.contentType === "image/webp"
        ? ".webp"
        : ".jpg"
  const key = memoryBookAssetKey({
    userId: user.id,
    bookId: id,
    assetId: asset.id,
    mediaType: "image",
    extension,
  })
  const uploadUrl = await getR2PresignedUploadUrl(key, parsed.data.contentType)

  await supabaseAdmin
    .from("memory_book_assets")
    .update({ source_locator: key })
    .eq("id", asset.id)

  return NextResponse.json({ assetId: asset.id, key, uploadUrl })
}
