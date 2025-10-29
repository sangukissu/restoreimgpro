'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ReferralData {
  code: string
  shareUrl: string
  statistics: {
    totalReferrals: number
    completedReferrals: number
    pendingReferrals: number
    totalCreditsEarned: number
  }
}

interface ReferralSettings {
  referrer_credits_reward: number
  referred_credits_reward: number
  is_active: boolean
  minimum_purchase_cents: number
  expiry_days: number
  max_referrals_per_user: number
}

export function useReferrals() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [settings, setSettings] = useState<ReferralSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/referrals/my-code', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch referral data')
      }

      const data = await response.json()
      setReferralData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load referral data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/referrals/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch referral settings')
      }

      const data = await response.json()
      setSettings(data)
    } catch (err) {
      console.error('Error fetching referral settings:', err)
    }
  }

  const applyReferralCode = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/referrals/apply', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ referralCode: code.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        return true
      } else {
        toast.error(data.error || "Failed to apply referral code")
        return false
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
      return false
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
      return true
    } catch (err) {
      toast.error("Failed to copy to clipboard")
      return false
    }
  }

  const shareReferral = async () => {
    if (!referralData) return false

    const shareData = {
      title: 'Restore Your Photos with AI',
      text: `Join me on BringBack AI and get ${settings?.referred_credits_reward || 1} free credits! Use my referral code: ${referralData.code}`,
      url: referralData.shareUrl
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return true
      } else {
        return await copyToClipboard(referralData.shareUrl)
      }
    } catch (err) {
      console.error('Error sharing:', err)
      return false
    }
  }

  useEffect(() => {
    fetchReferralData()
    fetchSettings()
  }, [])

  return {
    referralData,
    settings,
    loading,
    error,
    refetch: fetchReferralData,
    applyReferralCode,
    copyToClipboard,
    shareReferral
  }
}