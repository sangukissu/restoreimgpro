import { NextResponse } from "next/server"
import { processMemoryBookJobs } from "@/lib/memory-book/jobs"

export const maxDuration = 60

export async function POST(request: Request) {
  const configuredSecret = process.env.MEMORY_BOOK_WORKER_SECRET
  const authorization = request.headers.get("authorization")

  if (!configuredSecret || authorization !== `Bearer ${configuredSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { limit?: unknown }
  const limit =
    typeof body.limit === "number"
      ? Math.max(1, Math.min(Math.floor(body.limit), 25))
      : 10

  const results = await processMemoryBookJobs(limit)
  return NextResponse.json({ processed: results.length, results })
}
