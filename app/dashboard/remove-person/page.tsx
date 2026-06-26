import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import RemovePersonDashboardClient from "@/components/remove-person-dashboard-client"

export const metadata = {
  title: "Remove Person or Object | BringBack",
  description: "Brush over a person or object and remove it from a photo with BringBack's AI retoucher.",
}

export default async function RemovePersonPage({
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
    <RemovePersonDashboardClient
      user={{ email: user.email || "", id: user.id }}
      initialCredits={profile?.credits || 0}
      isPaymentSuccess={resolvedSearchParams.payment === "success"}
    />
  )
}