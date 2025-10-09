import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import EnhanceClient from "@/components/enhance-client"

export default async function EnhancePage({
  searchParams,
}: {
  searchParams: Promise<{ image?: string }>
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
  const imageUrl = resolvedSearchParams.image

  // If no image URL is provided, redirect to dashboard
  if (!imageUrl) {
    redirect("/dashboard")
  }

  return (
    <EnhanceClient 
      user={{ email: user.email || "", id: user.id }} 
      initialCredits={credits}
      restoredImageUrl={imageUrl}
    />
  )
}