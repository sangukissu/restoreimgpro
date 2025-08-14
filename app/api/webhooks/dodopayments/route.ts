import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"
import crypto from "crypto"

const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET!
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()

    // Get webhook headers as per Standard Webhooks spec
    const webhookId = headersList.get("webhook-id")
    const webhookSignature = headersList.get("webhook-signature")
    const webhookTimestamp = headersList.get("webhook-timestamp")

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return NextResponse.json({ error: "Missing webhook headers" }, { status: 400 })
    }

    // Verify webhook signature using Standard Webhooks approach
    const isValid = verifyWebhookSignature(webhookId, webhookTimestamp, body, webhookSignature, WEBHOOK_SECRET)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse the webhook payload
    const webhookData = JSON.parse(body)

    // Log the incoming webhook for debugging
    console.log(`Processing webhook: ${webhookData.type}`, { webhookId, timestamp: webhookTimestamp })

    // Process the webhook based on event type
    if (webhookData.type === "payment.succeeded") {
      await handlePaymentSucceeded(webhookData)
    } else if (webhookData.type === "payment.failed") {
      await handlePaymentFailed(webhookData)
    } else if (webhookData.type === "payment.cancelled") {
      await handlePaymentCancelled(webhookData)
    } else {
      console.log(`Unhandled webhook type: ${webhookData.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

function verifyWebhookSignature(
  webhookId: string,
  webhookTimestamp: string,
  payload: string,
  webhookSignature: string,
  secret: string,
): boolean {
  try {
    // Remove whsec_ prefix if present
    const cleanSecret = secret.startsWith("whsec_") ? secret.substring(6) : secret

    // Decode the base64 secret
    const key = Buffer.from(cleanSecret, "base64")

    // Create the signed payload: msgId.timestamp.payload
    const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`

    // Create HMAC SHA256 signature and encode as base64
    const expectedSignature = crypto.createHmac("sha256", key).update(signedPayload, "utf8").digest("base64")

    // Parse received signatures (can be multiple: "v1,sig1 v1,sig2")
    const receivedSignatures = webhookSignature.split(" ")

    // Check each signature
    for (const versionedSignature of receivedSignatures) {
      const [version, signature] = versionedSignature.split(",")

      if (version !== "v1") {
        continue
      }

      // Use timing-safe comparison
      if (signature && timingSafeEqual(signature, expectedSignature)) {
        return true
      }
    }

    return false
  } catch (error) {
    return false
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  const bufferA = Buffer.from(a, "utf8")
  const bufferB = Buffer.from(b, "utf8")

  return crypto.timingSafeEqual(bufferA, bufferB)
}

async function handlePaymentSucceeded(webhookData: any) {
  try {
    const paymentData = webhookData.data
    const paymentId = paymentData.id || paymentData.payment_id

    // Find the payment in our database using the DodoPayments payment ID
    let payment: any
    const { data: existingPayment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("dodo_payment_id", paymentId)
      .single()

    if (paymentError || !existingPayment) {
      // Get the amount_cents from metadata
      const amountCents = paymentData.metadata?.amount_cents ? Number.parseInt(paymentData.metadata.amount_cents) : 0
      const credits = paymentData.metadata?.credits ? Number.parseInt(paymentData.metadata.credits) : 0
      const userId = paymentData.metadata?.user_id

      if (amountCents === 0 || isNaN(amountCents)) {
        console.error("Invalid amount_cents in webhook data:", paymentData.metadata)
        return
      }

      if (credits === 0 || isNaN(credits)) {
        console.error("Invalid credits in webhook data:", paymentData.metadata)
        return
      }

      if (!userId) {
        console.error("Missing user_id in webhook metadata:", paymentData.metadata)
        return
      }

      // Create payment record from webhook data
      const { data: newPayment, error: createError } = await supabase
        .from("payments")
        .insert({
          user_id: userId,
          dodo_payment_id: paymentId,
          amount_cents: amountCents,
          credits_purchased: credits,
          status: "completed",
        })
        .select()
        .single()

      if (createError) {
        console.error("Failed to create payment record:", createError)
        return
      }

      payment = newPayment
    } else {
      // Update existing payment
      payment = existingPayment
      await supabase.from("payments").update({ status: "completed" }).eq("id", payment.id)
    }

    // Use credits_purchased from the payment record instead of hardcoded 5
    const creditsToAdd = payment.credits_purchased

    if (!creditsToAdd || creditsToAdd <= 0) {
      console.error("Invalid credits_purchased in payment record:", payment)
      return
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits, email")
      .eq("user_id", payment.user_id)
      .single()

    if (profileError) {
      // Get user email from auth.users table
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(payment.user_id)
      
      if (authError) {
        console.error("Failed to get auth user:", authError)
        return
      }
      
      const userEmail = authUser.user?.email || ""
      const userName = authUser.user?.user_metadata?.name || authUser.user?.email || "User"
      
      // Validate email before creating profile
      if (!userEmail || userEmail.trim() === "") {
        console.error("Cannot create user profile: No email found for user", payment.user_id)
        return
      }
      
      console.log(`Creating new user profile for user ${payment.user_id} with email: ${userEmail}`)
      
      // Create new user profile if it doesn't exist
      const { error: createError } = await supabase.from("user_profiles").insert({
        user_id: payment.user_id,
        credits: creditsToAdd,
        email: userEmail.trim(),
        name: userName,
      })

      if (createError) {
        console.error("Failed to create user profile:", createError)
        return
      }
      
      console.log(`Successfully created user profile for user ${payment.user_id}`)
    } else {
      // Update existing user credits
      const newCredits = (profile.credits || 0) + creditsToAdd

      const { error: creditsError } = await supabase
        .from("user_profiles")
        .update({
          credits: newCredits,
        })
        .eq("user_id", payment.user_id)

      if (creditsError) {
        console.error("Failed to update user credits:", creditsError)
        return
      }
    }

    // Log the webhook event for tracking using the proper webhook_events table
    await logWebhookEvent(webhookData.type, payment.id, webhookData.business_id)

    console.log(`Successfully processed payment ${paymentId}: Added ${creditsToAdd} credits to user ${payment.user_id}`)
  } catch (error) {
    console.error("Error in handlePaymentSucceeded:", error)
  }
}

async function handlePaymentFailed(webhookData: any) {
  try {
    const paymentData = webhookData.data
    const paymentId = paymentData.id || paymentData.payment_id

    // Find the payment in our database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id")
      .eq("dodo_payment_id", paymentId)
      .single()

    if (paymentError || !payment) {
      console.error("Payment not found for failed webhook:", paymentId)
      return
    }

    // Update payment status to failed
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "failed",
      })
      .eq("dodo_payment_id", paymentId)

    if (updateError) {
      console.error("Failed to update payment status to failed:", updateError)
      return
    }

    // Log the webhook event for tracking
    await logWebhookEvent(webhookData.type, payment.id, webhookData.business_id)

    console.log(`Payment ${paymentId} marked as failed`)
  } catch (error) {
    console.error("Error in handlePaymentFailed:", error)
  }
}

async function handlePaymentCancelled(webhookData: any) {
  try {
    const paymentData = webhookData.data
    const paymentId = paymentData.id || paymentData.payment_id

    // Find the payment in our database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id")
      .eq("dodo_payment_id", paymentId)
      .single()

    if (paymentError || !payment) {
      console.error("Payment not found for cancelled webhook:", paymentId)
      return
    }

    // Update payment status to cancelled
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "cancelled",
      })
      .eq("dodo_payment_id", paymentId)

    if (updateError) {
      console.error("Failed to update payment status to cancelled:", updateError)
      return
    }

    // Log the webhook event for tracking
    await logWebhookEvent(webhookData.type, payment.id, webhookData.business_id)

    console.log(`Payment ${paymentId} marked as cancelled`)
  } catch (error) {
    console.error("Error in handlePaymentCancelled:", error)
  }
}

// Helper function to log webhook events consistently
async function logWebhookEvent(eventType: string, paymentId: string, businessId?: string) {
  try {
    const eventId = `${businessId || 'unknown'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const { error: logError } = await supabase.from("webhook_events").insert({
      event_id: eventId,
      event_type: eventType,
      payment_id: paymentId,
      processed: true,
    })

    if (logError) {
      console.error("Failed to log webhook event:", logError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error logging webhook event:", error)
    return false
  }
}
