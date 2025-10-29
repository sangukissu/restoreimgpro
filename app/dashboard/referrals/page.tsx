import { Metadata } from 'next'
import ReferralDashboard from '@/components/referral-dashboard'

export const metadata: Metadata = {
  title: 'Referrals - RestoreImg Pro',
  description: 'Refer friends and earn credits with RestoreImg Pro referral program',
}

export default function ReferralsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ReferralDashboard />
    </div>
  )
}