import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const amount = typeof body?.amount === 'number' ? body.amount : 1
    const consumeTrialForRestore = Boolean(body?.consumeTrialForRestore)

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0 || amount > 100) {
      return NextResponse.json({ error: "Invalid credit amount" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user profile with row-level security check
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits, trial_credits")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const currentCredits = profile.credits || 0
    const currentTrial = (profile as any).trial_credits || 0
    const totalAvailable = currentCredits + currentTrial

    // Check if user has sufficient credits
    // By default, DO NOT consume trial credits.
    // Only allow consuming trial when explicitly requested AND only for single-image restore (amount === 1).
    const canUseTrial = consumeTrialForRestore && amount === 1
    if ((!canUseTrial && currentCredits < amount) || (canUseTrial && totalAvailable < amount)) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        currentCredits: canUseTrial ? totalAvailable : currentCredits,
        requiredCredits: amount 
      }, { status: 402 })
    }

    // Deduct logic:
    // - Always deduct from paid credits first.
    // - Only if canUseTrial and paid credits are insufficient, consume remaining from trial.
    let deductFromPaid = Math.min(amount, currentCredits)
    let deductFromTrial = 0
    if (amount > deductFromPaid && canUseTrial) {
      deductFromTrial = amount - deductFromPaid
    }
    const newCredits = currentCredits - deductFromPaid
    const newTrial = currentTrial - deductFromTrial

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ 
        credits: newCredits,
        trial_credits: newTrial
      })
      .eq("user_id", user.id)

    if (updateError) {
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      // Back-compat field used by some clients; represents paid credits only
      remainingCredits: newCredits,
      // Extended fields
      newCredits: newCredits + newTrial,
      deductedCredits: amount,
      creditsRemaining: newCredits,
      trialCreditsRemaining: newTrial
    })

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
