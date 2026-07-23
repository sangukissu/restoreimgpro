import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DashboardClient from "@/components/dashboard-client"
import { getDashboardIdentity } from "@/lib/auth/dashboard-identity"

export default async function Dashboard({
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
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  const credits = profile?.credits || 0
  const resolvedSearchParams = await searchParams

  return (
    <DashboardClient 
      user={{ email: user.email || "", id: user.id }} 
      initialCredits={credits}
    />
  )
}
