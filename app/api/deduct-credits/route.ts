import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { amount = 1 } = await request.json()

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
    if (totalAvailable < amount) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        currentCredits: totalAvailable,
        requiredCredits: amount 
      }, { status: 402 })
    }

    // Deduct credits preferring paid credits first, then trial credits
    let deductFromPaid = Math.min(amount, currentCredits)
    let deductFromTrial = amount - deductFromPaid
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
      newCredits: newCredits + newTrial,
      deductedCredits: amount,
      creditsRemaining: newCredits,
      trialCreditsRemaining: newTrial
    })

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
