import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import FamilyPortraitDashboardClient from "@/components/family-portrait-dashboard-client"

export const metadata = {
  title: "Family Portrait – Combine Individual Photos | BringBack",
  description:
    "Combine up to 4 individual portraits into one cohesive family photo using BringBack's AI compositor. Choose aspect ratio and get a high‑quality image in seconds.",
}

export default async function FamilyPortraitPage({
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

  const credits = profile?.credits || 0
  const resolvedSearchParams = await searchParams
  const isPaymentSuccess = resolvedSearchParams.payment === "success"

  return (
    <FamilyPortraitDashboardClient
      user={{ email: user.email || "", id: user.id }}
      initialCredits={credits}
      isPaymentSuccess={isPaymentSuccess}
    />
  )
}