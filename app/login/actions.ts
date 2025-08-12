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

  console.log('[MagicLink] Start', { email, siteUrl: process.env.NEXT_PUBLIC_SITE_URL })

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      console.error('[MagicLink] Magic link error', { 
        message: error.message, 
        status: error.status, 
        code: 'AuthError',
        details: error 
      })
      return { error: error.message }
    }

    console.log('[MagicLink] Magic link sent successfully', { data })
    return { success: 'Check your email for the magic link!' }
  } catch (err) {
    console.error('[MagicLink] Unexpected error', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient()

  console.log('[Google] Starting OAuth', { siteUrl: process.env.NEXT_PUBLIC_SITE_URL })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    console.error('[Google] signInWithOAuth error', error)
    redirect('/error')
  }

  if (data?.url) {
    console.log('[Google] Redirecting to provider', { url: data.url })
    redirect(data.url)
  }

  console.error('[Google] Missing redirect URL and no error')
  redirect('/error')
}
