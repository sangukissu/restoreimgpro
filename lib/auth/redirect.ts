const DEFAULT_AUTH_DESTINATION = "/dashboard"
const ALLOWED_AUTH_PREFIXES = ["/dashboard", "/admin"] as const
const AUTH_BASE_URL = "https://bringback.local"

export function sanitizeAuthDestination(
  value: string | null | undefined,
  fallback = DEFAULT_AUTH_DESTINATION,
) {
  if (!value) return fallback

  const candidate = value.trim()
  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return fallback
  }

  try {
    const parsed = new URL(candidate, AUTH_BASE_URL)
    if (parsed.origin !== AUTH_BASE_URL) return fallback

    const isAllowed = ALLOWED_AUTH_PREFIXES.some(
      (prefix) =>
        parsed.pathname === prefix ||
        parsed.pathname.startsWith(`${prefix}/`),
    )

    if (!isAllowed) return fallback

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
