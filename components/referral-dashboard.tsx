'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Share2, Users, Gift, TrendingUp, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
}

export default function ReferralDashboard() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [settings, setSettings] = useState<ReferralSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchReferralData()
    fetchSettings()
  }, [])

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referrals/my-code', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReferralData(data)
      } else if (response.status === 401) {
        console.error('Unauthorized access to referral data')
        toast.error("Please log in to view your referral code")
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API error:', errorData)
        toast.error("Failed to load referral data")
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
      toast.error("Failed to load referral data")
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/referrals/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Referral link copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    } finally {
      setCopying(false)
    }
  }

  const shareReferral = async () => {
    if (!referralData) return

    const shareData = {
      title: 'Restore Your Photos with AI',
      text: `Join me on RestoreImg Pro and get ${settings?.referred_credits_reward || 1} free credits! Use my referral code: ${referralData.code}`,
      url: referralData.shareUrl
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await copyToClipboard(referralData.shareUrl)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!settings?.is_active) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Referral Program Coming Soon
            </h3>
            <p className="text-gray-500">
              We're working on an exciting referral program. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Refer Friends & Earn Credits</h2>
        <p className="text-gray-600">
          Share RestoreImg Pro with friends and earn {settings?.referrer_credits_reward || 2} credits 
          for each friend who makes their first purchase. They get {settings?.referred_credits_reward || 1} credits too!
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData?.statistics.totalReferrals || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData?.statistics.completedReferrals || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData?.statistics.pendingReferrals || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralData?.statistics.totalCreditsEarned || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>
            Share this code or link with friends to start earning credits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={referralData?.code || ''}
              readOnly
              className="font-mono text-lg"
            />
            <Button
              onClick={() => copyToClipboard(referralData?.code || '')}
              disabled={copying}
              variant="outline"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              value={referralData?.shareUrl || ''}
              readOnly
              className="text-sm"
            />
            <Button
              onClick={() => copyToClipboard(referralData?.shareUrl || '')}
              disabled={copying}
              variant="outline"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareReferral} variant="default">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Share Your Code</h3>
              <p className="text-sm text-gray-600">
                Share your unique referral code or link with friends and family
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Friend Signs Up</h3>
              <p className="text-sm text-gray-600">
                Your friend creates an account using your referral code
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Both Earn Credits</h3>
              <p className="text-sm text-gray-600">
                When they make their first purchase, you both get credits!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}