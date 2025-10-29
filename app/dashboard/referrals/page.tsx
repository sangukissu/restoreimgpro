import { Metadata } from 'next'
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import ReferralDashboard from '@/components/referral-dashboard'

export const metadata: Metadata = {
  title: 'Referrals - RestoreImg Pro',
  description: 'Refer friends and earn credits with RestoreImg Pro referral program',
}

export default async function ReferralsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ReferralDashboard />
    </div>
  )
}