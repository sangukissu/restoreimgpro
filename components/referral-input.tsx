'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ReferralInputProps {
  onSuccess?: () => void
  defaultCode?: string
}

export default function ReferralInput({ onSuccess, defaultCode = '' }: ReferralInputProps) {
  const [referralCode, setReferralCode] = useState(defaultCode)
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(false)
  const { toast } = useToast()

  const applyReferralCode = async () => {
    if (!referralCode.trim()) {
      toast.error("Please enter a referral code")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/referrals/apply', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ referralCode: referralCode.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setApplied(true)
        toast.success(data.message)
        onSuccess?.()
      } else {
        toast.error(data.error || "Failed to apply referral code")
      }
    } catch (error) {
      console.error('Error applying referral code:', error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (applied) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-center">
            <Gift className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-green-800">Referral Applied!</h3>
              <p className="text-sm text-green-600">
                You'll earn bonus credits with your first purchase
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2 text-purple-600" />
          Have a Referral Code?
        </CardTitle>
        <CardDescription>
          Enter a friend's referral code to earn bonus credits on your first purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            className="font-mono"
            maxLength={12}
          />
          <Button 
            onClick={applyReferralCode}
            disabled={loading || !referralCode.trim()}
          >
            {loading ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}