import { createHash } from "node:crypto"

export function isMemoryBookEnabled(userId: string, email?: string | null) {
  const internalEmails = (process.env.MEMORY_BOOK_INTERNAL_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (email && internalEmails.includes(email.toLowerCase())) {
    return true
  }

  const rollout = Number.parseInt(
    process.env.MEMORY_BOOK_ROLLOUT_PERCENT || "100",
    10
  )
  const percentage = Number.isFinite(rollout)
    ? Math.max(0, Math.min(100, rollout))
    : 100
  const bucket =
    Number.parseInt(createHash("sha256").update(userId).digest("hex").slice(0, 8), 16) %
    100

  return bucket < percentage
}
