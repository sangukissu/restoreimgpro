import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { EB_Garamond } from "next/font/google"
import { Special_Elite } from "next/font/google"
import { Cinzel } from "next/font/google"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/ui/skeleton"
import { ReferralNotificationManager } from "@/components/referral-notification-manager"
import PaymentController from "@/components/dashboard/payment-controller"

const ebGaramond = EB_Garamond({ subsets: ["latin"], display: "swap", variable: "--font-eb-garamond" })
const specialElite = Special_Elite({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-special-elite",
})
const cinzel = Cinzel({ subsets: ["latin"], display: "swap", variable: "--font-cinzel" })

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/login")
  }

  const layoutUser = {
    name: user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatar: "/avatar1.webp",
    id: user.id,
  }

  // Fetch initial credits from user_profiles for consistent display
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", user.id)
    .single()

  const initialCreditBalance = profile?.credits ?? 0

  return (
    <PaymentController user={layoutUser} initialCreditBalance={initialCreditBalance}>
      <Suspense fallback={<DashboardSkeleton />}>
        {children}
      </Suspense>
      <ReferralNotificationManager />
    </PaymentController>
  )
}
