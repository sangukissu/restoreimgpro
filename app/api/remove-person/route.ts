import { NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import mime from "mime"
import { createClient } from "@/utils/supabase/server"
import { uploadImageToR2 } from "@/lib/r2"
import { uploadR2ObjectToFal, validateOwnedTempRemovePersonKey } from "@/lib/restore-helpers"

fal.config({
  credentials: process.env.FAL_KEY,
})

const aspectRatios = ["1:1", "4:3", "3:4", "16:9", "auto"] as const

function cleanInstruction(value: unknown) {
  if (typeof value !== "string") return ""
  return value.trim().replace(/[<>]/g, "").slice(0, 240)
}

function buildPrompt(instruction: string) {
  const extra = instruction ? `\nUser note: ${instruction}` : ""

  return `Edit the input image by using the visible transparent red brush mark as a selection guide for object removal/inpainting.${extra}

The red brush mark is NOT part of the real photo. It is an instruction overlay. Remove the complete person/object/area indicated by the red mark. If the mark covers only part of a person or object, remove the entire connected person/object that the mark touches.

Critical preservation rules:
- Keep the original photo's framing, aspect ratio, crop, border, grain, blur, damage, exposure, contrast, color temperature, sepia/black-and-white tone, and overall aged-photo look unchanged.
- Do not restore, enhance, recolor, colorize, beautify, sharpen, denoise, zoom, crop, reframe, or stylize the image.
- Copy every unmarked person, face, body, object, background detail, shadow, texture, and edge exactly as much as possible.
- Only synthesize pixels needed to replace the marked subject/area, using nearby background texture, lighting, perspective, and shadows.
- Remove all traces of the red brush mark from the final image.
- Do not leave halos, smears, repeated texture artifacts, ghost silhouettes, cutout edges, or color stains.

Output one photorealistic image that looks like the marked subject was never there, with everything else preserved.`
}
export async function POST(req: NextRequest) {
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

    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
    }

    if (!userProfile || (userProfile.credits ?? 0) < 2) {
      return NextResponse.json(
        { error: "Insufficient credits", code: "INSUFFICIENT_CREDITS", requiresPayment: true },
        { status: 402 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const markedPhoto = typeof body?.marked_photo === "string" ? body.marked_photo : ""
    const aspectRatio = aspectRatios.includes(body?.aspect_ratio) ? body.aspect_ratio : "auto"
    const instruction = cleanInstruction(body?.instruction)

    if (!validateOwnedTempRemovePersonKey(markedPhoto, user.id)) {
      return NextResponse.json({ error: "Invalid image key" }, { status: 400 })
    }

    let falUrl: string
    try {
      falUrl = await uploadR2ObjectToFal(markedPhoto)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to prepare image" },
        { status: 400 },
      )
    }

    let falOutput: any
    try {
      const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
        input: {
          prompt: buildPrompt(instruction),
          image_urls: [falUrl],
          num_images: 1,
          output_format: "png",
          aspect_ratio: aspectRatio,
          resolution: "1K",
        },
        logs: true,
        onQueueUpdate: () => {},
      })
      falOutput = result.data
    } catch (falError: any) {
      const message = falError?.message || "Fal generation failed"
      if (message.includes("authentication") || message.includes("401")) {
        return NextResponse.json({ error: "Authentication failed with generation service." }, { status: 401 })
      }
      if (message.includes("rate limit") || message.includes("429")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }
      if (message.includes("timeout") || message.includes("408")) {
        return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
      }
      if (message.includes("model not found") || message.includes("404")) {
        return NextResponse.json({ error: "Generation model not available." }, { status: 503 })
      }
      return NextResponse.json({ error: "Generation service temporarily unavailable. Please try again." }, { status: 503 })
    }

    const generatedImageUrl = falOutput?.images?.[0]?.url
    if (!generatedImageUrl || typeof generatedImageUrl !== "string") {
      return NextResponse.json({ error: "No image returned from generation service" }, { status: 502 })
    }

    const imageResp = await fetch(generatedImageUrl)
    if (!imageResp.ok) {
      return NextResponse.json({ error: "Failed to download generated image" }, { status: 502 })
    }

    const imageBuffer = Buffer.from(await imageResp.arrayBuffer())
    const contentType = imageResp.headers.get("content-type") || "image/png"
    const randomId = Math.random().toString(36).substring(2, 10)
    const extension = mime.getExtension(contentType) || "png"
    const fileName = `remove-person-${randomId}.${extension}`
    const finalImageKey = await uploadImageToR2(imageBuffer, fileName, user.id, contentType)

    const { data: rows, error: insertError } = await supabase
      .from("remove_person_generations")
      .insert({
        user_id: user.id,
        result_image_url: finalImageKey,
        instruction: instruction || null,
        aspect_ratio: aspectRatio,
        status: "completed",
      })
      .select("id")

    if (insertError) {
      console.error("Remove person generation insert failed:", insertError)
    }

    const creditsRemaining = (userProfile.credits ?? 0) - 2
    await supabase
      .from("user_profiles")
      .update({ credits: creditsRemaining })
      .eq("user_id", user.id)

    return NextResponse.json({
      imageUrl: `/api/image-proxy?key=${encodeURIComponent(finalImageKey)}`,
      generationId: rows?.[0]?.id || null,
      saveWarning: insertError ? "Generated image was returned, but history save failed. Check server logs." : null,
      creditsRemaining,
      success: true,
      creditsDeducted: 2,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove object from photo" },
      { status: 500 },
    )
  }
}