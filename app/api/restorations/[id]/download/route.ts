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
    .select("id, user_id, is_unlocked, was_trial, clean_image_path, restored_image_url")
    .eq("id", id)
    .single()

  if (restorationError || !restoration) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (restoration.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let isUnlocked = !!restoration.is_unlocked

  if (!isUnlocked) {
    const { data: paid } = await supabase
      .from("payments")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .limit(1)

    if (paid && paid.length > 0) {
      const { error: unlockError } = await supabase
        .from("image_restorations")
        .update({ is_unlocked: true, unlocked_at: new Date().toISOString() })
        .eq("id", restoration.id)

      if (!unlockError) {
        isUnlocked = true
      }
    }
  }

  if (!isUnlocked) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 })
  }

  if (!restoration.clean_image_path) {
    const url = restoration.restored_image_url
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      return NextResponse.redirect(url)
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { data: blob, error: downloadError } = await supabase.storage
    .from("restored_photos")
    .download(restoration.clean_image_path)

  if (downloadError || !blob) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const buffer = Buffer.from(await blob.arrayBuffer())
  const contentType = blob.type || "image/png"

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="bringback-restored-${id}.png"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  })
}

