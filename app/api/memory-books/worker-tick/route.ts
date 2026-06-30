import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { processMemoryBookJobs } from "@/lib/memory-book/jobs"

export const maxDuration = 60

/**
 * User-scoped memory book worker. Unlike /api/memory-books/worker (which is
 * protected by a shared secret and intended for the Supabase pg_cron job),
 * this endpoint authenticates the caller as a logged-in user and drains a
 * small batch of global memory-book jobs. It is safe to call from the
 * browser.
 *
 * This is the safety net: if the global cron is not registered (e.g. missing
 * vault secrets), the curator still self-heals by hitting this endpoint while
 * the user has the page open and assets are pending.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { limit?: unknown }
  const requested =
    typeof body.limit === "number"
      ? Math.floor(body.limit)
      : 10
  // Cap low to avoid hammering the worker from one tab.
  const limit = Math.max(1, Math.min(requested, 5))

  try {
    const results = await processMemoryBookJobs(limit)
    return NextResponse.json({ processed: results.length, results })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Worker failed" },
      { status: 500 }
    )
  }
}
