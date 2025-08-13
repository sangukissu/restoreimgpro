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
      .select("credits")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const currentCredits = profile.credits || 0

    // Check if user has sufficient credits
    if (currentCredits < amount) {
      return NextResponse.json({ 
        error: "Insufficient credits", 
        currentCredits,
        requiredCredits: amount 
      }, { status: 402 })
    }

    // Deduct credits atomically using a transaction-like approach
    const newCredits = currentCredits - amount

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ 
        credits: newCredits
      })
      .eq("user_id", user.id)
      .eq("credits", currentCredits) // Optimistic locking to prevent race conditions

    if (updateError) {
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      newCredits,
      deductedCredits: amount 
    })

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 