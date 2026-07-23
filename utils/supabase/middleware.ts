import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAuthRetryableFetchError } from '@supabase/supabase-js'
import { sanitizeAuthDestination } from '@/lib/auth/redirect'

function markAuthResponsePrivate(response: NextResponse) {
  response.headers.set(
    'Cache-Control',
    'private, no-cache, no-store, must-revalidate, max-age=0',
  )
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  const vary = new Set(
    (response.headers.get('Vary') || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  )
  vary.add('Cookie')
  response.headers.set('Vary', Array.from(vary).join(', '))

  return response
}

function copySupabaseSessionState(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie))

  for (const header of ['cache-control', 'pragma', 'expires']) {
    const value = source.headers.get(header)
    if (value) target.headers.set(header, value)
  }

  return markAuthResponsePrivate(target)
}

function isRetryableAuthFailure(error: unknown) {
  if (isAuthRetryableFetchError(error)) return true
  if (!error || typeof error !== 'object') return false

  const status = 'status' in error ? Number(error.status) : 0
  return status === 0 || status === 429 || status >= 500
}

function sessionCheckResponse(
  request: NextRequest,
  supabaseResponse: NextResponse,
) {
  console.warn('[auth] Retryable session verification failure', {
    pathname: request.nextUrl.pathname,
  })

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return copySupabaseSessionState(
      supabaseResponse,
      NextResponse.json(
        { error: 'Session verification is temporarily unavailable.' },
        { status: 503, headers: { 'Retry-After': '1' } },
      ),
    )
  }

  const fallback = request.nextUrl.pathname.startsWith('/admin')
    ? '/admin/users'
    : '/dashboard'
  const destination = sanitizeAuthDestination(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    fallback,
  )
  const retryUrl = request.nextUrl.clone()
  retryUrl.pathname = '/auth/session-check'
  retryUrl.search = ''
  retryUrl.searchParams.set('next', destination)

  const response = NextResponse.rewrite(retryUrl)
  response.headers.set('Retry-After', '1')
  return copySupabaseSessionState(supabaseResponse, response)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  let claims: Record<string, unknown> | null = null
  let authError: unknown = null

  try {
    const { data, error } = await supabase.auth.getClaims()
    claims = data?.claims ?? null
    authError = error
  } catch (error) {
    authError = error
  }

  if (authError && isRetryableAuthFailure(authError)) {
    return sessionCheckResponse(request, supabaseResponse)
  }

  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'
  const isProtectedPage =
    pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isProtectedApi = pathname.startsWith('/api/admin')

  if (claims?.sub && isLoginPage) {
    const destination = sanitizeAuthDestination(
      request.nextUrl.searchParams.get('next'),
    )
    const response = NextResponse.redirect(new URL(destination, request.url))
    return copySupabaseSessionState(supabaseResponse, response)
  }

  if (!claims?.sub && (isProtectedPage || isProtectedApi)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''

    if (!isProtectedApi) {
      const fallback = pathname.startsWith('/admin')
        ? '/admin/users'
        : '/dashboard'
      const destination = sanitizeAuthDestination(
        `${pathname}${request.nextUrl.search}`,
        fallback,
      )
      url.searchParams.set('next', destination)
    }

    return copySupabaseSessionState(
      supabaseResponse,
      NextResponse.redirect(url),
    )
  }

  return markAuthResponsePrivate(supabaseResponse)
}
