import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the plan from the database (only one plan now)
    const { data: plan, error: planError } = await supabase
      .from("payment_plans")
      .select("*")
      .eq("id", "premium-plan")
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Premium plan not found" }, { status: 404 })
    }

    // Create DodoPayments payment
    const dodoPaymentData = {
      billing: {
        country: "US",
        state: "CA",
        city: "San Francisco",
        street: "123 Main St",
        zipcode: "94105",
      },
      customer: {
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
      },
      product_cart: [
        {
          product_id: plan.dodo_product_id,
          quantity: 1,
        },
      ],
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      payment_link: true,
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
        credits: plan.credits.toString(),
        amount_cents: plan.price_cents.toString(),
      },
    }

    const dodoResponse = await fetch("https://test.dodopayments.com/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      },
      body: JSON.stringify(dodoPaymentData),
    })

    if (!dodoResponse.ok) {
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
    }

    const dodoPayment = await dodoResponse.json()

    // Store payment in our database (simplified schema)
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        dodo_payment_id: dodoPayment.payment_id,
        amount_cents: plan.price_cents,
        credits_purchased: plan.credits,
        status: "pending",
        payment_link: dodoPayment.payment_link,
      })
      .select()
      .single()

    if (paymentError) {
      // Payment was created in DodoPayments but failed to store locally
      // This is OK, webhook will handle it
    }

    return NextResponse.json({
      payment_id: dodoPayment.payment_id,
      payment_link: dodoPayment.payment_link,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
