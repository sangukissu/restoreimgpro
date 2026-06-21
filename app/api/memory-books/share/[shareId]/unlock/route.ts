import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
  createMemoryBookViewerSession,
  verifyMemoryBookPin,
} from "@/lib/memory-book/security"
import {
  getPublishedMemoryBookShare,
  MEMORY_BOOK_VIEWER_COOKIE,
} from "@/lib/memory-book/share"

const unlockSchema = z.object({
  signature: z.string().min(20),
  pin: z.string().regex(/^\d{4,8}$/),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const parsed = unlockSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the keepsake PIN" }, { status: 400 })
  }

  const { shareId } = await params
  const shared = await getPublishedMemoryBookShare(
    shareId,
    parsed.data.signature,
    false
  )
  if (!shared?.book.pin_hash) {
    return NextResponse.json({ error: "Keepsake not found" }, { status: 404 })
  }

  const valid = await verifyMemoryBookPin(
    parsed.data.pin,
    shared.book.pin_hash
  )
  if (!valid) {
    return NextResponse.json({ error: "That PIN is not correct" }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(
    MEMORY_BOOK_VIEWER_COOKIE,
    createMemoryBookViewerSession(
      shared.book.share_token,
      shared.book.share_version,
      shared.book.pin_updated_at
    ),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }
  )

  return NextResponse.json({ unlocked: true })
}
