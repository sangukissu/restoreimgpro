import { after, NextResponse } from "next/server"
import { processMemoryBookJobs } from "@/lib/memory-book/jobs"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"

export const maxDuration = 60

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

  after(async () => {
    await processMemoryBookJobs(4).catch((error) => {
      console.error("Unable to process memory-book jobs", error)
    })
  })

  return NextResponse.json({ processing: true })
}
