'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Users, TrendingUp, Clock } from 'lucide-react'
import { toast } from 'sonner'
import DashboardHeader from '@/components/dashboard-header'

interface ReferralData {
  code: string
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

interface ReferralDashboardProps {
  user: {
    email: string
    id: string
  }
  initialCredits: number
  onBuyCredits: () => void
}

export default function ReferralDashboard({ user, initialCredits, onBuyCredits }: ReferralDashboardProps) {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [settings, setSettings] = useState<ReferralSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(false)

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
      toast.success("Referral code copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    } finally {
      setCopying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Dotted Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative z-10 p-6">
          <DashboardHeader user={user} credits={initialCredits} onBuyCredits={onBuyCredits} />
          <div className="max-w-6xl mx-auto mt-24">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Dotted Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative z-10 p-6">
        <DashboardHeader user={user} credits={initialCredits} onBuyCredits={onBuyCredits} />
        
        <div className="max-w-6xl mx-auto mt-24 space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Refer Friends & Earn Credits</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Share BringBack AI with friends and earn {settings?.referrer_credits_reward || 2} credits 
              for each friend who makes their first purchase. They get {settings?.referred_credits_reward || 1} credits too!
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {referralData?.statistics.totalReferrals || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {referralData?.statistics.completedReferrals || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {referralData?.statistics.pendingReferrals || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Credits Earned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {referralData?.statistics.totalCreditsEarned || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Referral Code</h2>
              <p className="text-gray-600">
                Share this code with friends to start earning credits
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
                  <Input
                    value={referralData?.code || ''}
                    readOnly
                    className="font-mono text-lg bg-gray-50"
                  />
                </div>
                <Button
                  onClick={() => copyToClipboard(referralData?.code || '')}
                  disabled={copying}
                  variant="outline"
                  className="mt-7"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Share this code with friends! They can enter it during signup to get bonus credits.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How It Works</h2>
              <p className="text-gray-600">Simple steps to start earning credits with your referrals</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Copy className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">1. Share Your Code</h3>
                <p className="text-gray-600">
                  Share your unique referral code with friends and family
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">2. Friend Signs Up</h3>
                <p className="text-gray-600">
                  Your friend creates an account using your referral code
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">3. Both Earn Credits</h3>
                <p className="text-gray-600">
                  When they make their first purchase, you both get credits!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}