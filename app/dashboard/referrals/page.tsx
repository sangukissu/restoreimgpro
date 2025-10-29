import { Metadata } from 'next'
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import ReferralClient from '@/components/referral-client'

export const metadata: Metadata = {
  title: 'Referrals - BringBack AI',
  description: 'Refer friends and earn credits with BringBack AI referral program',
}

export default async function ReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user credits from database
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  const credits = profile?.credits || 0
  const resolvedSearchParams = await searchParams
  const isPaymentSuccess = resolvedSearchParams.payment === "success"

  return (
    <div className="container mx-auto px-4 py-8">
      <ReferralClient 
        user={{ email: user.email || "", id: user.id }} 
        initialCredits={credits}
        isPaymentSuccess={isPaymentSuccess}
      />
    </div>
  )
}