import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import { enqueueMemoryBookJob } from "@/lib/memory-book/server"

export const maxDuration = 60

type CountedTable = { count: number }

async function countRows(
  table: string,
  userId: string,
  column = "user_id"
): Promise<CountedTable> {
  const { count, error } = await supabaseAdmin
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(column, userId)
  if (error) {
    console.error(`[account-delete] count ${table} failed:`, error.message)
    return { count: 0 }
  }
  return { count: count ?? 0 }
}

async function deleteRows(
  table: string,
  userId: string,
  column = "user_id"
): Promise<{ deleted: number; error: string | null }> {
  const { error, data } = await supabaseAdmin
    .from(table)
    .delete()
    .eq(column, userId)
    .select("id")
  if (error) return { deleted: 0, error: error.message }
  return { deleted: data?.length ?? 0, error: null }
}

async function collectR2Keys(userId: string): Promise<string[]> {
  const keys: string[] = []
  const candidateTables = [
    { table: "image_restorations", columns: ["restored_image_url", "thumbnail_url"] },
    { table: "family_portraits", columns: ["image_url", "thumbnail_url"] },
    { table: "add_person_generations", columns: ["image_url", "thumbnail_url"] },
    { table: "remove_person_generations", columns: ["image_url", "thumbnail_url"] },
    { table: "nostalgic_hug_generations", columns: ["image_url", "thumbnail_url"] },
    { table: "video_generations", columns: ["video_url", "thumbnail_url"] },
    { table: "memory_book_assets", columns: ["preview_locator", "preserved_key", "thumbnail_locator"] },
    { table: "memory_book_media_derivatives", columns: ["source_locator", "preview_locator", "thumbnail_small_key", "thumbnail_medium_key"] },
  ]
  for (const { table, columns } of candidateTables) {
    const selectColumns = columns.join(",")
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(selectColumns)
      .eq("user_id", userId)
    if (error) continue
    for (const row of data || []) {
      for (const col of columns) {
        const value = (row as Record<string, unknown>)[col]
        if (typeof value === "string" && value.length > 0) {
          keys.push(value)
        }
      }
    }
  }
  return keys
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let body: { confirmEmail?: string }
  try {
    body = (await request.json()) as { confirmEmail?: string }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (typeof body.confirmEmail !== "string") {
    return NextResponse.json({ error: "Email confirmation is required" }, { status: 400 })
  }
  if (body.confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "Typed email does not match your account email" },
      { status: 400 }
    )
  }

  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null
  const userAgent = request.headers.get("user-agent") ?? null

  const { data: auditRow, error: auditInsertError } = await supabaseAdmin
    .from("deletion_audit_log")
    .insert({
      user_id: user.id,
      email_at_deletion: user.email,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: "started",
    })
    .select("id")
    .single()

  if (auditInsertError || !auditRow) {
    console.error("[account-delete] failed to write audit row:", auditInsertError?.message)
    return NextResponse.json(
      { error: "Could not start deletion. Please try again or contact support." },
      { status: 500 }
    )
  }

  const auditId = auditRow.id as string
  const rowsDeleted: Record<string, number> = {}
  const errors: string[] = []

  // Step 1: Anonymization policy
  // - auth.users.email is removed when we call auth.admin.deleteUser() at the end.
  // - user_profiles.email and user_profiles.name are removed because we delete
  //   the entire user_profiles row in step 2.
  // - The payments table has no PII columns (no email, no name). It only holds
  //   user_id (FK for legal traceability), amount, plan, date. So "anonymize,
  //   keep row" is auto-satisfied by deleting the PII sources above and leaving
  //   the payment row shell intact. We count it here for the audit summary.
  rowsDeleted.payments_kept = await (async () => {
    const { count } = await supabaseAdmin
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
    return count ?? 0
  })()

  // Step 2: Delete user-owned rows. Order is FK-safe (children before parents).
  const deletionTargets: Array<{ table: string; column?: string }> = [
    { table: "memory_book_jobs" },
    { table: "memory_book_assets" },
    { table: "memory_book_revisions" },
    { table: "memory_book_reactions" },
    { table: "memory_book_pin_attempts" },
    { table: "memory_book_media_derivatives" },
    { table: "memory_books" },
    { table: "memory_book_entitlements" },
    { table: "image_restorations" },
    { table: "add_person_generations" },
    { table: "remove_person_generations" },
    { table: "nostalgic_hug_generations" },
    { table: "video_generations" },
    { table: "family_portraits" },
    { table: "second_pass_usage" },
    { table: "referrals" },
    { table: "referral_analytics" },
    { table: "referral_codes" },
    { table: "user_feedback" },
    { table: "user_feedback_tracking" },
    { table: "user_profiles" },
  ]

  for (const target of deletionTargets) {
    const { deleted, error } = await deleteRows(target.table, user.id, target.column)
    if (error) {
      errors.push(`${target.table}: ${error}`)
    } else {
      rowsDeleted[target.table] = deleted
    }
  }

  // Step 3: Collect R2 keys and queue delete_storage jobs
  try {
    const r2Keys = await collectR2Keys(user.id)
    for (const key of r2Keys) {
      try {
        await enqueueMemoryBookJob({
          userId: user.id,
          jobType: "delete_storage",
          idempotencyKey: `delete-storage:${user.id}:${key}`,
          payload: { storageKey: key },
        })
      } catch (e) {
        errors.push(
          `delete_storage enqueue (${key}): ${e instanceof Error ? e.message : String(e)}`
        )
      }
    }
    rowsDeleted.r2_keys_queued = r2Keys.length
  } catch (e) {
    errors.push(`r2 collection threw: ${e instanceof Error ? e.message : String(e)}`)
  }

  // Step 4: Delete the auth.users row. This MUST be last — once the user is gone,
  // we can no longer write to the audit log under their session.
  let authDeleted = false
  try {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
    if (authError) {
      errors.push(`auth.deleteUser: ${authError.message}`)
    } else {
      authDeleted = true
      rowsDeleted.auth_users = 1
    }
  } catch (e) {
    errors.push(`auth.deleteUser threw: ${e instanceof Error ? e.message : String(e)}`)
  }

  const finalStatus = authDeleted && errors.length === 0 ? "completed" : "failed"
  const finalError = errors.length > 0 ? errors.slice(0, 5).join(" | ") : null

  // Step 5: Update audit log to final state. RLS blocks anon/authenticated so we
  // have to use the service-role client (already imported as supabaseAdmin).
  await supabaseAdmin
    .from("deletion_audit_log")
    .update({
      status: finalStatus,
      error_message: finalError,
      rows_deleted: rowsDeleted,
      completed_at: new Date().toISOString(),
    })
    .eq("id", auditId)

  if (!authDeleted) {
    return NextResponse.json(
      {
        error:
          "Account data was cleaned up but the auth record could not be removed. Please contact support.",
        rowsDeleted,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, rowsDeleted, auditId })
}
