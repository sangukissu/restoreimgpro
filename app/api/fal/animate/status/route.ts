import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { createClient } from "@/utils/supabase/server"
import { uploadVideoToR2, downloadVideoFromUrl } from "@/lib/r2"
import { VideoGenerationError, createError, logError } from "@/lib/error-handling"

fal.config({
  credentials: process.env.FAL_KEY,
})

interface FalStatus {
  status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
  logs?: Array<{ message: string; level: string; timestamp: string }>
}

interface FalResult {
  data: {
    video: {
      url: string
    }
  }
  requestId: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const generationId = searchParams.get('id')

    if (!generationId) {
      return NextResponse.json({ error: "Generation ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the generation record
    const { data: generation, error: fetchError } = await supabase
      .from("video_generations")
      .select("*")
      .eq("id", generationId)
      .single()

    if (fetchError || !generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 })
    }

    // If already completed, return the result
    if (generation.status === "completed") {
      return NextResponse.json({
        id: generationId,
        status: "completed",
        videoUrl: generation.video_url,
        falVideoId: generation.fal_video_id
      })
    }

    // If failed, return error
    if (generation.status === "failed") {
      return NextResponse.json({
        id: generationId,
        status: "failed",
        error: generation.error_message || "Video generation failed"
      })
    }

    // Check FAL status
    if (!generation.fal_video_id) {
      return NextResponse.json({
        id: generationId,
        status: "uploading",
        message: "Preparing video generation..."
      })
    }

    try {
      // Check status with FAL
      const falStatus: FalStatus = await fal.queue.status("fal-ai/minimax/hailuo-02/standard/image-to-video", {
        requestId: generation.fal_video_id,
        logs: true
      })

      if (falStatus.status === "COMPLETED") {
        // Get the result
        const falResult: FalResult = await fal.queue.result("fal-ai/minimax/hailuo-02/standard/image-to-video", {
          requestId: generation.fal_video_id
        })

        // Download and upload video to R2
        const videoBuffer = await downloadVideoFromUrl(falResult.data.video.url)
        const r2Key = await uploadVideoToR2(videoBuffer, `video-${generationId}.mp4`, generation.user_id)

        // Update database with completed status and R2 key
        await supabase
          .from("video_generations")
          .update({
            status: "completed",
            video_url: r2Key, // Now storing R2 key, served via /api/video-proxy
            updated_at: new Date().toISOString()
          })
          .eq("id", generationId)

        return NextResponse.json({
          id: generationId,
          status: "completed",
          videoUrl: r2Key,
          falVideoId: generation.fal_video_id
        })
      } else if (falStatus.status === "FAILED") {
        // Update database with failed status
        await supabase
          .from("video_generations")
          .update({
            status: "failed",
            error_message: "Video generation failed at FAL",
            updated_at: new Date().toISOString()
          })
          .eq("id", generationId)

        return NextResponse.json({
          id: generationId,
          status: "failed",
          error: "Video generation failed"
        })
      } else {
        // Still in progress
        return NextResponse.json({
          id: generationId,
          status: "generating",
          falStatus: falStatus.status,
          message: "Video generation in progress..."
        })
      }
    } catch (falError) {
      const searchParams = new URL(request.url).searchParams
      const generationId = searchParams.get('id')

      logError(falError instanceof Error ? falError : new Error(String(falError)), {
        context: 'FAL status check',
        generationId: generationId,
        falVideoId: generation.fal_video_id
      })

      return NextResponse.json({
        id: generationId,
        status: "error",
        error: "Failed to check generation status"
      }, { status: 500 })
    }

  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), { context: 'Status endpoint error' })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}