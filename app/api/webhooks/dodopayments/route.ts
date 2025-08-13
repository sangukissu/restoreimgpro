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

    // Process the webhook based on event type
    if (webhookData.type === "payment.succeeded") {
      await handlePaymentSucceeded(webhookData)
    } else if (webhookData.type === "payment.failed") {
      await handlePaymentFailed(webhookData)
    } else if (webhookData.type === "payment.cancelled") {
      await handlePaymentCancelled(webhookData)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
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
      const credits = paymentData.metadata?.credits ? Number.parseInt(paymentData.metadata.credits) : 5

      if (amountCents === 0 || isNaN(amountCents)) {
        return
      }

      // Create payment record from webhook data (simplified schema)
      const { data: newPayment, error: createError } = await supabase
        .from("payments")
        .insert({
          user_id: paymentData.metadata.user_id,
          dodo_payment_id: paymentId,
          amount_cents: amountCents,
          credits_purchased: credits,
          status: "completed",
        })
        .select()
        .single()

      if (createError) {
        return
      }

      payment = newPayment
    } else {
      // Update existing payment
      payment = existingPayment
      await supabase.from("payments").update({ status: "completed" }).eq("id", payment.id)
    }

    // Add credits to user profile (always 5 credits for premium plan)
    const creditsToAdd = 5

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", payment.user_id)
      .single()

    if (profileError) {
      const { error: createError } = await supabase.from("user_profiles").insert({
        user_id: payment.user_id,
        credits: creditsToAdd,
        email: "",
        name: "User",
        created_at: new Date().toISOString(),
      })

      if (createError) {
        // Handle error silently for production
      }
      return
    }

    // Update user credits
    const newCredits = (profile.credits || 0) + creditsToAdd

    const { error: creditsError } = await supabase
      .from("user_profiles")
      .update({
        credits: newCredits,
      })
      .eq("user_id", payment.user_id)

    if (creditsError) {
      // Handle error silently for production
    }

    // Log the webhook event for tracking (simplified schema)
    const { error: logError } = await supabase.from("webhook_events").insert({
      event_id: webhookData.business_id + "_" + Date.now(),
      event_type: webhookData.type,
      payment_id: payment.id,
      processed: true,
    })

    if (logError) {
      // Handle error silently for production
    }
  } catch (error) {
    // Handle error silently for production
  }
}

async function handlePaymentFailed(webhookData: any) {
  try {
    const paymentData = webhookData.data
    const paymentId = paymentData.id || paymentData.payment_id

    // Update payment status to failed
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "failed",
      })
      .eq("dodo_payment_id", paymentId)

    if (updateError) {
      // Handle error silently for production
    }
  } catch (error) {
    // Handle error silently for production
  }
}

async function handlePaymentCancelled(webhookData: any) {
  try {
    const paymentData = webhookData.data
    const paymentId = paymentData.id || paymentData.payment_id

    // Update payment status to cancelled
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "cancelled",
      })
      .eq("dodo_payment_id", paymentId)

    if (updateError) {
      // Handle error silently for production
    }
  } catch (error) {
    // Handle error silently for production
  }
}
