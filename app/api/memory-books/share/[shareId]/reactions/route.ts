import { NextResponse } from "next/server"
import { processMemoryBookJobs } from "@/lib/memory-book/jobs"
import { applyMemoryBookPrivateHeaders } from "@/lib/memory-book/privacy"
import { getPublishedMemoryBookShare } from "@/lib/memory-book/share"
import { enqueueMemoryBookJob } from "@/lib/memory-book/server"
import {
  hashReactionAddress,
  hashInkColorKey,
} from "@/lib/memory-book/security"
import { supabaseAdmin } from "@/utils/supabase/admin"

export type MarginaliaNote = {
  id: string
  reaction: string
  display_name: string
  note: string
  page_index: number | null
  ink_color_key: number
  created_at: string
}

function json(body: Record<string, unknown>, status = 200) {
  const response = NextResponse.json(body, { status })
  applyMemoryBookPrivateHeaders(response.headers)
  return response
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params
  const shared = await getPublishedMemoryBookShare(shareId)
  if (!shared?.document || !shared.unlocked) {
    return json({ error: "Keepsake not found" }, 404)
  }

  const { data, error } = await supabaseAdmin
    .from("memory_book_reactions")
    .select(
      "id, reaction, display_name, note, page_index, ink_color_key, created_at"
    )
    .eq("book_id", shared.book.id)
    .eq("hidden", false)
    .order("created_at", { ascending: true })

  if (error) {
    return json({ error: "Unable to load notes" }, 500)
  }

  return json({ notes: (data || []) as MarginaliaNote[] })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params
  const shared = await getPublishedMemoryBookShare(shareId)
  if (!shared?.document || !shared.unlocked) {
    return json({ error: "Keepsake not found" }, 404)
  }

  const body = await request.json().catch(() => ({}))
  const reaction = String(body.reaction || "")
  if (!["love", "moved", "remember", "thank_you"].includes(reaction)) {
    return json({ error: "Invalid reaction" }, 400)
  }

  const displayName = String(body.displayName || "").trim().slice(0, 60)
  const note = String(body.note || "").trim().slice(0, 280)

  let pageIndex: number | null = null
  if (body.pageIndex !== null && body.pageIndex !== undefined) {
    const parsed = Number(body.pageIndex)
    if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
      pageIndex = Math.floor(parsed)
    }
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"

  // Ink colour is stable per reader (name + address), so a family member's
  // handwriting stays in the same ink across every page they annotate.
  const inkColorKey = hashInkColorKey(
    `${displayName}|${ip}`,
    body.inkColorKey
  )

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

  const { data: inserted, error } = await supabaseAdmin
    .from("memory_book_reactions")
    .insert({
      book_id: shared.book.id,
      reaction,
      display_name: displayName,
      note,
      page_index: pageIndex,
      ink_color_key: inkColorKey,
      ip_hash: ipHash,
      notification_status: "queued",
    })
    .select(
      "id, reaction, display_name, note, page_index, ink_color_key, created_at"
    )
    .single()

  if (error || !inserted) {
    return json({ error: error?.message || "Unable to save note" }, 500)
  }

  const hourBucket = new Date().toISOString().slice(0, 13)
  await enqueueMemoryBookJob({
    userId: shared.book.user_id,
    bookId: shared.book.id,
    jobType: "reaction_email",
    idempotencyKey: `reaction-email:${shared.book.id}:${hourBucket}`,
  })
  await processMemoryBookJobs(1).catch(() => null)

  return json({ received: true, note: inserted as MarginaliaNote })
}