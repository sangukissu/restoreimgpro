"use client"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail } from "lucide-react"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import Image from "next/image"
import Link from "next/link"
import { signInWithMagicLink, signInWithGoogle, type AuthState } from "./actions"
import { createClient } from "@/utils/supabase/client"

// Route-level metadata is defined in app/login/head.tsx to avoid exporting
// metadata from a client component. This page remains a client component
// for interactive login behaviors.

function MagicLinkSubmit() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium rounded-lg h-12">
      {pending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending link...</>) : (<><Mail className="mr-2 h-4 w-4" />Send Magic Link</>)}
    </Button>
  )
}

function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Persist last used method for UX badge
      document.cookie = 'last_auth=google; path=/; max-age=31536000; SameSite=Lax'
      await signInWithGoogle()
    } catch (error) {
      setIsLoading(false)
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      onClick={handleGoogleSignIn}
      className="w-full border-gray-300 hover:bg-gray-50 text-black py-3 text-base font-medium rounded-lg h-12 bg-transparent"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <Image
            src="/google.svg"
            alt="Google logo"
            className="mr-2 h-4 w-4"
            width={24}
            height={24}
          />
          Continue with Google
        </>
      )}
    </Button>
  )
}

// Separate component for search params logic
function LoginFormWithSearchParams() {
  const [state, formAction] = useActionState<AuthState, FormData>(signInWithMagicLink, {} as AuthState)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [urlError, setUrlError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined)
  const [lastUsed, setLastUsed] = useState<'google' | 'magic' | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      }
    }

    checkAuth()
  }, [router])

  // Check for error messages in URL parameters (from callback redirects)
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setUrlError(error)
      // Clear the error from URL to prevent it from showing again on refresh
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  // Read the last used auth method from cookie to show badge
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)last_auth=([^;]+)/)
    if (match) {
      const value = decodeURIComponent(match[1])
      if (value === 'google' || value === 'magic') {
        setLastUsed(value)
      }
    }
  }, [])

  // Combine form state errors with URL errors
  const displayError = state?.error || urlError

  return (
    <div className="flex flex-col bg-brand-bg">
      <Navbar />
      <main className="min-h-screen flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="  text-4xl font-semibold tracking-tight text-black">Welcome to BringBack</h1>
            <p className="text-lg text-gray-600">Sign in to start restoring your photos</p>
          </div>

          <div className="bg-white border-6 border-gray-200 rounded-xl p-8">
            {displayError && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700">
                {displayError}
                {displayError.includes('expired') && (
                  <p className="mt-2 text-xs text-red-600">
                    💡 Simply enter your email below to request a new authentication link.
                  </p>
                )}
              </div>
            )}
            {state?.success && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700">{state.success}</div>
            )}

            <form
              action={formAction}
              onSubmit={() => {
                // Persist last used method for UX badge
                document.cookie = 'last_auth=magic; path=/; max-age=31536000; SameSite=Lax'
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-white border-gray-300 text-black placeholder:text-gray-500 rounded-lg h-12" />
              </div>
              {/* Cloudflare Turnstile CAPTCHA */}
              {siteKey && (
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={siteKey}
                    onSuccess={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken(undefined)}
                    onError={() => setCaptchaToken(undefined)}
                  />
                </div>
              )}
              <input type="hidden" name="captchaToken" value={captchaToken ?? ""} />
              <div className="relative">
                <MagicLinkSubmit />
                {lastUsed === 'magic' && (
                  <span className="absolute -top-2 right-3 bg-white text-black text-xs px-2  rounded-full border border-purple-600 text-sm">Last used</span>
                )}
              </div>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or</span></div>
              </div>

              <div className="relative">
                <GoogleSignInButton />
                {lastUsed === 'google' && (
                  <span className="absolute -top-2 right-3 bg-white text-black text-xs px-2 rounded-full border border-purple-600 text-sm">Last used</span>
                )}
              </div>
            </div>

            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">By continuing, you agree to our <Link href="/terms" className="text-blue-600 hover:text-blue-700">terms of service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-700">privacy policy</Link>.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-brand-bg py-24">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-600" />
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <LoginFormWithSearchParams />
    </Suspense>
  )
}
