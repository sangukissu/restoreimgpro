import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import mime from 'mime'
import { createClient } from '@/utils/supabase/server'
import { getR2SignedUrl, deleteR2Object, uploadImageToR2 } from '@/lib/r2'
import { buildAdvancedFamilyPortraitPrompt } from '@/lib/family-portrait/prompt-builder'
import type { ClothingMode } from '@/lib/family-portrait/themes'
import { getThemeById } from '@/lib/family-portrait/themes'

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY,
})

// Fallback legacy background style mapping
const legacyBackgroundToThemeMap: Record<string, string> = {
  black: 'studio-matte-black',
  gray: 'studio-neutral-gray',
  beige: 'studio-warm-beige',
  gradient: 'studio-gradient',
  brown: 'studio-dark-brown',
  bokeh: 'studio-bokeh',
}

const FAMILY_PORTRAIT_MODEL = 'openai/gpt-image-2/edit' as const

const IMAGE_SIZE_BY_ASPECT_RATIO = {
  '1:1': 'square_hd',
  '3:4': 'portrait_4_3',
  '4:3': 'landscape_4_3',
  '16:9': 'landscape_16_9',
} as const

type SupportedAspectRatio = keyof typeof IMAGE_SIZE_BY_ASPECT_RATIO

function isSupportedAspectRatio(value: unknown): value is SupportedAspectRatio {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(IMAGE_SIZE_BY_ASPECT_RATIO, value)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check user credits (requires 2 credits)
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to check credits' }, { status: 500 })
    }

    if (!userProfile || (userProfile.credits ?? 0) < 2) {
      return NextResponse.json({
        error: 'Insufficient credits',
        code: 'INSUFFICIENT_CREDITS',
        requiresPayment: true,
      }, { status: 402 })
    }

    // Parse request body robustly: support JSON, formdata, and x-www-form-urlencoded
    const contentType = req.headers.get('content-type') || ''
    let images: Array<string | File> = []
    let requestedAspectRatio: unknown = '4:3'
    let themeId: string = 'studio-matte-black'
    let personCount: number = 0
    let petCount: number = 0
    let clothingMode: ClothingMode = 'preserve'

    if (contentType.includes('application/json')) {
      const body = await req.json()
      images = Array.isArray(body?.images) ? body.images.slice(0, 8) : []
      requestedAspectRatio = body?.aspectRatio || requestedAspectRatio
      themeId = body?.themeId || (body?.backgroundStyle ? legacyBackgroundToThemeMap[body.backgroundStyle] : themeId)
      personCount = typeof body?.personCount === 'number' && body.personCount > 0 ? body.personCount : images.length
      petCount = typeof body?.petCount === 'number' && body.petCount >= 0 ? body.petCount : 0
      clothingMode = body?.clothingMode === 'restyle' ? 'restyle' : (body?.clothingMode === 'preserve' ? 'preserve' : getThemeById(themeId).defaultClothingMode)
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const raw = await req.text()
      const params = new URLSearchParams(raw)
      const imgParams = params.getAll('images')
      images = imgParams.slice(0, 8)
      requestedAspectRatio = params.get('aspectRatio') || requestedAspectRatio
      themeId = params.get('themeId') || (params.get('backgroundStyle') ? legacyBackgroundToThemeMap[params.get('backgroundStyle')!] : themeId)
      personCount = params.get('personCount') ? parseInt(params.get('personCount')!, 10) : images.length
      petCount = params.get('petCount') ? parseInt(params.get('petCount')!, 10) : 0
    } else if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const imgEntries = form.getAll('images')
      images = imgEntries.slice(0, 8) as Array<string | File>
      requestedAspectRatio = form.get('aspectRatio') || requestedAspectRatio
      themeId = (form.get('themeId') as string) || themeId
      personCount = form.get('personCount') ? parseInt(form.get('personCount') as string, 10) : images.length
      petCount = form.get('petCount') ? parseInt(form.get('petCount') as string, 10) : 0
    } else {
      try {
        const raw = await req.text()
        const body = JSON.parse(raw)
        images = Array.isArray(body?.images) ? body.images.slice(0, 8) : []
        requestedAspectRatio = body?.aspectRatio || requestedAspectRatio
        themeId = body?.themeId || themeId
        personCount = typeof body?.personCount === 'number' && body.personCount > 0 ? body.personCount : images.length
        petCount = typeof body?.petCount === 'number' && body.petCount >= 0 ? body.petCount : 0
      } catch {
        return NextResponse.json({
          error: 'Unsupported payload format. Send JSON (Content-Type: application/json).',
        }, { status: 415 })
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'Provide at least 1 image for synthesis.' }, { status: 400 })
    }

    if (!isSupportedAspectRatio(requestedAspectRatio)) {
      return NextResponse.json({
        error: 'Unsupported aspect ratio. Choose 1:1, 3:4, 4:3, or 16:9.',
      }, { status: 400 })
    }
    const aspectRatio = requestedAspectRatio
    const imageSize = IMAGE_SIZE_BY_ASPECT_RATIO[aspectRatio]

    if (!Number.isInteger(personCount) || personCount < 1 || personCount > 12) {
      return NextResponse.json({ error: 'Person count must be an integer from 1 to 12.' }, { status: 400 })
    }
    if (!Number.isInteger(petCount) || petCount < 0 || petCount > 5) {
      return NextResponse.json({ error: 'Pet count must be an integer from 0 to 5.' }, { status: 400 })
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: 'Fal AI API key not configured' }, { status: 500 })
    }

    // Upload all input images to Fal storage to obtain stable URLs
    const uploadedUrls: string[] = []
    for (const img of images) {
      try {
        if (typeof img === 'string') {
          if (img.startsWith('data:')) {
            const [meta, b64] = img.split(',')
            const mimeType = meta.substring(5, meta.indexOf(';')) || 'image/png'
            const buffer = Buffer.from(b64, 'base64')
            const blob = new Blob([buffer], { type: mimeType })
            const url = await fal.storage.upload(blob)
            uploadedUrls.push(url)
          } else {
            // Check if it is an R2 key or a standard URL
            let fetchUrl = img
            let tempKey: string | null = null
            if (!img.startsWith('http') && !img.startsWith('data:')) {
              fetchUrl = await getR2SignedUrl(img)
              tempKey = img
            }

            const resp = await fetch(fetchUrl)
            if (!resp.ok) {
              throw new Error(`Failed to fetch image: ${resp.status}`)
            }
            const arrayBuf = await resp.arrayBuffer()
            const contentType = resp.headers.get('content-type') || mime.getType(fetchUrl) || 'image/png'
            const blob = new Blob([arrayBuf], { type: contentType })
            const url = await fal.storage.upload(blob)
            uploadedUrls.push(url)

            if (tempKey) {
              try {
                await deleteR2Object(tempKey)
              } catch (cleanupErr) {
                console.warn(`[family-portrait] Failed to delete temp R2 object ${tempKey}:`, cleanupErr)
              }
            }
          }
        } else {
          const fileLike: any = img
          const arrayBuf = await fileLike.arrayBuffer()
          const contentType = fileLike.type || 'image/png'
          const blob = new Blob([arrayBuf], { type: contentType })
          const url = await fal.storage.upload(blob)
          uploadedUrls.push(url)
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown image upload error'
        return NextResponse.json({ error: `Failed to prepare image: ${message}` }, { status: 400 })
      }
    }

    // Build advanced prompt with explicit indexed reference image binding (Input Image 1..N)
    const prompt = buildAdvancedFamilyPortraitPrompt({
      themeId,
      personCount: personCount > 0 ? personCount : Math.max(1, uploadedUrls.length),
      petCount,
      aspectRatio,
      clothingMode,
      imageCount: uploadedUrls.length,
    })

    // Compose the uploaded identity references with GPT Image 2.
    let falOutput: any
    try {
      const result = await fal.subscribe(FAMILY_PORTRAIT_MODEL, {
        input: {
          prompt,
          image_urls: uploadedUrls,
          num_images: 1,
          output_format: 'png',
          quality: 'medium',
          image_size: imageSize,
        },
        logs: true,
        onQueueUpdate: () => {},
      })
      falOutput = result.data
    } catch (falError: any) {
      const msg = falError?.message || 'Fal generation failed'
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

    if (!falOutput || !falOutput.images || !Array.isArray(falOutput.images) || falOutput.images.length === 0) {
      return NextResponse.json({ error: 'No image returned from generation service' }, { status: 502 })
    }

    const generatedImageUrl: string = falOutput.images[0].url
    if (!generatedImageUrl || typeof generatedImageUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid generation response' }, { status: 502 })
    }

    let finalImageUrl: string
    let responseImageUrl: string
    try {
      const imageResp = await fetch(generatedImageUrl)
      if (!imageResp.ok) {
        throw new Error(`Failed to download image: ${imageResp.status}`)
      }
      const buf = Buffer.from(await imageResp.arrayBuffer())
      const contentType = imageResp.headers.get('content-type') || 'image/png'
      const randomId = Math.random().toString(36).substring(2, 10)
      const fileExtension = mime.getExtension(contentType) || 'png'
      const fileName = `family-portrait-${randomId}.${fileExtension}`

      finalImageUrl = await uploadImageToR2(buf, fileName, user.id, contentType)
      responseImageUrl = `/api/image-proxy?key=${encodeURIComponent(finalImageUrl)}`
    } catch (storageError) {
      finalImageUrl = generatedImageUrl
      responseImageUrl = generatedImageUrl
    }

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

    const remaining = (userProfile.credits ?? 0) - 2
    await supabase
      .from('user_profiles')
      .update({ credits: remaining })
      .eq('user_id', user.id)

    return NextResponse.json({ imageUrl: responseImageUrl, familyPortraitId, creditsRemaining: remaining, success: true, creditsDeducted: 2 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
