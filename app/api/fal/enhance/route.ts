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

    // Validate and extract enhanced image URL from Fal AI response
    const output: any = (result as any).data
    // The CodeFormer model returns a single `image` object with a `url` per docs.
    // Fallbacks are included for robustness if the SDK returns different shapes.
    const enhancedImageUrl: string | undefined =
      output?.image?.url ??
      output?.image_url ??
      (Array.isArray(output?.images) ? output.images[0]?.url : undefined)

    if (!enhancedImageUrl || typeof enhancedImageUrl !== 'string' || (!enhancedImageUrl.startsWith('http://') && !enhancedImageUrl.startsWith('https://'))) {
      const error = new VideoGenerationError('INVALID_ENHANCED_IMAGE_URL', 'Invalid or missing enhanced image URL returned', 500)
      logError(error)
      return NextResponse.json(error.toApiResponse(), { status: error.statusCode })
    }

    // Server-side download of enhanced image and upload to Supabase storage for a stable public URL
    let finalImageUrl: string = enhancedImageUrl
    try {
      const imageResponse = await fetch(enhancedImageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to download enhanced image: ${imageResponse.status}`)
      }

      const imageBuffer = await imageResponse.arrayBuffer()
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
      const imageBlob = new Blob([imageBuffer], { type: contentType })

      // Generate a unique filename under user's folder, separated by enhanced prefix
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = (enhancedImageUrl.split('.').pop() || 'png').split('?')[0]
      const fileName = `${user.id}/enhanced/${timestamp}_${randomId}.${fileExtension}`

      // Upload to existing restored_photos bucket (public) for consistent access
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('restored_photos')
        .upload(fileName, imageBlob, {
          contentType,
          cacheControl: '3600'
        })

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage
        .from('restored_photos')
        .getPublicUrl(fileName)

      finalImageUrl = urlData.publicUrl
    } catch (storageError) {
      // Fallback to original enhancedImageUrl if storage fails
      console.error('Enhanced image storage error:', storageError)
      finalImageUrl = enhancedImageUrl
    }

    return NextResponse.json({
      success: true,
      enhancedImageUrl: finalImageUrl,
      processedAt: new Date().toISOString(),
      message: "Image enhancement completed successfully."
    })
  } catch (error) {
    const e = error as Error
    const apiError = new VideoGenerationError('ENHANCEMENT_FAILED', e.message, 500)
    logError(apiError)
    return NextResponse.json(apiError.toApiResponse(), { status: apiError.statusCode })
  }
}