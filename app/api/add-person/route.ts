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
  const contextDirective = context ? `Additional context by user: ${context}` : ""

  return `[TASK: TIGHT PROXIMITY IMAGE COMPOSITION & CONTEXTUAL INSERTION]

INPUT_A (Base Scene Group Photo)
INPUT_B (Individual to Insert)
Placement: ${placementDirective(placement)}. ${contextDirective}

[1. COMPACT LAYOUT & SPATIAL ARCHITECTURE]
- ANTI-GAP CONSTRAINT: Do not create wide-angle panoramas, auxiliary open spaces, or empty background voids on the flanks of the image. Avoid zooming out the lens perspective.
- MINIMAL WIDTH ADAPTATION: Adjust the overall canvas width strictly by the exact physical shoulder-width volume required to accommodate the profile from INPUT_B. The resulting framing must remain a tight, focused group portrait.
- CONTIGUOUS POSITIONING: Seamlessly insert the individual from INPUT_B into immediate shoulder-to-shoulder or arm's-length proximity with the subjects in INPUT_A. They must blend directly into the existing human cluster as a natural, interconnected family member, minimizing any spatial gap between bodies.

[2. DYNAMIC ENVIRONMENT HARMONIZATION]
- CONTEXTUAL SURFACE CONTINUATION: Analyze the immediate background, flooring, and environmental vectors directly surrounding the insertion point in INPUT_A. Extend those structural lines, patterns, and textures natively behind and beneath the newly inserted subject without altering the original background layout of the rest of the scene.
- PERSPECTIVE ALIGNMENT: Maintain the exact camera focal height, lens compression, and vanishing points of INPUT_A. The inserted individual must share the identical horizon line and depth plane as the adjacent subjects.

[3. PHOTOREALISTIC INTEGRATION & SCALE]
- RELATIVE DIMENSIONALITY: Programmatically calculate the scale metrics of nearby adult subjects in INPUT_A. Match the height, head-to-shoulder proportions, and physical volume of the subject from INPUT_B to the existing subjects to maintain flawless human perspective.
- MATRIX LIGHTING MATCH: Extract the precise light vectors (angle, direction, diffusion/hardness, color temperature, and color cast) from INPUT_A and apply them directly to the subject from INPUT_B for consistent, cohesive lighting for all subjects.
- MICRO-SHADOWING: Generate tight, realistic contact and occlusion shadows where the inserted subject interacts with the floor plane and where their profile sits adjacent to the original subjects.

[4. IDENTITY & STRUCTURE GUARDRAILS]
- FIXED SUBJECT METRICS: Lock all facial features, bone structure, expressions, and clothing textures of every individual across both input images. Prevent any pixel morphing, feature softening, or AI hallucinations.
do not chnage the poses and faces of persons form base photo. identity must be kept intact. and the person from second image must not loose it's facial identity. apply consistent skin brightness as per base photo.`
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