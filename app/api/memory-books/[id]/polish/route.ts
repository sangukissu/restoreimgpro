import { NextResponse } from "next/server"
import { processMemoryBookJobs } from "@/lib/memory-book/jobs"
import {
  enqueueMemoryBookJob,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const idempotencyKey = `polish-copy:${id}:${book.draft_version}`
  await enqueueMemoryBookJob({
    userId: user.id,
    bookId: id,
    jobType: "polish_copy",
    idempotencyKey,
    payload: { draftVersion: book.draft_version },
  })

  const results = await processMemoryBookJobs(1).catch(() => [])
  return NextResponse.json({
    queued: true,
    completed: results.some((result) => result.status === "completed"),
  })
}
