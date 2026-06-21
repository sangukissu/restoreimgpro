import { after, NextResponse } from "next/server"
import { processMemoryBookAssetJobs } from "@/lib/memory-book/jobs"
import {
  enqueueMemoryBookJob,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  const { id, assetId } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) return NextResponse.json({ error: "Memory book not found" }, { status: 404 })

  const { data: asset } = await supabaseAdmin
    .from("memory_book_assets")
    .select("id, status")
    .eq("id", assetId)
    .eq("book_id", id)
    .eq("user_id", user.id)
    .single()
  if (!asset) return NextResponse.json({ error: "Memory not found" }, { status: 404 })

  await supabaseAdmin
    .from("memory_book_assets")
    .update({ status: "pending", error_message: null })
    .eq("id", assetId)
  await enqueueMemoryBookJob({
    userId: user.id,
    bookId: id,
    assetId,
    jobType: "preserve_asset",
    idempotencyKey: `retry-preserve-asset:${assetId}:${Date.now()}`,
  })
  after(async () => {
    await processMemoryBookAssetJobs({
      userId: user.id,
      bookId: id,
      assetIds: [assetId],
      limit: 1,
    }).catch((error) => {
      console.error("Unable to retry memory preparation", error)
    })
  })
  return NextResponse.json({ queued: true })
}