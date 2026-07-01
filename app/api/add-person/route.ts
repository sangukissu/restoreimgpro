import { NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import mime from "mime"
import { createClient } from "@/utils/supabase/server"
import { uploadImageToR2 } from "@/lib/r2"
import { uploadR2ObjectToFal, validateOwnedTempAddPersonKey } from "@/lib/restore-helpers"

fal.config({
  credentials: process.env.FAL_KEY,
})

const placements = ["left", "center-left", "center", "center-right", "right"] as const
const aspectRatios = ["1:1", "4:3", "3:4", "16:9", "auto"] as const
const publicFigureError =
  "We can't edit photos that include recognizable public figures or restricted content. Please use personal photos where you have permission to create this edit."

type Placement = (typeof placements)[number]

function placementDirective(placement: Placement) {
  const directives: Record<Placement, string> = {
    left: "on the left side of the scene",
    "center-left": "slightly left of center in the scene",
    center: "near the center of the scene",
    "center-right": "slightly right of center in the scene",
    right: "on the right side of the scene",
  }
  return directives[placement]
}

function cleanContext(context: unknown) {
  if (typeof context !== "string") return ""
  return context.trim().replace(/[<>]/g, "").slice(0, 200)
}

function buildPrompt(placement: Placement, context: string) {
  const contextDirective = context ? `"Additional context by user: ${context}"` : ""

  return `You are an expert photo compositor and retoucher.
Task: Seamlessly insert the person from the SECOND input image into the scene of the FIRST input image. The first image is the base scene - preserve its environment, composition, lighting, perspective, background, and all existing people exactly as they are. The second image contains the person to add.
Placement: Add the person ${placementDirective(placement)}. ${contextDirective} The person should appear as if they were originally part of the photograph - naturally fitting the scene's depth, perspective, and spatial arrangement. If the requested area has too little usable room, choose the nearest natural open space that still respects the user's placement intent.
Composition Planning (Critical):
- First inspect the base scene for empty background, visible floor/ground plane, depth, eye line, and existing subjects' silhouettes before deciding where the new person belongs.
- Treat the SECOND image as the identity, face, and clothing reference, not as a literal cutout to paste. Decide the inserted person's visible body crop from the FIRST image's framing and available space: if the base scene is full-body and has room, create a full-body insertion at matching scale; if the base scene is waist-up, bust, or tight, use the same crop style. When the SECOND image lacks lower-body details, infer only the minimum natural body and clothing needed to match the FIRST image, without changing identity or inventing distracting details.
- Match the inserted person's scale to nearby faces, shoulders, and camera distance in the FIRST image.
- Follow the requested placement and any user-provided context first; then choose the cleanest nearby position that keeps the inserted person physically plausible in the FIRST image.
- If the placement or user context requires overlap, place the person only where the occlusion can be physically natural and clean. Do not force the person behind, through, or on top of foreground subjects when that would create an impossible composition.
- Do not add stray hands, partial arms, extra limbs, duplicate people, or unrelated body parts at the frame edges while satisfying the placement and context.
Integration Requirements (Critical):
- Match the base photo's lighting, color temperature, shadows, and contrast on the inserted person.
- Preserve the identity, likeness, facial features, and clothing of the person being added.
- Ensure correct scale and perspective relative to existing subjects.
- Apply natural edge blending so the insertion is invisible - no halo, no cutout edges, no mismatched tones.
- If either input image contains a recognizable public figure, celebrity, politician, or other prominent real person, deny the photo editing and do not generate an edited image.
Output: A single photorealistic photograph, indistinguishable from an unmodified original.`
}

function getFalErrorDetails(error: any) {
  const status = Number(error?.status || error?.statusCode || error?.body?.status || error?.response?.status)
  const message = typeof error?.message === "string" ? error.message : ""
  const body = error?.body || error?.response?.body || error?.data || null
  const bodyText = body ? JSON.stringify(body) : ""

  return {
    status,
    text: `${message} ${bodyText}`.toLowerCase(),
  }
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
    const basePhoto = typeof body?.base_photo === "string" ? body.base_photo : ""
    const personPhoto = typeof body?.person_photo === "string" ? body.person_photo : ""
    const placement = placements.includes(body?.placement) ? body.placement as Placement : "center"
    const aspectRatio = aspectRatios.includes(body?.aspect_ratio) ? body.aspect_ratio : "auto"
    const context = cleanContext(body?.context)

    if (!validateOwnedTempAddPersonKey(basePhoto, user.id) || !validateOwnedTempAddPersonKey(personPhoto, user.id)) {
      return NextResponse.json({ error: "Invalid image key" }, { status: 400 })
    }

    let uploadedUrls: string[]
    try {
      uploadedUrls = await Promise.all([
        uploadR2ObjectToFal(basePhoto),
        uploadR2ObjectToFal(personPhoto),
      ])
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to prepare images" },
        { status: 400 },
      )
    }

    let falOutput: any
    try {
      const result = await fal.subscribe("fal-ai/nano-banana-2/edit", {
        input: {
          prompt: buildPrompt(placement, context),
          image_urls: uploadedUrls,
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
      const falDetails = getFalErrorDetails(falError)
      if (
        falDetails.status === 422 ||
        falDetails.text.includes("no_media_generated") ||
        falDetails.text.includes("unsafe content") ||
        falDetails.text.includes("validationerror")
      ) {
        return NextResponse.json(
          { error: publicFigureError, code: "PUBLIC_FIGURE_OR_RESTRICTED_CONTENT" },
          { status: 422 },
        )
      }
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
    const fileName = `add-person-${randomId}.${extension}`
    const finalImageKey = await uploadImageToR2(imageBuffer, fileName, user.id, contentType)

    const { data: rows, error: insertError } = await supabase
      .from("add_person_generations")
      .insert({
        user_id: user.id,
        composed_image_url: finalImageKey,
        placement,
        context: context || null,
        aspect_ratio: aspectRatio,
        status: "completed",
      })
      .select("id")

    if (insertError) {
      return NextResponse.json({ error: "Failed to save generated image" }, { status: 500 })
    }

    const creditsRemaining = (userProfile.credits ?? 0) - 2
    await supabase
      .from("user_profiles")
      .update({ credits: creditsRemaining })
      .eq("user_id", user.id)

    return NextResponse.json({
      imageUrl: `/api/image-proxy?key=${encodeURIComponent(finalImageKey)}`,
      generationId: rows?.[0]?.id,
      creditsRemaining,
      success: true,
      creditsDeducted: 2,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add person to photo" },
      { status: 500 },
    )
  }
}