'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ReferralInput from './referral-input'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ReferralHandler() {
  const searchParams = useSearchParams()
  const [referralCode, setReferralCode] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get referral code from URL
    const refCode = searchParams.get('ref')
    if (refCode) {
      setReferralCode(refCode.toUpperCase())
      
      // Check if user is logged in
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user)
          setShowInput(true)
        } else {
          // Store referral code in localStorage for after login
          localStorage.setItem('pending_referral_code', refCode.toUpperCase())
        }
      })
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        
        // Check for pending referral code
        const pendingCode = localStorage.getItem('pending_referral_code')
        if (pendingCode) {
          setReferralCode(pendingCode)
          setShowInput(true)
          localStorage.removeItem('pending_referral_code')
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setShowInput(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [searchParams])

  const handleSuccess = () => {
    setShowInput(false)
    // Remove ref parameter from URL
    const url = new URL(window.location.href)
    url.searchParams.delete('ref')
    window.history.replaceState({}, '', url.toString())
  }

  if (!showInput || !user) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <ReferralInput 
        defaultCode={referralCode}
        onSuccess={handleSuccess}
      />
    </div>
  )
}