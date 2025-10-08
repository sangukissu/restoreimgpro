import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { createClient } from "@/utils/supabase/server"
import { VideoGenerationError, createError, logError, withErrorHandling } from "@/lib/error-handling"

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY,
})

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

    // Check if Fal AI API key is configured
    if (!process.env.FAL_KEY) {
      const error = new VideoGenerationError('FAL_API_KEY_MISSING', 'FAL API key not configured', 500)
      logError(error)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

    // Parse the JSON body from the request
    const { imageUrl } = await request.json()

    // Validate required fields
    if (!imageUrl) {
      const error = new VideoGenerationError('NO_IMAGE_URL_PROVIDED', 'No image URL provided', 400)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }
    
    // Submit enhancement request to FAL
    const result = await fal.subscribe('fal-ai/codeformer', {
      input: {
        image_url: imageUrl,
        fidelity: 0.5,
        upscaling: 2,
        face_upscale: true,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
        update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return NextResponse.json({
        success: true,
        result: result,
        message: "Image enhancement completed successfully."
    })
  } catch (error) {
    const e = error as Error
    const apiError = new VideoGenerationError('ENHANCEMENT_FAILED', e.message, 500)
    logError(apiError)
    return NextResponse.json(apiError.toApiResponse(), { status: apiError.statusCode })
  }
}