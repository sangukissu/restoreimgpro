import { NextResponse } from "next/server"
import { getPublishedMemoryBookShare } from "@/lib/memory-book/share"
import { readMemoryBookAsset } from "@/lib/memory-book/storage"
import { supabaseAdmin } from "@/utils/supabase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareId: string; assetId: string }> }
) {
  const { shareId, assetId } = await params
  const url = new URL(request.url)
  const signature = url.searchParams.get("s") || ""
  const wantsDownload = url.searchParams.get("download") === "1"
  const wantsPoster = url.searchParams.get("poster") === "1"
  const wantsPreview = url.searchParams.get("preview") === "1"

  const shared = await getPublishedMemoryBookShare(shareId, signature)
  if (!shared?.document || !shared.unlocked) {
    return NextResponse.json({ error: "Memory not found" }, { status: 404 })
  }
  if (wantsDownload && !shared.book.downloads_enabled) {
    return NextResponse.json({ error: "Downloads are disabled" }, { status: 403 })
  }

  const referenced = shared.document.spreads.some((spread) =>
    spread.right.assets.some((asset) => asset.id === assetId)
  )
  if (!referenced) {
    return NextResponse.json({ error: "Memory not found" }, { status: 404 })
  }

  const { data: asset } = await supabaseAdmin
    .from("memory_book_assets")
    .select("preserved_key, poster_key, media_type, original_label, metadata")
    .eq("id", assetId)
    .eq("book_id", shared.book.id)
    .eq("status", "ready")
    .single()

  const previewKey =
    typeof asset?.metadata?.thumbnailMediumKey === "string"
      ? asset.metadata.thumbnailMediumKey
      : null
  const key = wantsPreview
    ? previewKey
    : wantsPoster
      ? asset?.poster_key
      : asset?.preserved_key
  if (!asset || !key) {
    return NextResponse.json({ error: "Memory is unavailable" }, { status: 404 })
  }

  try {
    const range = request.headers.get("range")
    const { body, contentType, contentLength, lastModified, contentRange } =
      await readMemoryBookAsset(key, range)
    const headers = new Headers({
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": wantsPreview
        ? "private, max-age=31536000, immutable"
        : "private, max-age=300",
      "Accept-Ranges": "bytes",
      "X-Robots-Tag": "noindex, noarchive",
    })

    if (contentLength) headers.set("Content-Length", String(contentLength))
    if (lastModified) headers.set("Last-Modified", lastModified)
    if (contentRange) headers.set("Content-Range", contentRange)
    if (wantsDownload) {
      const extension = asset.media_type === "video" ? "mp4" : "jpg"
      const filename = asset.original_label.replace(/[^a-z0-9-_]+/gi, "-")
      headers.set(
        "Content-Disposition",
        `attachment; filename="${filename || "bringback-memory"}.${extension}"`
      )
    }

    return new Response(body as BodyInit, {
      status: range && contentRange ? 206 : 200,
      headers,
    })
  } catch {
    return NextResponse.json({ error: "Memory is unavailable" }, { status: 404 })
  }
}
