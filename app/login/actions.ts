'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { sanitizeAuthDestination } from '@/lib/auth/redirect'

export interface AuthState {
  error?: string
  success?: string
}

export async function signInWithMagicLink(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const captchaToken = (formData.get('captchaToken') as string) || undefined
  const nextPath = sanitizeAuthDestination(formData.get('next') as string | null)
  const callbackUrl = new URL('/auth/callback', process.env.NEXT_PUBLIC_SITE_URL!)
  callbackUrl.searchParams.set('next', nextPath)

  // Process magic link request

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: callbackUrl.toString(),
        captchaToken,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: 'Check your email for the magic link!' }
  } catch (err) {
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signInWithGoogle(next?: string): Promise<void> {
  const supabase = await createClient()
  const nextPath = sanitizeAuthDestination(next)
  const callbackUrl = new URL('/auth/callback', process.env.NEXT_PUBLIC_SITE_URL!)
  callbackUrl.searchParams.set('next', nextPath)

  // Start Google OAuth

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
    },
  })

  if (error) {
    redirect('/error')
  }

  if (data?.url) {
    redirect(data.url)
  }

  redirect('/error')
}
