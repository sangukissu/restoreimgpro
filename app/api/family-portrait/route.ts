import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import mime from 'mime'
import { createClient } from '@/utils/supabase/server'

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY,
})

// Map of allowed background styles to prescriptive prompt text
const backgroundStyleMap: Record<string, string> = {
  black:
    "Use a matte charcoal seamless studio backdrop with soft falloff to near‑black; no visible texture; no patterns.",
  gray:
    "Use a neutral mid‑gray seamless studio paper; evenly lit; slight vignette; no patterns; no visible texture.",
  beige:
    "Use a light warm beige studio background; high‑key look; soft shadows only; no patterns; no texture.",
  gradient:
    "Use a very faint center‑weighted studio gradient from dark to light; avoid banding; no visible texture or patterns.",
  brown:
    "Use a classic dark brown portrait studio background with a gentle vignette; no obvious texture; no patterns.",
  bokeh:
    "Use an abstract shallow depth‑of‑field bokeh background with soft circular highlights; no identifiable scene elements, objects, or text.",
}

function buildPrompt(subjectCount: number, aspectRatio: string, backgroundStyleText: string) {
  const arrangement = subjectCount <= 2
    ? 'Place subjects side-by-side, shoulder-level, gently angled toward center.'
    : 'Arrange subjects in a natural, cohesive group; prioritize center alignment and spacing suitable for a wider frame.'

  return `You are an expert photo compositor, to bring back the lost memories of loved ones.
Combine the provided individual portrait photos into a single cohesive family portrait.

Identity preservation is mandatory:
- Replicate each subject’s face exactly as in the references: facial geometry, proportions, distinctive features, age markers (wrinkles, scars, moles), hairline and facial hair.
- Do NOT beautify, modernize, de-age, reinterpret, or replace any subject. If any subject appears elderly or from an archival photo (e.g., a grandfather), preserve that identity strictly and keep age marks intact.
Maintain skin texture, color grading consistency across all persons, and natural proportions across all subjects.
${arrangement}
${backgroundStyleText}
Keep lighting direction unified across all subjects; harmonize shadows naturally.
Output must look like a single photograph, not a collage.
Remove distortions, warping, objects, halos, cutout edges, banding, posterization, or added props.
Final image aspect ratio: ${aspectRatio}.
Render at high quality.`
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check user credits (must have at least 1)
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to check credits' }, { status: 500 })
    }

    if (!userProfile || (userProfile.credits ?? 0) <= 0) {
      return NextResponse.json({
        error: 'Insufficient credits',
        code: 'INSUFFICIENT_CREDITS',
        requiresPayment: true,
      }, { status: 402 })
    }

    // Parse request body robustly: support JSON and x-www-form-urlencoded
    const contentType = req.headers.get('content-type') || ''
    let images: string[] = []
    let aspectRatio: string = '4:3'
    let backgroundStyle: string = 'black'

    if (contentType.includes('application/json')) {
      const body = await req.json()
      images = Array.isArray(body?.images) ? body.images.slice(0, 4) : []
      aspectRatio = body?.aspectRatio || aspectRatio
      backgroundStyle = body?.backgroundStyle || backgroundStyle
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const raw = await req.text()
      const params = new URLSearchParams(raw)
      const imgParams = params.getAll('images')
      images = imgParams.slice(0, 4)
      aspectRatio = params.get('aspectRatio') || aspectRatio
      backgroundStyle = params.get('backgroundStyle') || backgroundStyle
    } else if (contentType.includes('multipart/form-data')) {
      // Minimal support: expect string fields for images (URLs/base64). Files are not supported here.
      const form = await req.formData()
      const imgEntries = form.getAll('images')
      images = imgEntries
        .map((v) => (typeof v === 'string' ? v : ''))
        .filter(Boolean)
        .slice(0, 4)
      aspectRatio = (form.get('aspectRatio') as string) || aspectRatio
      backgroundStyle = (form.get('backgroundStyle') as string) || backgroundStyle
    } else {
      // Fallback: try to parse as JSON text, else return helpful error
      try {
        const raw = await req.text()
        const body = JSON.parse(raw)
        images = Array.isArray(body?.images) ? body.images.slice(0, 4) : []
        aspectRatio = body?.aspectRatio || aspectRatio
        backgroundStyle = body?.backgroundStyle || backgroundStyle
      } catch {
        return NextResponse.json({
          error: 'Unsupported payload format. Send JSON (Content-Type: application/json) or x-www-form-urlencoded with fields: images[], aspectRatio, backgroundStyle.',
        }, { status: 415 })
      }
    }

    const bgText = backgroundStyleMap[backgroundStyle] || backgroundStyleMap['black']

    if (images.length === 0) {
      return NextResponse.json({ error: 'Provide 1–4 images (base64 data URLs or URLs).' }, { status: 400 })
    }

    // Ensure Fal API key configured
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: 'Fal AI API key not configured' }, { status: 500 })
    }

    // Build prompt for composition
    const prompt = buildPrompt(images.length, aspectRatio, bgText)

    // Debug: log final prompt and key params (non-production only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[FamilyPortrait] Final prompt:', prompt)
      console.log('[FamilyPortrait] Params:', {
        aspectRatio,
        backgroundStyle,
        subjectCount: images.length,
      })
    }

    // Upload all input images to Fal storage to obtain stable URLs
    const uploadedUrls: string[] = []
    for (const img of images) {
      try {
        if (img.startsWith('data:')) {
          const [meta, b64] = img.split(',')
          const mimeType = meta.substring(5, meta.indexOf(';')) || 'image/png'
          const buffer = Buffer.from(b64, 'base64')
          const blob = new Blob([buffer], { type: mimeType })
          const url = await fal.storage.upload(blob)
          uploadedUrls.push(url)
        } else {
          // Fetch remote URL and re-upload to Fal storage for reliability
          const resp = await fetch(img)
          if (!resp.ok) {
            throw new Error(`Failed to fetch image: ${resp.status}`)
          }
          const arrayBuf = await resp.arrayBuffer()
          const contentType = resp.headers.get('content-type') || mime.getType(img) || 'image/png'
          const blob = new Blob([arrayBuf], { type: contentType })
          const url = await fal.storage.upload(blob)
          uploadedUrls.push(url)
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown image upload error'
        return NextResponse.json({ error: `Failed to prepare image: ${message}` }, { status: 400 })
      }
    }

    // Call Fal nano-banana edit model to compose images
    let falOutput: any
    try {
      const result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          prompt,
          image_urls: uploadedUrls,
          num_images: 1,
          output_format: 'png',
          aspect_ratio: aspectRatio,
          limit_generations: false,
        },
        logs: true,
        onQueueUpdate: () => {
          // No-op: logs suppressed in production
        },
      })
      falOutput = result.data
    } catch (falError: any) {
      const msg = falError?.message || 'Fal generation failed'
      // Map common failure modes
      if (msg.includes('authentication') || msg.includes('401')) {
        return NextResponse.json({ error: 'Authentication failed with generation service.' }, { status: 401 })
      }
      if (msg.includes('rate limit') || msg.includes('429')) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 })
      }
      if (msg.includes('timeout') || msg.includes('408')) {
        return NextResponse.json({ error: 'Request timeout. Please try again.' }, { status: 408 })
      }
      if (msg.includes('model not found') || msg.includes('404')) {
        return NextResponse.json({ error: 'Generation model not available.' }, { status: 503 })
      }
      return NextResponse.json({ error: 'Generation service temporarily unavailable. Please try again.' }, { status: 503 })
    }

    // Validate Fal output
    if (!falOutput || !falOutput.images || !Array.isArray(falOutput.images) || falOutput.images.length === 0) {
      return NextResponse.json({ error: 'No image returned from generation service' }, { status: 502 })
    }

    const generatedImageUrl: string = falOutput.images[0].url
    if (!generatedImageUrl || typeof generatedImageUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid generation response' }, { status: 502 })
    }

    // Download generated image and store in Supabase
    let finalImageUrl: string
    try {
      const imageResp = await fetch(generatedImageUrl)
      if (!imageResp.ok) {
        throw new Error(`Failed to download image: ${imageResp.status}`)
      }
      const buf = await imageResp.arrayBuffer()
      const contentType = imageResp.headers.get('content-type') || 'image/png'
      const imageBlob = new Blob([buf], { type: contentType })

      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 10)
      const fileExtension = (mime.getExtension(contentType) || 'png')
      const fileName = `${user.id}/${timestamp}_family_portrait_${randomId}.${fileExtension}`

      const { error: uploadError } = await supabase.storage
        .from('restored_photos')
        .upload(fileName, imageBlob, { contentType, cacheControl: '3600' })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data: publicUrlData } = await supabase.storage
        .from('restored_photos')
        .getPublicUrl(fileName)
      finalImageUrl = publicUrlData.publicUrl
    } catch (storageError) {
      // Fallback: return Fal URL directly
      finalImageUrl = generatedImageUrl
    }

    // Persist a record in the dedicated family_portraits table
    const { data: fpRows, error: insertError } = await supabase
      .from('family_portraits')
      .insert({
        user_id: user.id,
        composed_image_url: finalImageUrl,
        aspect_ratio: aspectRatio,
        input_image_count: images.length,
        status: 'completed',
      })
      .select('id')
    const familyPortraitId = fpRows?.[0]?.id
    if (insertError) {
      // Non-fatal: still return image to user
    }

    // Deduct 1 credit after successful generation and save
    const remaining = (userProfile.credits ?? 0) - 1
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ credits: remaining })
      .eq('user_id', user.id)

    // Return response even if credits update failed (avoid blocking user on non-critical error)
    return NextResponse.json({ imageUrl: finalImageUrl, familyPortraitId, creditsRemaining: remaining, success: true, creditsDeducted: 1 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}