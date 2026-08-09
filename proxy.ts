import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { securityMiddleware, validateOrigin, detectSuspiciousActivity, isProtectedMemoryBookCrawler } from "@/middleware/security"

/**
 * The retired /restore/* pSEO cluster (149 pages, deleted 2026-06-08).
 *
 * 2026-08-09 — replaced the blanket "everything → /old-photo-restoration" rule.
 * Pointing 149 URLs at a single page is a many-to-one redirect that Google
 * treats as a soft 404, so none of the retained equity transferred. These slugs
 * carry real impressions in GSC and have a genuinely equivalent destination, so
 * they now redirect somewhere topically honest. Everything else still falls
 * through to /old-photo-restoration, which IS the correct match for the
 * "fix-<damage>-<subject>-photo" permutations that made up the bulk of the set.
 */
const RESTORE_SLUG_REDIRECTS: Record<string, string> = {
  // Animation intent — 1,770 impressions at position 5.61.
  'animate-old-photos': '/ai-photo-animation',

  // Competitor comparison intent — we have real alternative pages for these.
  // /restore/nero-ai-photo-restoration alone held 1,004 impressions at 7.73.
  'nero-ai-photo-restoration': '/compare/nero-ai-alternative',
  'gemini-photo-restoration': '/compare',
  'chatgpt-photo-restoration': '/compare',
  'best-photo-restoration-app': '/compare',

  // Scanning / digitising intent — matches the existing guide exactly.
  'how-to-scan-old-photos-for-the-best-resolution': '/guides/scan-family-photos-safely',
  'how-to-scan-old-pictures': '/guides/scan-family-photos-safely',
  'best-way-to-scan-photos': '/guides/scan-family-photos-safely',
  'best-way-to-digitize-photos': '/guides/scan-family-photos-safely',
  'how-can-i-digitize-old-photos': '/guides/scan-family-photos-safely',
  'convert-pictures-to-digital': '/guides/scan-family-photos-safely',

  // Colour intent.
  'colorize-black-and-white': '/colorize-photos',
  'old-photo-color-restoration-online': '/colorize-photos',

  // Sharpness / resolution intent.
  'enhance-photo-quality': '/denoise-photos',
}

/** Blur and low-resolution permutations belong on the unblur/sharpen page. */
const SHARPNESS_SLUG_PATTERN = /^fix-(blurry|low-resolution)-/

function resolveRestoreDestination(pathname: string): string {
  const slug = pathname.replace(/^\/restore\/?/, '').replace(/\/$/, '')
  if (!slug) return '/old-photo-restoration'
  if (RESTORE_SLUG_REDIRECTS[slug]) return RESTORE_SLUG_REDIRECTS[slug]
  if (SHARPNESS_SLUG_PATTERN.test(slug)) return '/denoise-photos'
  return '/old-photo-restoration'
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/restore' || request.nextUrl.pathname.startsWith('/restore/')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = resolveRestoreDestination(request.nextUrl.pathname)
    redirectUrl.search = ''

    return Response.redirect(redirectUrl, 301)
  }

  const isProtectedMemoryBookRoute =
    request.nextUrl.pathname.startsWith("/m/") ||
    request.nextUrl.pathname.startsWith("/api/memory-books/share/")

  if (isProtectedMemoryBookRoute && isProtectedMemoryBookCrawler(request)) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate",
        "Referrer-Policy": "no-referrer",
        "Cache-Control": "private, no-store",
        Vary: "Cookie",
      },
    })
  }

  // Apply security middleware first
  const securityResponse = securityMiddleware(request)
  if (securityResponse.status !== 200) {
    return securityResponse
  }

  if (isProtectedMemoryBookRoute) {
    securityResponse.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate"
    )
    securityResponse.headers.set("Referrer-Policy", "no-referrer")
    if (request.nextUrl.pathname.startsWith("/m/")) {
      securityResponse.headers.set("Cache-Control", "private, no-store")
    }
    securityResponse.headers.set("Vary", "Cookie")
  }

  // Check for suspicious activity on sensitive routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const isTrustedCallbackRoute =
      request.nextUrl.pathname.includes('/webhook') ||
      request.nextUrl.pathname === '/api/memory-books/worker'

    if (!isTrustedCallbackRoute && detectSuspiciousActivity(request)) {
      return new Response('Forbidden', { status: 403 })
    }

    // Validate origin for state-changing operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      // Skip origin check for webhooks
      if (!isTrustedCallbackRoute) {
        if (!validateOrigin(request)) {
          return new Response('Invalid origin', { status: 403 })
        }
      }
    }
  }

  // Apply Supabase session middleware for protected routes
  // Keep authentication routing centralized for every protected application surface.
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api/admin') ||
    request.nextUrl.pathname === '/login'
  ) {
    return await updateSession(request)
  }

  return securityResponse
}

// Run middleware on all routes for security, specific routes for auth
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
