import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentAdminUser } from "@/lib/admin"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"

// Admin surface: never index, never follow. Same posture as the dashboard.
export const metadata: Metadata = {
  title: "Admin | BringBack AI",
  description: "Internal administration for BringBack AI.",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    // Send signed-in non-admins to their dashboard so the URL is not leaked
    // as a 404, and signed-out users to login.
    redirect("/login?next=/admin/users")
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-8">
        <div className="max-w-[1320px] mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
