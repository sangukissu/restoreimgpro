import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import MainDashboardClient from "@/components/main-dashboard-client"

export default async function DashboardPage({
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
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  const credits = profile?.credits || 0
  const resolvedSearchParams = await searchParams
  const isPaymentSuccess = resolvedSearchParams.payment === "success"

  return (
    <MainDashboardClient
      user={{ email: user.email || "", id: user.id }}
      initialCredits={credits}
      isPaymentSuccess={isPaymentSuccess}
    />
  )
}