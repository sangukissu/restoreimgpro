import { after, NextResponse } from "next/server"
import { z } from "zod"
import {
  ensureMemoryBookUploadPreviewJobs,
  processMemoryBookAssetJobs,
} from "@/lib/memory-book/jobs"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"

export const maxDuration = 60

const processSchema = z.object({
  assetIds: z.array(z.string().uuid()).max(12).default([]),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = processSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid preview request" }, { status: 400 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const assetIds = await ensureMemoryBookUploadPreviewJobs({
    userId: user.id,
    bookId: id,
    assetIds: parsed.data.assetIds.length ? parsed.data.assetIds : undefined,
  })

  if (assetIds.length) {
    after(async () => {
      await processMemoryBookAssetJobs({
        userId: user.id,
        bookId: id,
        assetIds,
        limit: assetIds.length,
      }).catch((error) => {
        console.error("Unable to process memory-book upload previews", error)
      })
    })
  }

  return NextResponse.json({ processing: assetIds.length > 0, assetIds })
}
