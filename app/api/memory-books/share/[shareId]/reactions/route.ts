import { NextResponse } from "next/server"
import { z } from "zod"
import { processMemoryBookJobs } from "@/lib/memory-book/jobs"
import { applyMemoryBookPrivateHeaders } from "@/lib/memory-book/privacy"
import { hashReactionAddress } from "@/lib/memory-book/security"
import { getPublishedMemoryBookShare } from "@/lib/memory-book/share"
import { enqueueMemoryBookJob } from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const reactionSchema = z.object({
  reaction: z.enum(["love", "moved", "remember", "thank_you"]),
  displayName: z.string().trim().max(60).optional().default(""),
  note: z.string().trim().max(280).optional().default(""),
})

function json(body: Record<string, unknown>, status = 200) {
  const response = NextResponse.json(body, { status })
  applyMemoryBookPrivateHeaders(response.headers)
  return response
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const parsed = reactionSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return json({ error: "Invalid reaction" }, 400)

  const { shareId } = await params
  const shared = await getPublishedMemoryBookShare(shareId)
  if (!shared?.document || !shared.unlocked) {
    return json({ error: "Keepsake not found" }, 404)
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  const ipHash = hashReactionAddress(ip)
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabaseAdmin
    .from("memory_book_reactions")
    .select("id", { count: "exact", head: true })
    .eq("book_id", shared.book.id)
    .eq("ip_hash", ipHash)
    .gte("created_at", since)

  if ((count || 0) >= 3) {
    return json({ error: "You have already shared your appreciation" }, 429)
  }

  const { data: reaction, error } = await supabaseAdmin
    .from("memory_book_reactions")
    .insert({
      book_id: shared.book.id,
      reaction: parsed.data.reaction,
      display_name: parsed.data.displayName,
      note: parsed.data.note,
      ip_hash: ipHash,
      notification_status: "queued",
    })
    .select("id")
    .single()

  if (error || !reaction) {
    return json({ error: error?.message || "Unable to save reaction" }, 500)
  }

  const hourBucket = new Date().toISOString().slice(0, 13)
  await enqueueMemoryBookJob({
    userId: shared.book.user_id,
    bookId: shared.book.id,
    jobType: "reaction_email",
    idempotencyKey: `reaction-email:${shared.book.id}:${hourBucket}`,
  })
  await processMemoryBookJobs(1).catch(() => null)

  return json({ received: true })
}