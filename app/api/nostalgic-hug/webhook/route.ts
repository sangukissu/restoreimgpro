import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import { uploadVideoToR2, downloadVideoFromUrl } from "@/lib/r2"
import { logError } from "@/lib/error-handling"
import { FEATURE_CREDIT_COSTS } from "@/lib/pricing"

const HUG_CREDITS = FEATURE_CREDIT_COSTS.nostalgicHug.credits

/**
 * Mark generation failed and refund hug credits once.
 * Only refunds when moving from a non-terminal state so retries stay idempotent.
 */
async function failAndRefundHug(
  supabase: typeof supabaseAdmin,
  generationId: string,
  reason: string
) {
  const { data: generation, error: fetchError } = await supabase
    .from("nostalgic_hug_generations")
    .select("id, user_id, status, video_url")
    .eq("id", generationId)
    .single()

  if (fetchError || !generation) {
    return { ok: false as const, message: "Generation not found" }
  }

  if (generation.status === "completed" || generation.video_url) {
    return { ok: true as const, message: "Already completed — no refund" }
  }

  if (generation.status === "failed") {
    return { ok: true as const, message: "Already failed — refund skipped" }
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", generation.user_id)
    .single()

  // Mark failed first so concurrent webhooks do not double-refund
  const { data: updated, error: updateError } = await supabase
    .from("nostalgic_hug_generations")
    .update({
      status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", generationId)
    .in("status", ["uploading", "generating"])
    .select("id")
    .maybeSingle()

  if (updateError || !updated) {
    return { ok: true as const, message: "Status already terminal" }
  }

  if (profile) {
    await supabase
      .from("user_profiles")
      .update({ credits: (profile.credits ?? 0) + HUG_CREDITS })
      .eq("user_id", generation.user_id)
  }

  logError(new Error(`Nostalgic hug failed: ${reason}`), {
    generationId,
    userId: generation.user_id,
    refundedCredits: HUG_CREDITS,
  })

  return { ok: true as const, message: "Failed and credits refunded" }
}

export async function POST(request: NextRequest) {
  const generationId = request.nextUrl.searchParams.get("generationId")

  if (!generationId) {
    console.error("Missing generationId in webhook call")
    return NextResponse.json({ error: "Missing generationId" }, { status: 400 })
  }

  try {
    const supabase = supabaseAdmin
    const bodyText = await request.text()
    const body = JSON.parse(bodyText)
    const { status, error, payload } = body

    if (status === "OK") {
      const videoUrl =
        payload?.video?.url ||
        payload?.video_url ||
        payload?.output?.video?.url ||
        payload?.url

      if (!videoUrl) {
        console.error(
          "Could not find video URL in Fal webhook payload:",
          JSON.stringify(payload)
        )
        await failAndRefundHug(supabase, generationId, "Missing video URL in payload")
        return NextResponse.json({
          success: true,
          message: "Hug failed and credits refunded (missing video URL)",
        })
      }

      const { data: generation, error: fetchError } = await supabase
        .from("nostalgic_hug_generations")
        .select("id, user_id, status, video_url")
        .eq("id", generationId)
        .single()

      if (fetchError || !generation) {
        logError(new Error("Generation not found"), { generationId })
        return NextResponse.json({ error: "Generation not found" }, { status: 404 })
      }

      if (generation.status === "completed" || !!generation.video_url) {
        return NextResponse.json({ success: true, message: "Already completed" })
      }

      try {
        const videoBuffer = await downloadVideoFromUrl(videoUrl)
        const r2Key = await uploadVideoToR2(
          videoBuffer,
          `nostalgic-hug-${generation.id}.mp4`,
          generation.user_id
        )

        await supabase
          .from("nostalgic_hug_generations")
          .update({
            status: "completed",
            video_url: r2Key,
            updated_at: new Date().toISOString(),
          })
          .eq("id", generation.id)
      } catch (uploadErr) {
        await failAndRefundHug(
          supabase,
          generationId,
          uploadErr instanceof Error ? uploadErr.message : "Upload failed"
        )
        return NextResponse.json({
          success: true,
          message: "Hug failed during upload; credits refunded",
        })
      }
    } else if (status === "ERROR") {
      await failAndRefundHug(
        supabase,
        generationId,
        error || "Video generation failed at provider"
      )
      return NextResponse.json({
        success: true,
        message: "Hug failed and credits refunded",
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      context: "Nostalgic Hug webhook handler",
      generationId,
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
