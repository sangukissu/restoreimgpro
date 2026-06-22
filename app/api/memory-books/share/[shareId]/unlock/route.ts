import { NextResponse } from "next/server"
import { z } from "zod"
import {
  getMemoryBookPinRateStatus,
  getMemoryBookRequestNetworkHash,
  recordMemoryBookPinAttempt,
  verifyMemoryBookTurnstile,
} from "@/lib/memory-book/access"
import { applyMemoryBookPrivateHeaders } from "@/lib/memory-book/privacy"
import {
  createMemoryBookViewerSession,
  getMemoryBookViewerCookieName,
  hashMemoryBookPin,
  verifyMemoryBookPin,
} from "@/lib/memory-book/security"
import { getPublishedMemoryBookShare } from "@/lib/memory-book/share"

const unlockSchema = z.object({
  pin: z.string().regex(/^\d{6}$/),
  turnstileToken: z.string().optional().default(""),
})

const dummyPinHash = hashMemoryBookPin("000000")
const GENERIC_ERROR = "That PIN could not open this keepsake."

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  retryAfterSeconds = 0
) {
  const response = NextResponse.json(body, { status })
  applyMemoryBookPrivateHeaders(response.headers)
  if (retryAfterSeconds > 0) {
    response.headers.set("Retry-After", String(retryAfterSeconds))
  }
  return response
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const parsed = unlockSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return jsonResponse({ error: GENERIC_ERROR }, 400)
  }

  const { shareId } = await params
  const shared = await getPublishedMemoryBookShare(shareId, "", false)
  const book = shared?.book || null
  const networkHash = getMemoryBookRequestNetworkHash(request)
  const rate = await getMemoryBookPinRateStatus(book?.id || null, networkHash)

  if (rate.retryAfterSeconds > 0) {
    return jsonResponse(
      {
        error: "Too many attempts. Please wait before trying again.",
        challengeRequired: true,
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      429,
      rate.retryAfterSeconds
    )
  }

  if (rate.challengeRequired) {
    const challengeValid = await verifyMemoryBookTurnstile(
      parsed.data.turnstileToken,
      request
    )
    if (!challengeValid) {
      return jsonResponse(
        { error: GENERIC_ERROR, challengeRequired: true },
        403
      )
    }
  }

  const storedHash = book?.pin_hash || (await dummyPinHash)
  const pinMatches = await verifyMemoryBookPin(parsed.data.pin, storedHash)

  if (!book || !pinMatches) {
    const nextRate = await recordMemoryBookPinAttempt(
      book?.id || null,
      networkHash,
      false
    )
    const status = nextRate.retryAfterSeconds > 0 ? 429 : 401
    return jsonResponse(
      {
        error:
          status === 429
            ? "Too many attempts. Please wait before trying again."
            : GENERIC_ERROR,
        challengeRequired: nextRate.challengeRequired,
        retryAfterSeconds: nextRate.retryAfterSeconds,
      },
      status,
      nextRate.retryAfterSeconds
    )
  }

  await recordMemoryBookPinAttempt(book.id, networkHash, true)
  const response = jsonResponse({ unlocked: true }, 200)
  response.cookies.set(
    getMemoryBookViewerCookieName(book.share_token),
    createMemoryBookViewerSession(
      book.share_token,
      book.share_version,
      book.pin_updated_at
    ),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    }
  )
  return response
}