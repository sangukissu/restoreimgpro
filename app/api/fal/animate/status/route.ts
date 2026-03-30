import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { logError } from "@/lib/error-handling"

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

    if (!generation.fal_video_id) {
      return NextResponse.json({
        id: generationId,
        status: "uploading",
        message: "Preparing video generation..."
      })
    }

    return NextResponse.json({
      id: generationId,
      status: generation.status,
      videoUrl: generation.video_url,
      falVideoId: generation.fal_video_id,
      message: "This endpoint is database-backed only. Realtime updates are the primary flow."
    })

  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), { context: 'Status endpoint error' })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
