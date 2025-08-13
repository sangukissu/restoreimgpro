"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail } from "lucide-react"
import { signInWithMagicLink, signInWithGoogle, type AuthState } from "./actions"

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
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
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
  const [urlError, setUrlError] = useState<string | null>(null)

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

  // Combine form state errors with URL errors
  const displayError = state?.error || urlError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-black">Welcome to BringBack</h1>
          <p className="text-lg text-gray-600">Sign in to start restoring your photos</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
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

          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-white border-gray-300 text-black placeholder:text-gray-500 rounded-lg h-12" />
            </div>
            <MagicLinkSubmit />
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or</span></div>
            </div>

            <GoogleSignInButton />
          </div>

          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">By continuing, you agree to our terms of service and privacy policy.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginFormWithSearchParams />
    </Suspense>
  )
}
