'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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

  // Process magic link request

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
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

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient()

  // Start Google OAuth

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
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
