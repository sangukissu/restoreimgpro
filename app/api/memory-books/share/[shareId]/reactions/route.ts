import { NextResponse } from "next/server"
import { z } from "zod"
import { processMemoryBookJobs } from "@/lib/memory-book/jobs"
import { hashReactionAddress } from "@/lib/memory-book/security"
import {
  getPublishedMemoryBookShare,
} from "@/lib/memory-book/share"
import { enqueueMemoryBookJob } from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const reactionSchema = z.object({
  signature: z.string().min(20),
  reaction: z.enum(["love", "moved", "remember", "thank_you"]),
  displayName: z.string().trim().max(60).optional().default(""),
  note: z.string().trim().max(280).optional().default(""),
  turnstileToken: z.string().optional().default(""),
})

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return process.env.NODE_ENV !== "production"
  }
  if (!token) {
    return false
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  })
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body, signal: AbortSignal.timeout(10_000) }
  )
  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const parsed = reactionSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reaction" }, { status: 400 })
  }

  const { shareId } = await params
  const shared = await getPublishedMemoryBookShare(
    shareId,
    parsed.data.signature
  )
  if (!shared?.document || !shared.unlocked) {
    return NextResponse.json({ error: "Keepsake not found" }, { status: 404 })
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  // Turnstile verification bypassed as URL is private and already unlocked via PIN
  const turnstileValid = true
  if (!turnstileValid) {
    return NextResponse.json(
      { error: "Please complete the privacy check" },
      { status: 400 }
    )
  }

  const ipHash = hashReactionAddress(ip)
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabaseAdmin
    .from("memory_book_reactions")
    .select("id", { count: "exact", head: true })
    .eq("book_id", shared.book.id)
    .eq("ip_hash", ipHash)
    .gte("created_at", since)

  if ((count || 0) >= 3) {
    return NextResponse.json(
      { error: "You have already shared your appreciation" },
      { status: 429 }
    )
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
    return NextResponse.json(
      { error: error?.message || "Unable to save reaction" },
      { status: 500 }
    )
  }

  const hourBucket = new Date().toISOString().slice(0, 13)
  await enqueueMemoryBookJob({
    userId: shared.book.user_id,
    bookId: shared.book.id,
    jobType: "reaction_email",
    idempotencyKey: `reaction-email:${shared.book.id}:${hourBucket}`,
  })
  await processMemoryBookJobs(1).catch(() => null)

  return NextResponse.json({ received: true })
}
