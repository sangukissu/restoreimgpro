import { cache } from "react"
import { createClient } from "@/utils/supabase/server"

export type DashboardIdentity = {
  id: string
  email: string
}

export const getDashboardIdentity = cache(
  async (): Promise<DashboardIdentity | null> => {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getClaims()
    const claims = data?.claims

    if (error || typeof claims?.sub !== "string" || !claims.sub) {
      return null
    }

    return {
      id: claims.sub,
      email: typeof claims.email === "string" ? claims.email : "",
    }
  },
)
