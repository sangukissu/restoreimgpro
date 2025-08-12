import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  console.log('[Callback] Received', { 
    codePresent: !!code, 
    next, 
    origin,
    error,
    errorDescription,
    fullUrl: request.url 
  })

  // Handle authentication errors (expired links, access denied, etc.)
  if (error) {
    console.log('[Callback] Authentication error detected:', { error, errorDescription })
    
    // Redirect to login with error information
    const loginUrl = new URL('/login', origin)
    if (errorDescription) {
      loginUrl.searchParams.set('error', errorDescription)
    } else if (error === 'access_denied') {
      loginUrl.searchParams.set('error', 'Authentication link expired or invalid. Please request a new one.')
    } else {
      loginUrl.searchParams.set('error', 'Authentication failed. Please try again.')
    }
    
    return NextResponse.redirect(loginUrl)
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      // For magic links, try to get the session directly first
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (sessionData.session) {
        console.log('[Callback] Session already exists, redirecting to dashboard')
        return NextResponse.redirect(`${origin}${next}`)
      }
      
      // If no session, try to exchange the code
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('[Callback] exchangeCodeForSession error', exchangeError)
        
        // Check if it's an expired/invalid code error
        if (exchangeError.message?.includes('expired') || 
            exchangeError.message?.includes('invalid') ||
            exchangeError.message?.includes('already used')) {
          
          const loginUrl = new URL('/login', origin)
          loginUrl.searchParams.set('error', 'Authentication link expired or invalid. Please request a new one.')
          return NextResponse.redirect(loginUrl)
        }
        
        // Check again for session after error
        const { data: retrySessionData } = await supabase.auth.getSession()
        
        if (retrySessionData.session) {
          console.log('[Callback] Session found after retry, redirecting to dashboard')
          return NextResponse.redirect(`${origin}${next}`)
        }
        
        // For other errors, redirect to login with error message
        const loginUrl = new URL('/login', origin)
        loginUrl.searchParams.set('error', exchangeError.message || 'Authentication failed. Please try again.')
        return NextResponse.redirect(loginUrl)
      }

      if (data.session) {
        console.log('[Callback] Session created successfully, redirecting to:', next)
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('[Callback] Unexpected error:', err)
      const loginUrl = new URL('/login', origin)
      loginUrl.searchParams.set('error', 'An unexpected error occurred. Please try again.')
      return NextResponse.redirect(loginUrl)
    }
  }

  // No code and no error - redirect to login
  console.log('[Callback] No code provided, redirecting to login')
  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('error', 'Invalid authentication request. Please try logging in again.')
  return NextResponse.redirect(loginUrl)
}


