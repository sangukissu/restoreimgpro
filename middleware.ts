import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// Only run middleware on /dashboard and its subroutes
export const config = {
  matcher: [
    '/dashboard/:path*'
  ],
}
