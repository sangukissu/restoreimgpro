import { sanitizeAuthDestination } from "@/lib/auth/redirect"
import SessionCheckClient from "./session-check-client"

export const metadata = {
  title: "Checking Your Session",
  robots: { index: false, follow: false },
}

export default async function SessionCheckPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  const nextPath = sanitizeAuthDestination(params.next)

  return <SessionCheckClient nextPath={nextPath} />
}
