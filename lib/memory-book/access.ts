import { hashMemoryBookAccessAddress } from "./security"
import { supabaseAdmin } from "@/utils/supabase/admin"

export type MemoryBookPinRateStatus = {
  bookFailures: number
  networkFailures: number
  challengeRequired: boolean
  retryAfterSeconds: number
}

function normalizeRateResult(value: unknown): MemoryBookPinRateStatus {
  const row = Array.isArray(value) ? value[0] : value
  const result = (row || {}) as Record<string, unknown>
  return {
    bookFailures: Number(result.book_failures || 0),
    networkFailures: Number(result.network_failures || 0),
    challengeRequired: result.challenge_required === true,
    retryAfterSeconds: Math.max(0, Number(result.retry_after_seconds || 0)),
  }
}

export function getMemoryBookRequestNetworkHash(request: Request) {
  const address =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    `unknown:${request.headers.get("user-agent") || "no-user-agent"}`
  return hashMemoryBookAccessAddress(address)
}

export async function getMemoryBookPinRateStatus(
  bookId: string | null,
  networkHash: string
) {
  const { data, error } = await supabaseAdmin.rpc(
    "memory_book_pin_rate_status",
    {
      p_book_id: bookId,
      p_network_hash: networkHash,
    }
  )
  if (error) throw new Error(error.message)
  return normalizeRateResult(data)
}

export async function recordMemoryBookPinAttempt(
  bookId: string | null,
  networkHash: string,
  success: boolean
) {
  const { data, error } = await supabaseAdmin.rpc(
    "record_memory_book_pin_attempt",
    {
      p_book_id: bookId,
      p_network_hash: networkHash,
      p_success: success,
    }
  )
  if (error) throw new Error(error.message)
  return normalizeRateResult(data)
}

export async function verifyMemoryBookTurnstile(
  token: string,
  request: Request
) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return process.env.NODE_ENV !== "production"
  if (!token) return false

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip:
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "",
  })
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10_000),
    }
  )
  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}
