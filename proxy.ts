import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { securityMiddleware, validateOrigin, detectSuspiciousActivity } from "@/middleware/security"

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/restore' || request.nextUrl.pathname.startsWith('/restore/')) {
    return new Response('Gone', {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex',
      },
    })
  }

  // Apply security middleware first
  const securityResponse = securityMiddleware(request)
  if (securityResponse.status !== 200) {
    return securityResponse
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
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
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
