export const MEMORY_BOOK_ROBOTS_VALUE =
  "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate"

export function applyMemoryBookPrivateHeaders(
  headers: Headers,
  cacheControl = "private, no-store"
) {
  headers.set("X-Robots-Tag", MEMORY_BOOK_ROBOTS_VALUE)
  headers.set("Referrer-Policy", "no-referrer")
  headers.set("Cache-Control", cacheControl)
  headers.set("Vary", "Cookie")
  return headers
}

export function memoryBookPrivateResponseInit(
  status = 200,
  cacheControl = "private, no-store"
): ResponseInit {
  return {
    status,
    headers: applyMemoryBookPrivateHeaders(new Headers(), cacheControl),
  }
}
