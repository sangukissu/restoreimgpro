import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import DashboardClient from "@/components/dashboard-client"

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardClient user={{ email: user.email || "", id: user.id }} />
}
