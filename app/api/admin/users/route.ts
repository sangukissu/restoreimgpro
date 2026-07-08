import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdminUser } from "@/lib/admin"
import { supabaseAdmin } from "@/utils/supabase/admin"

/**
 * GET /api/admin/users
 * Admin-only. Returns the full user list with id, email, name, credits,
 * and account creation date. Service-role client bypasses RLS.
 */
export async function GET(request: NextRequest) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const search = (request.nextUrl.searchParams.get("q") ?? "").trim()

  let query = supabaseAdmin
    .from("user_profiles")
    .select("user_id, email, name, credits, created_at, is_admin")
    .order("created_at", { ascending: false })
    .limit(500)

  if (search.length > 0) {
    // ilike is case-insensitive substring match. Escape % and _ so a user
    // typing "50%" doesn't get all rows.
    const safe = search.replace(/[%_]/g, (m) => "\\" + m)
    query = query.ilike("email", `%${safe}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ users: data ?? [], count: data?.length ?? 0 })
}
