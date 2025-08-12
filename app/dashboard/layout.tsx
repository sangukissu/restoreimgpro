import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

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

  return <div className="min-h-screen">{children}</div>
}
