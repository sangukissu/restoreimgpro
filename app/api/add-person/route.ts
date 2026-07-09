import { NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import mime from "mime"
import { GoogleGenAI, Part } from "@google/genai"
import sharp from "sharp"
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

// Returned when the model refuses to generate because the second image doesn't
// contain exactly one person. The prompt instructs the model to produce no
// output in that case, so the typical signal is a successful call with no
// images in the response (or an explicit refusal text).
const multiPersonSecondImageError =
  "The 'person to add' photo must contain exactly one person, captured alone. Please upload a clear solo portrait of the missing person and try again."

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

  return `You are an expert photo compositor, retoucher, and 3D-aware scene synthesizer.

Task: Insert a single person into an existing group photo. The FIRST image is the existing photo (the moat) and defines the scene, environment, composition, lighting, and the group of people already in the photo. The SECOND image contains the person to add — and ONLY that one person, captured alone.

═══════════════════════════════════════════
PRODUCT CONTRACT (hard rules — failing to follow these is a failure)
═══════════════════════════════════════════
P1. The second image has been pre-validated to contain exactly one person. Use only that one person. Do not invent additional people from the second image.

P2. The first image is the moat. Its background, furniture, floor, walls, sky, and all non-person elements are pixel-locked and must not change. Only the existing people may shift position slightly (see P3).

P3. People already in the first image may shift by a small percentage of frame width (roughly 1–5% of the frame's narrower side) so the new person fits without impossible overlaps. They MUST keep their original pose, face, body, and clothing. Do not change anyone's expression, gesture, or outfit.

P4. The new person must fit the scene's existing ground plane, eye-line, lens, and lighting. They must look like they were standing there when the photo was taken.

P5. The aspect ratio is "auto" — the canvas may grow slightly in either direction to fit the new person. Use this freedom to create room for the new person instead of forcing an impossible composition.

═══════════════════════════════════════════
SPATIAL REALISM CONTRACT (treat as one moment in 3D)
═══════════════════════════════════════════
Before drawing, internally establish a single shared 3D scene with these constraints:

1. ONE shared ground plane. The base image's floor (or implied ground) is the only ground. The new person's feet must touch this ground at the angle the floor's perspective dictates, with a soft contact shadow on the ground under them. If the second image does not show feet, infer only the minimum natural footwear/legs/lower clothing required to land them on the ground plane — do not invent distracting wardrobe details.

2. ONE shared camera and lens. Treat both inputs as if they were taken from the same camera position, with the same lens (focal length) and the same height. If the second image's person was shot from a different angle or lens, re-project them to match the FIRST image's camera — same vertical eye-level, same horizontal perspective, same lens compression. Do not paste a waist-level straight-on subject into a higher-angle scene.

3. ONE shared Z-depth ordering. Walk the scene front-to-back:
   - Existing people in front (closer to camera, larger, lower in frame) come first.
   - Existing people in back (smaller, higher in frame, partly occluded by front people) come after.
   - The new person occupies a single Z-layer (front, mid, or back) and stays entirely on that layer. Nothing of the new person can pass through a body on a different layer.

4. ONE shared eye-line. Pick a single horizon at the height of the base image's standing adults' eyes. Every visible face in the final image — including the new person's — must sit on or very near this line. The new person must not be a "hobbit" with their head below the adults' eyes, nor float with their head above everyone. If the new person is a child, place their head at child-eye-level on the shared eye-line, not adult-head height.

5. ONE shared scale system. Use the base image's standing adult as the size unit. The new person is sized by the head-to-toe silhouette of that adult at the new person's Z-depth, not by the pixel height of the second image. A new person in the back must be smaller than the same person would be in the front.

6. ONE shared lighting and color temperature. Light the new person with the base image's key/fill direction; cast shadows the same way as existing shadows in the scene. Match white balance, contrast, and saturation to the base image so skin tones, hair tones, and clothing tones all sit on the base image's palette.

7. ONE shared focus. The new person's sharpness must match the base image's focus at their Z-depth. A new person placed in the back of the scene is slightly softer; a new person in front is slightly sharper.

═══════════════════════════════════════════
COMPOSITION (placement, framing, overlap)
═══════════════════════════════════════════
- Place the new person ${placementDirective(placement)}. ${contextDirective}
- If the requested placement is physically impossible in the base scene (would force the new person to overlap a body on a different Z-layer, would put their feet off the ground plane, or would split them at a frame edge), pick the nearest physically valid open space that still respects the user's intent. The aspect ratio is "auto" — let the canvas grow slightly in the needed direction so the new person has room.
- Match the base image's body crop style for the new person. If the base image is a full-body group shot, the new person is full-body. If the base is waist-up or tighter, the new person uses the same crop. Do not invent extra limbs, partial arms, or duplicate torsos at the frame edge.
- Z-order rule: a closer existing subject's body must cleanly occlude the new person where they overlap, and the new person must be partly occluded (not floating on top of) by a closer existing subject. Overlap edges must blend with the same softness as the existing scene's overlapping bodies. No floating babies, no interlocking-arm glitches, no sticker-pasted-on feet.
- If the new person joins from the back, the back-row existing people should be in front of the new person, and the front-row existing people should be in front of those — preserve this order, do not reshuffle.
- Existing people can shift by a few percent of frame width to make room (see P3). They must keep their original pose, face, body, and clothing.

═══════════════════════════════════════════
IDENTITY & INTEGRATION
═══════════════════════════════════════════
- Preserve the identity, face, and clothing of the new person from the second image exactly.
- Apply a soft edge falloff so the new person has no visible halo, no cutout outline, and no mismatched sharpness.
- The new person must not look like a sticker pasted on. Match the grain/noise profile of the base image so the new person does not look "cleaner" or "dirtier" than the rest of the scene.

═══════════════════════════════════════════
INPUT VALIDATION (already done for you)
═══════════════════════════════════════════
A pre-flight check has already confirmed: the second image contains exactly one person, and neither image contains a recognizable public figure. You do not need to refuse, re-check counts, or gate on public-figure rules. Focus entirely on the spatial / identity / composition task below.

═══════════════════════════════════════════
OUTPUT
═══════════════════════════════════════════
A single photorealistic photograph, indistinguishable from a real re-shot moment. Anyone viewing the result should believe all the people were standing together when the photo was taken.`
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

// Inspect a successful Fal response for explicit refusal text the model may
// emit when it decides to refuse the edit. Returns a code describing the
// refusal cause, or null if there's no refusal signal.
function detectRefusal(result: any): "multi_person" | "public_figure" | null {
  const text = JSON.stringify(result ?? {}).toLowerCase()
  if (!text || text === "{}") return null

  const multiPersonSignals = [
    "second image must contain exactly one person",
    "more than one person in the second image",
    "second image contains",
    "two or more people",
    "multiple people in the second",
    "must be a solo",
    "solo portrait",
  ]
  if (multiPersonSignals.some((s) => text.includes(s))) {
    return "multi_person"
  }

  const publicFigureSignals = [
    "public figure",
    "celebrity",
    "politician",
    "prominent real person",
    "restricted content",
  ]
  if (publicFigureSignals.some((s) => text.includes(s))) {
    return "public_figure"
  }
  return null
}

// Lazy-initialize the Gemini client only when the pre-check actually runs.
// We avoid constructing it at module load so that a missing GEMINI_API_KEY in
// non-prod environments doesn't break unrelated code paths.
let _genAI: GoogleGenAI | null | undefined
function getGenAI(): GoogleGenAI | null {
  if (_genAI !== undefined) return _genAI
  if (!process.env.GEMINI_API_KEY) {
    _genAI = null
    return _genAI
  }
  _genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  return _genAI
}

interface CompressedImage {
  data: Buffer
  mimeType: "image/jpeg" | "image/png"
  originalBytes: number
  compressedBytes: number
}

// Fetches the image at `url` and downscales it to fit within MAX_DIMENSION on
// the longer edge, encoded as JPEG quality 82. This keeps the inline payload
// to Gemini small (<300KB typical) so each pre-check call stays cheap.
async function fetchAndCompressImage(url: string): Promise<CompressedImage> {
  const MAX_DIMENSION = 768
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000) // 8s timeout
  let buffer: ArrayBuffer
  let contentType: string | null = null
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }
    buffer = await response.arrayBuffer()
    contentType = response.headers.get("content-type") || mime.getType(url) || null
  } finally {
    clearTimeout(timeout)
  }

  const originalBytes = buffer.byteLength
  const input = Buffer.from(buffer)
  const isPng = contentType ? contentType.includes("png") : false

  const pipeline = sharp(input).rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  })

  const compressed = isPng
    ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
    : await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer()

  return {
    data: compressed,
    mimeType: isPng ? "image/png" : "image/jpeg",
    originalBytes,
    compressedBytes: compressed.byteLength,
  }
}

export type PrecheckVerdict =
  | { status: "ok"; count: number; confidence: number; reason: string }
  | { status: "no_person"; confidence: number; reason: string }
  | { status: "multiple_people"; count: number; confidence: number; reason: string }
  | { status: "public_figure"; identity: string; confidence: number; reason: string }

/**
 * Combined pre-check for the second image (the "person to add"). Runs both
 * the people-count validation and the public-figure safety check in a single
 * Gemini call, on a compressed thumbnail of the image. Returns a verdict the
 * route can act on directly.
 *
 * Fail-open: returns null if Gemini is unavailable or errors. The caller
 * should fall through to the existing prompt-level safety nets in that case.
 */
export async function precheckSecondImage(imageUrl: string): Promise<PrecheckVerdict | null> {
  const genAI = getGenAI()
  if (!genAI) return null

  let compressed: CompressedImage
  try {
    compressed = await fetchAndCompressImage(imageUrl)
  } catch (err) {
    console.warn("[add-person] precheck: image fetch/compress failed:", err)
    return null
  }

  const ratio = compressed.compressedBytes / Math.max(1, compressed.originalBytes)
  console.info("[add-person] precheck: image size", {
    originalBytes: compressed.originalBytes,
    compressedBytes: compressed.compressedBytes,
    ratio: Number(ratio.toFixed(2)),
  })

  const imagePart: Part = {
    inlineData: {
      data: compressed.data.toString("base64"),
      mimeType: compressed.mimeType,
    },
  }

  const prompt = `Look at this image. It's the "person to add" upload for a photo-editing feature that needs exactly ONE person, no public figures.

Answer with strict JSON only (no markdown, no commentary):
{
  "count": <integer — number of distinct FACES visible in the image>,
  "is_public_figure": <true if the primary face is a widely recognizable celebrity / actor / singer / athlete / politician / monarch / head-of-state / internet-famous person that most people would name on sight; false otherwise>
}

Counting rules (face-first):
- Count FACES, not bodies. Only count a person if their face (or full head including hair) is visible.
- IGNORE small cropped body fragments at frame edges — a stray hand, arm, leg, shoulder, torso, or shoe with no face/head attached does NOT count as another person.
- A clean portrait, headshot, or full-body solo shot with one visible face = 1.
- Two clearly visible faces = 2. Three = 3.
- Ignore reflections, mannequins, photos of photos.`

  try {
    const result = await genAI.models.generateContent({
      contents: [
        { text: prompt },
        imagePart,
      ],
      model: "gemini-flash-lite-latest",
    })

    const responseText =
      (result as any).text ??
      result.candidates?.[0]?.content?.parts?.find((p: any) => p?.text)?.text

    if (!responseText || typeof responseText !== "string") return null

    const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
    let parsed: any
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.warn("[add-person] precheck: failed to parse JSON, raw:", cleaned.slice(0, 300))
      return null
    }

    const count = Math.round(Number(parsed.count))
    const isPublicFigure = parsed.is_public_figure === true

    if (!Number.isFinite(count) || count < 0) return null

    if (isPublicFigure) {
      return {
        status: "public_figure",
        identity: "a recognizable public figure",
        confidence: 1,
        reason: "Recognizable public figure detected.",
      }
    }

    if (count === 0) {
      return {
        status: "no_person",
        confidence: 1,
        reason: "No people were detected in the image.",
      }
    }

    if (count > 1) {
      return {
        status: "multiple_people",
        count,
        confidence: 1,
        reason: `${count} people detected in the image.`,
      }
    }

    return {
      status: "ok",
      count: 1,
      confidence: 1,
      reason: "Single person detected.",
    }
  } catch (err) {
    console.warn("[add-person] precheck failed:", err)
    return null
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

    // REQUIRED pre-check on the second image (person to add) via a single
    // Gemini vision call: (1) people count, (2) public-figure safety. This
    // runs BEFORE the Fal call so we never burn a credit on a known-bad run
    // (multi-person uploads make the model fall back to a degenerate output;
    // public-figure uploads are a policy refusal). The image is downscaled
    // to 768px JPEG before being sent to keep this call cheap.
    //
    // The pre-check is HARD-REQUIRED. If it cannot run (missing API key,
    // network error, vision service output), we refuse the request and
    // return a 503 instead of falling through to Fal. Sending to Fal
    // without this gate produces degenerate outputs and wastes credits.
    const [baseUrl, personUrl] = uploadedUrls
    const verdict = await precheckSecondImage(personUrl)
    console.info(
      "[add-person] precheck verdict",
      verdict?.status,
      "count:",
      verdict && "count" in verdict ? verdict.count : undefined
    )
    if (!verdict) {
      console.error("[add-person] precheck unavailable — refusing to proceed to Fal (fail-closed)")
      return NextResponse.json(
        {
          error:
            "We couldn't verify the 'person to add' photo right now. Our safety check is temporarily unavailable. Please try again in a moment.",
          code: "PRECHECK_UNAVAILABLE",
        },
        { status: 503 },
      )
    }
    if (verdict.status === "public_figure") {
      console.info("[add-person] precheck: public_figure", {
        identity: verdict.identity,
        confidence: verdict.confidence,
      })
      return NextResponse.json(
        {
          error: publicFigureError,
          code: "PUBLIC_FIGURE_OR_RESTRICTED_CONTENT",
          details: {
            identity: verdict.identity,
            confidence: verdict.confidence,
            reason: verdict.reason,
          },
        },
        { status: 422 },
      )
    }
    if (verdict.status === "no_person") {
      return NextResponse.json(
        {
          error:
            "The 'person to add' photo doesn't appear to contain a person. Please upload a clear photo of the missing person and try again.",
          code: "NO_PERSON_IN_SECOND_IMAGE",
          details: { confidence: verdict.confidence, reason: verdict.reason },
        },
        { status: 422 },
      )
    }
    if (verdict.status === "multiple_people") {
      return NextResponse.json(
        {
          error: multiPersonSecondImageError,
          code: "MULTIPLE_PEOPLE_IN_SECOND_IMAGE",
          details: {
            count: verdict.count,
            confidence: verdict.confidence,
            reason: verdict.reason,
          },
        },
        { status: 422 },
      )
    }
    // verdict.status === "ok" — proceed to Fal

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
      // The model produced no image. The most likely reasons (per the prompt)
      // are that the second image didn't contain exactly one person, or a
      // public-figure / safety refusal. Inspect the response for the refusal
      // text and return a clean error to the user.
      const refusal = detectRefusal(falOutput)
      if (refusal === "multi_person") {
        return NextResponse.json(
          { error: multiPersonSecondImageError, code: "MULTIPLE_PEOPLE_IN_SECOND_IMAGE" },
          { status: 422 },
        )
      }
      if (refusal === "public_figure") {
        return NextResponse.json(
          { error: publicFigureError, code: "PUBLIC_FIGURE_OR_RESTRICTED_CONTENT" },
          { status: 422 },
        )
      }
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