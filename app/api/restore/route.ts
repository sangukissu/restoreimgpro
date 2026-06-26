import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { createClient } from "@/utils/supabase/server"
import {
  buildRestorationInput,
  getWebhookBaseUrl,
  originalProxyUrl,
  preserveOriginalForComparison,
  uploadR2ObjectToFal,
  validateOwnedTempRestoreKey,
} from "@/lib/restore-helpers"

fal.config({
  credentials: process.env.FAL_KEY,
})

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
const MAX_FILE_SIZE = 10 * 1024 * 1024

function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "")
  }
  if (typeof input === "number") {
    return Math.max(0, Math.min(input, Number.MAX_SAFE_INTEGER))
  }
  return input
}

function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 10MB.",
    }
  }

  if (file.name.length > 255) {
    return {
      valid: false,
      error: "File name too long.",
    }
  }

  return { valid: true }
}

async function markFailedAndRefund(supabase: Awaited<ReturnType<typeof createClient>>, restorationId: string, message: string) {
  await supabase.rpc("fail_restoration_and_refund", {
    p_restoration_id: restorationId,
    p_error_message: message,
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "Fal AI API key not configured" }, { status: 500 })
    }

    const contentTypeHeader = request.headers.get("content-type") || ""
    let uploadedFile: string
    let outputFormat = "png"
    let safetyTolerance: string | undefined
    let seed: string | undefined
    let originalImageKey: string | null = null
    const batchId = crypto.randomUUID()

    if (contentTypeHeader.includes("application/json")) {
      const body = await request.json().catch(() => ({}))
      const key = typeof body?.key === "string" ? body.key : undefined
      const bodyOutputFormat = typeof body?.output_format === "string" ? body.output_format : undefined
      const bodySafety = typeof body?.safety_tolerance === "string" ? body.safety_tolerance : undefined
      const bodySeed = typeof body?.seed === "string" ? body.seed : undefined
      const filename = typeof body?.filename === "string" ? body.filename : key?.split("/").pop() || "original"

      if (!key) {
        return NextResponse.json({ error: "No image key provided" }, { status: 400 })
      }
      if (!validateOwnedTempRestoreKey(key, user.id)) {
        return NextResponse.json({ error: "Invalid image key" }, { status: 400 })
      }
      if (bodyOutputFormat) {
        if (!["jpeg", "jpg", "png", "webp"].includes(bodyOutputFormat)) {
          return NextResponse.json({ error: "Invalid output format" }, { status: 400 })
        }
        outputFormat = bodyOutputFormat
      }
      if (bodySafety) safetyTolerance = bodySafety
      if (bodySeed) seed = bodySeed

      try {
        originalImageKey = await preserveOriginalForComparison(key, user.id, batchId, 0, filename)
        uploadedFile = await uploadR2ObjectToFal(key)
      } catch (fetchErr) {
        return NextResponse.json(
          { error: fetchErr instanceof Error ? fetchErr.message : "Failed to read uploaded image" },
          { status: 400 }
        )
      }
    } else if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("image") as File
      seed = (formData.get("seed") as string) || undefined
      outputFormat = (formData.get("output_format") as string) || "png"
      safetyTolerance = (formData.get("safety_tolerance") as string) || undefined

      if (!file) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 })
      }

      const fileValidation = validateFile(file)
      if (!fileValidation.valid) {
        return NextResponse.json({ error: fileValidation.error }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const blob = new Blob([buffer], { type: file.type })
      uploadedFile = await fal.storage.upload(blob)
    } else {
      return NextResponse.json(
        { error: "Unsupported request format. Send JSON with an image key or multipart/form-data." },
        { status: 415 }
      )
    }

    const sanitizedSeed = seed ? sanitizeInput(Number.parseInt(seed)) : undefined
    const input = buildRestorationInput(uploadedFile, {
      outputFormat,
      safetyTolerance,
      seed: typeof sanitizedSeed === "number" && !isNaN(sanitizedSeed) ? sanitizedSeed : undefined,
    })

    const { data: restoration, error: insertError } = await supabase
      .from("image_restorations")
      .insert({
        user_id: user.id,
        status: "processing",
        original_image_url: originalImageKey,
        batch_id: batchId,
        batch_index: 0,
        credits_charged: 1,
        credit_refunded: false,
      })
      .select("id")
      .single()

    if (insertError || !restoration) {
      return NextResponse.json({ error: "Failed to create restoration record" }, { status: 500 })
    }

    const { data: remainingCredits, error: reserveError } = await supabase.rpc("reserve_restore_credits", {
      p_user_id: user.id,
      p_amount: 1,
    })

    if (reserveError || typeof remainingCredits !== "number") {
      await supabase
        .from("image_restorations")
        .update({
          status: "failed",
          error_message: "Insufficient credits",
          credits_charged: 0,
          credit_refunded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", restoration.id)

      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    try {
      const queueResult = await fal.queue.submit("fal-ai/nano-banana-2/edit", {
        input,
        webhookUrl: `${getWebhookBaseUrl(request)}/api/fal/webhook?generationId=${restoration.id}&type=restoration`,
      })

      const requestId = queueResult.request_id
      const { error: metadataError } = await supabase
        .from("image_restorations")
        .update({
          fal_request_id: requestId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", restoration.id)

      if (metadataError) {
        throw metadataError
      }

      return NextResponse.json({
        success: true,
        restorationId: restoration.id,
        requestId,
        status: "processing",
        creditsRemaining: remainingCredits,
        originalImageUrl: originalImageKey ? originalProxyUrl(originalImageKey) : undefined,
        message: "Image restoration started.",
      })
    } catch (falError) {
      const message = falError instanceof Error ? falError.message : "Unknown error"
      await markFailedAndRefund(supabase, restoration.id, message)

      if (falError instanceof Error) {
        if (falError.message.includes("authentication") || falError.message.includes("401")) {
          return NextResponse.json({ error: "Authentication failed with restoration service. Please check your API key." }, { status: 401 })
        }
        if (falError.message.includes("rate limit") || falError.message.includes("429")) {
          return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
        }
        if (falError.message.includes("timeout") || falError.message.includes("408")) {
          return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
        }
        if (falError.message.includes("model not found") || falError.message.includes("404")) {
          return NextResponse.json({ error: "Restoration model not available. Please try again later." }, { status: 503 })
        }
      }
      return NextResponse.json({ error: "Restoration service temporarily unavailable. Please try again." }, { status: 503 })
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        return NextResponse.json({ error: "Authentication failed with restoration service" }, { status: 401 })
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
      }
    }

    return NextResponse.json({ error: "Failed to restore image. Please try again." }, { status: 500 })
  }
}

export async function GET() {
  const hasKey = !!process.env.FAL_KEY
  const keyPreview = hasKey ? `${process.env.FAL_KEY?.substring(0, 8)}...` : "Not set"

  return NextResponse.json({
    status: "healthy",
    service: "BringBack API",
    timestamp: new Date().toISOString(),
    falConfigured: hasKey,
    keyPreview,
    environment: process.env.NODE_ENV || "development",
  })
}