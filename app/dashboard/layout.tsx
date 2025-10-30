import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { EB_Garamond } from "next/font/google"
import { Special_Elite } from "next/font/google"
import { Cinzel } from "next/font/google"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/ui/skeleton"
import { ReferralNotificationManager } from "@/components/referral-notification-manager"

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

  return (
    <div 
      className={`min-h-screen ${ebGaramond.variable} ${specialElite.variable} ${cinzel.variable}`}
    >
      <Suspense fallback={<DashboardSkeleton />}>
        {children}
      </Suspense>
      <ReferralNotificationManager />
    </div>
  )
}