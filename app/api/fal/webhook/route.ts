import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { uploadImageToR2, uploadVideoToR2, downloadVideoFromUrl } from "@/lib/r2";
import { normalizeToPng } from "@/lib/watermark";
import { logError } from "@/lib/error-handling";

type FalWebhookStatus = "OK" | "ERROR"

interface ParsedFalWebhookBody {
  requestId: string
  gatewayRequestId?: string
  status: FalWebhookStatus
  payload: Record<string, unknown> | null
  error?: string
  payloadError?: string
}

async function downloadImageFromUrl(imageUrl: string) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const imageBuffer = await response.arrayBuffer();
  return Buffer.from(imageBuffer);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function normalizeWebhookMessage(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (isRecord(value) && typeof value.message === "string") {
    return value.message
  }

  try {
    return JSON.stringify(value)
  } catch {
    return "Unknown webhook error"
  }
}

function parseFalWebhookBody(body: unknown): ParsedFalWebhookBody {
  if (!isRecord(body)) {
    throw new Error("Invalid FAL webhook payload: body must be an object")
  }

  const requestId = body.request_id
  const gatewayRequestId = body.gateway_request_id
  const status = body.status
  const payload = body.payload
  const error = body.error
  const payloadError = body.payload_error

  if (typeof requestId !== "string" || requestId.length === 0) {
    throw new Error("Invalid FAL webhook payload: request_id is required")
  }

  if (gatewayRequestId !== undefined && typeof gatewayRequestId !== "string") {
    throw new Error("Invalid FAL webhook payload: gateway_request_id must be a string")
  }

  if (status !== "OK" && status !== "ERROR") {
    throw new Error("Invalid FAL webhook payload: status must be OK or ERROR")
  }

  if (payload !== null && payload !== undefined && !isRecord(payload)) {
    throw new Error("Invalid FAL webhook payload: payload must be an object or null")
  }

  return {
    requestId,
    gatewayRequestId: typeof gatewayRequestId === "string" ? gatewayRequestId : undefined,
    status,
    payload: isRecord(payload) ? payload : null,
    error: normalizeWebhookMessage(error),
    payloadError: normalizeWebhookMessage(payloadError),
  }
}

function getRestorationImageUrl(payload: Record<string, unknown> | null) {
  if (Array.isArray(payload?.images) && isRecord(payload.images[0]) && typeof payload.images[0].url === "string") {
    return payload.images[0].url;
  }

  if (isRecord(payload?.image) && typeof payload.image.url === "string") {
    return payload.image.url;
  }

  return null;
}

function getVideoUrl(payload: Record<string, unknown> | null) {
  if (isRecord(payload?.video) && typeof payload.video.url === "string") {
    return payload.video.url
  }

  return null
}

export async function POST(request: NextRequest) {
  const generationId = request.nextUrl.searchParams.get("generationId");
  const type = request.nextUrl.searchParams.get("type") || "video";

  if (!generationId) {
    console.error("Missing generationId in webhook call");
    return NextResponse.json({ error: "Missing generationId" }, { status: 400 });
  }

  try {
    const supabase = supabaseAdmin;
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    const webhook = parseFalWebhookBody(body);

    if (type === "restoration") {
      const { data: restoration, error: fetchError } = await supabase
        .from("image_restorations")
        .select("id, user_id, status, restored_image_url, fal_request_id")
        .eq("id", generationId)
        .single();

      if (fetchError || !restoration) {
        logError(new Error("Restoration not found"), {
          generationId,
          type,
          requestId: webhook.requestId,
        });
        return NextResponse.json(
          { error: "Restoration not found" },
          { status: 404 }
        );
      }

      if (!restoration.fal_request_id) {
        return NextResponse.json(
          { error: "Restoration request is missing fal_request_id" },
          { status: 409 }
        );
      }

      if (restoration.fal_request_id !== webhook.requestId) {
        return NextResponse.json(
          { error: "Webhook request_id does not match restoration fal_request_id" },
          { status: 409 }
        );
      }

      if (restoration.status === "completed" || !!restoration.restored_image_url) {
        return NextResponse.json({ success: true, message: "Already completed" });
      }

      if (webhook.payloadError) {
        await supabase.rpc("fail_restoration_and_refund", {
          p_restoration_id: restoration.id,
          p_error_message: webhook.payloadError,
        });
        return NextResponse.json({ success: true, message: "Restoration failed and credits refunded" });
      }

      if (webhook.status === "OK") {
        const restoredImageUrl = getRestorationImageUrl(webhook.payload);

        if (!restoredImageUrl) {
          await supabase.rpc("fail_restoration_and_refund", {
            p_restoration_id: restoration.id,
            p_error_message: "Restoration payload did not contain an image URL",
          });
          return NextResponse.json({ success: true, message: "Restoration failed and credits refunded" });
        }

        const imageBuffer = await downloadImageFromUrl(restoredImageUrl);
        const pngBuffer = await normalizeToPng(imageBuffer);
        const r2Key = await uploadImageToR2(
          pngBuffer,
          `restored-${restoration.id}.png`,
          restoration.user_id,
          "image/png"
        );

        await supabase
          .from("image_restorations")
          .update({
            status: "completed",
            restored_image_url: r2Key,
            updated_at: new Date().toISOString(),
          })
          .eq("id", restoration.id)
          .eq("fal_request_id", webhook.requestId);
      } else if (webhook.status === "ERROR") {
        await supabase.rpc("fail_restoration_and_refund", {
          p_restoration_id: generationId,
          p_error_message: webhook.error || "Image restoration failed at FAL",
        });
      }
    } else if (webhook.status === "OK") {
      if (webhook.payloadError) {
        return NextResponse.json(
          { error: `FAL payload error: ${webhook.payloadError}` },
          { status: 400 }
        );
      }

      const videoUrl = getVideoUrl(webhook.payload);

      if (!videoUrl) {
        return NextResponse.json(
          { error: "Video payload did not contain a video URL" },
          { status: 400 }
        );
      }

      const { data: generation, error: fetchError } = await supabase
        .from("video_generations")
        .select("id, user_id, status, video_url")
        .eq("id", generationId)
        .single();

      if (fetchError || !generation) {
        logError(new Error("Generation not found"), {
          generationId,
          type,
        });
        return NextResponse.json(
          { error: "Generation not found" },
          { status: 404 }
        );
      }

      if (generation.status === "completed" || !!generation.video_url) {
        return NextResponse.json({ success: true, message: "Already completed" });
      }

      const videoBuffer = await downloadVideoFromUrl(videoUrl);
      const r2Key = await uploadVideoToR2(
        videoBuffer,
        `video-${generation.id}.mp4`,
        generation.user_id
      );

      await supabase
        .from("video_generations")
        .update({
          status: "completed",
          video_url: r2Key,
          updated_at: new Date().toISOString(),
        })
        .eq("id", generation.id);
    } else if (webhook.status === "ERROR") {
      await supabase
        .from("video_generations")
        .update({
          status: "failed",
          error_message: webhook.error || "Video generation failed at FAL",
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
