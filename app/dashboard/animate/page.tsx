import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import AnimateDashboardClient from "@/components/animate-dashboard-client"

export default async function AnimatePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
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
  const isPaymentSuccess = searchParams?.payment === "success"

  return (
    <AnimateDashboardClient
      user={{ email: user.email || "", id: user.id }}
      initialCredits={credits}
      isPaymentSuccess={isPaymentSuccess}
    />
  )
}