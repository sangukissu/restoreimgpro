import { NextRequest, NextResponse } from "next/server"
import { getCurrentAdminUser } from "@/lib/admin"
import { supabaseAdmin } from "@/utils/supabase/admin"

type Operation = "set" | "add" | "remove"

interface Body {
  operation: Operation
  amount: number
  reason?: string
}

const MAX_CREDITS = 1_000_000

/**
 * PATCH /api/admin/users/:id/credits
 * Admin-only. Adjusts a user's credit balance.
 *
 * Body: { operation: "set" | "add" | "remove", amount: number, reason?: string }
 *   - "set"    -> credits = amount             (clamped to 0..MAX_CREDITS)
 *   - "add"    -> credits = current + amount   (clamped to MAX_CREDITS)
 *   - "remove" -> credits = current - amount   (clamped to 0)
 *
 * Returns the new credit value.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdminUser()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id: targetUserId } = await params
  if (!targetUserId || typeof targetUserId !== "string") {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { operation, amount, reason } = body
  if (!["set", "add", "remove"].includes(operation)) {
    return NextResponse.json(
      { error: "operation must be 'set' | 'add' | 'remove'" },
      { status: 400 }
    )
  }
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    return NextResponse.json(
      { error: "amount must be a non-negative number" },
      { status: 400 }
    )
  }
  if (operation === "set" && amount > MAX_CREDITS) {
    return NextResponse.json(
      { error: `amount cannot exceed ${MAX_CREDITS}` },
      { status: 400 }
    )
  }

  // Read the current row so we can compute the new value atomically below
  // (the .update() itself is atomic at the row level, but we want to clamp).
  const { data: profile, error: readError } = await supabaseAdmin
    .from("user_profiles")
    .select("credits, email")
    .eq("user_id", targetUserId)
    .single()

  if (readError || !profile) {
    return NextResponse.json(
      { error: "User not found", details: readError?.message },
      { status: 404 }
    )
  }

  const current = profile.credits ?? 0
  let next: number
  switch (operation) {
    case "set":
      next = Math.min(MAX_CREDITS, Math.floor(amount))
      break
    case "add":
      next = Math.min(MAX_CREDITS, current + Math.floor(amount))
      break
    case "remove":
      next = Math.max(0, current - Math.floor(amount))
      break
  }

  const delta = next - current

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("user_profiles")
    .update({ credits: next })
    .eq("user_id", targetUserId)
    .select("credits")
    .single()

  if (updateError || !updated) {
    return NextResponse.json(
      { error: "Failed to update credits", details: updateError?.message },
      { status: 500 }
    )
  }

  // Lightweight audit trail: log to server console. A persistent audit
  // table can be added later if compliance requires it.
  console.info("[admin.credits]", {
    adminId: admin.id,
    adminEmail: admin.email,
    targetUserId,
    targetEmail: profile.email,
    operation,
    requestedAmount: amount,
    previousCredits: current,
    newCredits: next,
    delta,
    reason: reason?.slice(0, 500) ?? null,
    at: new Date().toISOString(),
  })

  return NextResponse.json({
    success: true,
    userId: targetUserId,
    email: profile.email,
    previousCredits: current,
    newCredits: updated.credits,
    delta,
  })
}
