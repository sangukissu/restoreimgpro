import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { createClient } from "@/utils/supabase/server"
import { uploadVideoToBlob, downloadVideoFromUrl } from "@/lib/vercel-blob"
import { VideoGenerationError, createError, logError, withErrorHandling } from "@/lib/error-handling"

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY,
})

// Allowed file types and size limits
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Animation presets
const ANIMATION_PRESETS = {
  "gentle-smile": {
    name: "Gentle Smile",
    prompt: "The persons in the image develop a warm, natural smile that appears gradually and holds for a moment"
  },
  "smile-wave": {
    name: "Smile + Wave",
    prompt: "The persons in the image smiles warmly and waves their hand in a friendly greeting gesture"
  },
  "soft-nod": {
    name: "Soft Nod",
    prompt: "The persons in the image give a single, slow, gentle nod of acknowledgment with a peaceful expression"
  },
  "blink-tilt": {
    name: "Subtle Blink + Head Tilt",
    prompt: "The persons in the image blinks naturally and tilts their head slightly with a gentle expression"
  },
  "smile-look": {
    name: "Smile + Look Around",
    prompt: "The persons in the image smiles and looks around curiously, moving their eyes and head naturally with a gentle expression"
  },
  "warm-gaze": {
    name: "Warm Gaze",
    prompt: "The persons in the image maintain steady, warm eye contact with a loving, subtle smile and peaceful expression"
  },
  "peaceful-presence": {
    name: "Peaceful Presence",
    prompt: "The persons in the image show very subtle, natural micro-movements that suggest life and presence without much dramatic changes"
  },
  "loving-recognition": {
    name: "Loving Recognition",
    prompt: "The persons in the image show a moment of gentle recognition, with eyes softening and a hint of a smile"
  },
  "serene-moment": {
    name: "Gentle Talking",
    prompt: "The people in the image filmed speaking to each other with lifelike, minimal movements, and micro-expressions. Keep it realistic and respectful."
  }
}

// Input sanitization function
function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "")
  }
  if (typeof input === "number") {
    return Math.max(0, Math.min(input, Number.MAX_SAFE_INTEGER))
  }
  return input
}

// File validation function
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 10MB.",
    }
  }

  // Check if file name is reasonable
  if (file.name.length > 255) {
    return {
      valid: false,
      error: "File name too long.",
    }
  }

  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const error = createError.unauthorized()
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

    // Check user credits from user_profiles table
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
    }

    if (!userProfile || userProfile.credits < 10) {
      const error = createError.insufficientCredits(10, userProfile?.credits || 0)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

    // Check if Fal AI API key is configured
    if (!process.env.FAL_KEY) {
      const error = new VideoGenerationError('FAL_API_KEY_MISSING', 'FAL API key not configured', 500)
      logError(error)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("image") as File
    const presetId = formData.get("preset_id") as string

    // Validate required fields
    if (!file) {
      const error = new VideoGenerationError('NO_FILE_PROVIDED', 'No image file provided', 400)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

    if (!presetId || !ANIMATION_PRESETS[presetId as keyof typeof ANIMATION_PRESETS]) {
      return NextResponse.json({ error: "Invalid animation preset" }, { status: 400 })
    }

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      const error = new VideoGenerationError('INVALID_FILE', fileValidation.error || 'File validation failed', 400)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

    const preset = ANIMATION_PRESETS[presetId as keyof typeof ANIMATION_PRESETS]

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to Blob for Fal AI storage
    const blob = new Blob([buffer], { type: file.type })

    // Upload file to Fal AI storage
    const uploadedFile = await fal.storage.upload(blob)

    // Create initial database record
    const { data: videoGeneration, error: insertError } = await supabase
      .from("video_generations")
      .insert({
        user_id: user.id,
        original_image_url: uploadedFile,
        status: "uploading",
        preset_id: presetId,
        preset_name: preset.name,
        prompt: preset.prompt
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: "Failed to create video generation record" }, { status: 500 })
    }

    // Prepare input for Fal AI image-to-video model (following official documentation)
    const input = {
      image_url: uploadedFile,
      prompt: preset.prompt,
      duration: "5" as const,
      negative_prompt: "blur, distort, and low quality",
      cfg_scale: 0.5
    }

    let requestId: string

    try {
      // Submit video generation request to FAL queue
      const queueResult = await fal.queue.submit("fal-ai/kling-video/v2.5-turbo/pro/image-to-video", {
        input: input,
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/fal/webhook?generationId=${videoGeneration.id}`
      })

      requestId = queueResult.request_id

      // Update database with generating status and FAL request ID
      await supabase
        .from("video_generations")
        .update({
          fal_video_id: requestId,
          status: "generating"
        })
        .eq("id", videoGeneration.id)

      // Deduct credits immediately after successful submission
      await supabase
        .from("user_profiles")
        .update({ credits: userProfile.credits - 10 })
        .eq("user_id", user.id)

      // Return the generation ID for polling
      return NextResponse.json({
        success: true,
        id: videoGeneration.id,
        requestId: requestId,
        status: "generating",
        preset: preset.name,
        creditsRemaining: userProfile.credits - 10,
        message: "Video generation started. Use the polling endpoint to check status."
      })

    } catch (falError) {
      // Update database with error status
      await supabase
        .from("video_generations")
        .update({
          status: "failed",
          error_message: falError instanceof Error ? falError.message : "Unknown error"
        })
        .eq("id", videoGeneration.id)

      logError(falError instanceof Error ? falError : new Error(String(falError)), { userId: user.id, presetId })

      if (falError instanceof Error) {
        if (falError.message.includes('authentication') || falError.message.includes('401')) {
          const error = new VideoGenerationError('FAL_AUTH_ERROR', 'Authentication failed with video service. Please check your API key.', 401)
          return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
        }
        if (falError.message.includes('rate limit') || falError.message.includes('429')) {
          const error = new VideoGenerationError('FAL_RATE_LIMITED', 'Rate limit exceeded. Please try again later.', 429)
          return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
        }
      }
      const error = createError.falApiError(falError instanceof Error ? falError.message : 'Unknown error', falError)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), { endpoint: 'video-generation' })
    const serverError = new VideoGenerationError('INTERNAL_SERVER_ERROR', 'Failed to start video generation. Please try again.', 500)
    return NextResponse.json(serverError.toApiResponse(), { status: serverError.statusCode })
  }
}

// Health check endpoint
export async function GET() {
  const hasKey = !!process.env.FAL_KEY
  const keyPreview = hasKey ? `${process.env.FAL_KEY?.substring(0, 8)}...` : 'Not set'

  return NextResponse.json({
    status: "healthy",
    service: "Video Animation API",
    timestamp: new Date().toISOString(),
    falConfigured: hasKey,
    keyPreview,
    presets: Object.keys(ANIMATION_PRESETS),
    environment: process.env.NODE_ENV || 'development'
  })
}