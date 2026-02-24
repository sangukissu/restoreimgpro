import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { data: restoration, error: restorationError } = await supabase
    .from("image_restorations")
    .select("id, user_id, restored_image_url")
    .eq("id", id)
    .single()

  if (restorationError || !restoration) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (restoration.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const url = restoration.restored_image_url
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Fetch the image from the public URL
  const response = await fetch(url)
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const contentType = response.headers.get("content-type") || "image/png"

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="bringback-restored-${id}.png"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  })
}

