import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { uploadVideoToBlob, downloadVideoFromUrl } from "@/lib/vercel-blob";
import { logError } from "@/lib/error-handling";

export async function POST(request: NextRequest) {
  const generationId = request.nextUrl.searchParams.get("generationId");

  if (!generationId) {
    console.error("Missing generationId in webhook call");
    return NextResponse.json({ error: "Missing generationId" }, { status: 400 });
  }

  try {
    const supabase = supabaseAdmin;
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    const { status, error, payload } = body;

    if (status === "OK") {
      const videoUrl = payload.video.url;

      const { data: generation, error: fetchError } = await supabase
        .from("video_generations")
        .select("id, user_id, status, video_url")
        .eq("id", generationId)
        .single();

      if (fetchError || !generation) {
        logError(new Error("Generation not found"), {
          generationId,
        });
        return NextResponse.json(
          { error: "Generation not found" },
          { status: 404 }
        );
      }

      // Check if generation is already completed to prevent duplicate uploads
      if (generation.status === "completed" || !!generation.video_url) {
        return NextResponse.json({ success: true, message: "Already completed" });
      }

      const videoBuffer = await downloadVideoFromUrl(videoUrl);

      const blobUrl = await uploadVideoToBlob(
        videoBuffer,
        `video-${generation.id}.mp4`,
        generation.user_id
      );

      await supabase
        .from("video_generations")
        .update({
          status: "completed",
          video_url: blobUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", generation.id);
    } else if (status === "ERROR") {
      await supabase
        .from("video_generations")
        .update({
          status: "failed",
          error_message: error || "Video generation failed at FAL",
          updated_at: new Date().toISOString(),
        })
        .eq("id", generationId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      context: "FAL webhook handler",
      generationId,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}