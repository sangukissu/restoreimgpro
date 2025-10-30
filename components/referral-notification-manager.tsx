'use client'

import { useState, useEffect } from 'react'
import { ReferralNotification } from './referral-notification'

export function ReferralNotificationManager() {
  const [showNotification, setShowNotification] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const response = await fetch('/api/referrals/my-code')
        if (response.ok) {
          const data = await response.json()
          if (data.code) {
            setReferralCode(data.code)
            // Show notification after a delay
            setTimeout(() => {
              setShowNotification(true)
            }, 3000)
          }
        }
      } catch (error) {
        // Silently handle errors - user might not be authenticated
      }
    }

    fetchReferralCode()
  }, [])

  const handleCloseNotification = () => {
    setShowNotification(false)
  }

  if (!showNotification || !referralCode) {
    return null
  }

  return (
    <ReferralNotification
      referralCode={referralCode}
      onClose={handleCloseNotification}
    />
  )
}