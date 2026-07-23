import { redirect } from "next/navigation"
import LoginFormClient from "./login-form-client"
import { getDashboardIdentity } from "@/lib/auth/dashboard-identity"
import { sanitizeAuthDestination } from "@/lib/auth/redirect"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  const nextPath = sanitizeAuthDestination(params.next)
  const identity = await getDashboardIdentity()

  if (identity) {
    redirect(nextPath)
  }

  return <LoginFormClient nextPath={nextPath} />
}
