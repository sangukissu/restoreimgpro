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
            .from("nostalgic_hug_generations")
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
                falRequestId: generation.fal_request_id
            })
        }

        // If failed, return error
        if (generation.status === "failed") {
            return NextResponse.json({
                id: generationId,
                status: "failed",
                error: "Video generation failed"
            })
        }

        // Do not poll FAL here; rely on webhook to update DB when complete
        if (!generation.fal_request_id) {
            return NextResponse.json({
                id: generationId,
                status: "uploading",
                message: "Preparing video generation..."
            })
        }

        return NextResponse.json({
            id: generationId,
            status: "generating",
            message: "Video generation in progress..."
        })

    } catch (error) {
        logError(error instanceof Error ? error : new Error(String(error)), { context: 'Status endpoint error' })
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
