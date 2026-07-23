import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/ui/skeleton"
import PaymentController from "@/components/dashboard/payment-controller"
import { ExitIntentPopup, TrustpilotReviewPrompt } from "@/components/exit-intent-popup"
import { getDashboardIdentity } from "@/lib/auth/dashboard-identity"

// Dashboard hosts interactive tool flows, chat/dialogue states and user sessions.
// Keep these out of the index to prevent crawl leak / session indexing.
export const metadata: Metadata = {
  title: "Dashboard | BringBack AI",
  description: "Your BringBack AI workspace.",
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const user = await getDashboardIdentity()

  if (!user) {
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

  // Check if user has made any successful purchase
  const { data: payments } = await supabase
    .from("payments")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .limit(1)

  const hasPurchased = !!(payments && payments.length > 0)

  return (
    <PaymentController user={layoutUser} initialCreditBalance={initialCreditBalance}>
      <Suspense fallback={<DashboardSkeleton />}>
        {children}
      </Suspense>
      <ExitIntentPopup hasPurchased={hasPurchased} />
      <TrustpilotReviewPrompt hasPurchased={hasPurchased} />
    </PaymentController>
  )
}
