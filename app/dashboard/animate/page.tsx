import AnimateDashboardClient from "@/components/animate-dashboard-client"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { getDashboardIdentity } from "@/lib/auth/dashboard-identity"

export default async function AnimatePage({ 
  searchParams, 
}: { 
  searchParams: Promise<{ payment?: string }> 
}) {
  const supabase = await createClient()

  const user = await getDashboardIdentity()

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
    <AnimateDashboardClient
      user={{ email: user.email || "", id: user.id }}
      initialCredits={credits}
      isPaymentSuccess={isPaymentSuccess}
    />
  )
}
