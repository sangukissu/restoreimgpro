import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: restoration, error } = await supabaseAdmin
    .from("image_restorations")
    .select("restored_image_url, preview_image_path, clean_image_path, is_unlocked")
    .eq("id", id)
    .single()

  if (error || !restoration) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const storagePath =
    restoration.is_unlocked && restoration.clean_image_path
      ? restoration.clean_image_path
      : restoration.preview_image_path || restoration.clean_image_path

  if (!storagePath) {
    const url = restoration.restored_image_url
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      return NextResponse.redirect(url)
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { data: blob, error: downloadError } = await supabaseAdmin.storage
    .from("restored_photos")
    .download(storagePath)

  if (downloadError || !blob) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const buffer = Buffer.from(await blob.arrayBuffer())
  const contentType = blob.type || "image/png"

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
    },
  })
}

