import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import AddPersonDashboardClient from "@/components/add-person-dashboard-client"

export const metadata = {
  title: "Add Person to Photo | BringBack",
  description: "Seamlessly add a person into an existing photo with BringBack's AI compositor.",
}

export default async function AddPersonPage({
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

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  const resolvedSearchParams = await searchParams

  return (
    <AddPersonDashboardClient
      user={{ email: user.email || "", id: user.id }}
      initialCredits={profile?.credits || 0}
      isPaymentSuccess={resolvedSearchParams.payment === "success"}
    />
  )
}