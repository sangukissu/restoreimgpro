import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)

function getShareSecret() {
  const secret =
    process.env.MEMORY_BOOK_SHARE_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secret) {
    throw new Error("MEMORY_BOOK_SHARE_SECRET is not configured")
  }

  return secret
}

export function signMemoryBookShare(shareToken: string, shareVersion: number) {
  return createHmac("sha256", getShareSecret())
    .update(`${shareToken}.${shareVersion}`)
    .digest("base64url")
}

export function verifyMemoryBookShare(
  shareToken: string,
  shareVersion: number,
  signature: string
) {
  const expected = signMemoryBookShare(shareToken, shareVersion)
  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(signature)

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  )
}

export async function hashMemoryBookPin(pin: string) {
  const salt = randomBytes(16)
  const derived = (await scrypt(pin, salt, 64)) as Buffer
  return `scrypt:${salt.toString("base64url")}:${derived.toString("base64url")}`
}

export async function verifyMemoryBookPin(pin: string, storedHash: string) {
  const [algorithm, saltValue, hashValue] = storedHash.split(":")
  if (algorithm !== "scrypt" || !saltValue || !hashValue) {
    return false
  }

  const salt = Buffer.from(saltValue, "base64url")
  const expected = Buffer.from(hashValue, "base64url")
  const derived = (await scrypt(pin, salt, expected.length)) as Buffer

  return derived.length === expected.length && timingSafeEqual(derived, expected)
}

export function getMemoryBookViewerCookieName(shareToken: string) {
  return `bringback_memory_viewer_${createHmac("sha256", getShareSecret())
    .update(`cookie.${shareToken}`)
    .digest("hex")
    .slice(0, 20)}`
}

export function hashMemoryBookAccessAddress(address: string) {
  return createHmac("sha256", getShareSecret())
    .update(`memory-book-access.${address}`)
    .digest("hex")
}

export function createMemoryBookViewerSession(
  shareToken: string,
  shareVersion: number,
  pinUpdatedAt: string | null
) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(
    JSON.stringify({
      shareToken,
      shareVersion,
      pinUpdatedAt: pinUpdatedAt || null,
      issuedAt,
    })
  ).toString("base64url")
  const signature = createHmac("sha256", getShareSecret())
    .update(payload)
    .digest("base64url")
  return `${payload}.${signature}`
}

export function verifyMemoryBookViewerSession(
  session: string | undefined,
  shareToken: string,
  shareVersion: number,
  pinUpdatedAt: string | null
) {
  if (!session) {
    return false
  }

  try {
    const [payload, signature, extra] = session.split(".")
    if (!payload || !signature || extra) {
      return false
    }

    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as {
      shareToken?: unknown
      shareVersion?: unknown
      pinUpdatedAt?: unknown
      issuedAt?: unknown
    }
    if (
      parsed.shareToken !== shareToken ||
      parsed.shareVersion !== shareVersion ||
      parsed.pinUpdatedAt !== (pinUpdatedAt || null)
    ) {
      return false
    }

    const issuedAt = Number(parsed.issuedAt)
    if (!Number.isFinite(issuedAt) || Date.now() / 1000 - issuedAt > 60 * 60 * 24 * 30) {
      return false
    }

    const expected = createHmac("sha256", getShareSecret())
      .update(payload)
      .digest("base64url")
    const expectedBuffer = Buffer.from(expected)
    const providedBuffer = Buffer.from(signature)

    return (
      expectedBuffer.length === providedBuffer.length &&
      timingSafeEqual(expectedBuffer, providedBuffer)
    )
  } catch {
    return false
  }
}

export function hashReactionAddress(address: string) {
  const dateBucket = new Date().toISOString().slice(0, 10)
  return createHmac("sha256", getShareSecret())
    .update(`${dateBucket}.${address}`)
    .digest("hex")
}
