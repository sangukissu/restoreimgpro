import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { securityMiddleware, validateOrigin, detectSuspiciousActivity } from "@/middleware/security"

export async function middleware(request: NextRequest) {
  // Apply security middleware first
  const securityResponse = securityMiddleware(request)
  if (securityResponse.status !== 200) {
    return securityResponse
  }

  // Check for suspicious activity on sensitive routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (detectSuspiciousActivity(request)) {
      return new Response('Forbidden', { status: 403 })
    }

    // Validate origin for state-changing operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      // Skip origin check for webhooks
      if (!request.nextUrl.pathname.includes('/webhook')) {
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
