import { createClient } from "@/utils/supabase/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import type { User } from "@supabase/supabase-js"

/**
 * Returns the currently signed-in user if (and only if) they are flagged as
 * an admin in user_profiles.is_admin. Returns null otherwise.
 *
 * Use this on every admin-gated server entry point: layout, API route, server
 * action. Never trust client-supplied data — always re-check on the server.
 */
export async function getCurrentAdminUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Use the service-role client here so the check survives the regular
  // "users can view own profile" RLS policy.
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single()

  if (!profile?.is_admin) return null
  return user
}
