import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, Part } from '@google/genai'
import mime from 'mime'
import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'
import { normalizeToPng, watermarkBringBack } from '@/lib/watermark'

// Initialize Google AI client
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Convert image URL to Generative Part
async function urlToGenerativePart(url: string): Promise<Part> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  const buffer = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') || mime.getType(url)

  if (!contentType) {
    throw new Error('Could not determine content type of the image.')
  }

  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType: contentType,
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { imageUrl, prompt, originalUrl } = await req.json()

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing imageUrl' }, { status: 400 })
    }
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing prompt' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const { data: paid } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .limit(1)

    const hasPaid = !!(paid && paid.length > 0)

    // One-free-second-pass-gating using webhook_events; key off the initial restored URL when available
    const eventKey: string = typeof originalUrl === 'string' && originalUrl.length > 0 ? originalUrl : imageUrl
    const eventId = crypto.createHash('sha256').update(`${user.id}|${eventKey}`).digest('hex')
    const { data: existingEvents, error: checkError } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .eq('event_type', 'second_pass_used')
      .limit(1)

    if (checkError) {
      // Fail closed to avoid abuse
      return NextResponse.json({ error: 'Second-pass status check failed' }, { status: 500 })
    }
    if (existingEvents && existingEvents.length > 0) {
      return NextResponse.json({ error: 'Free second pass already used for this image' }, { status: 429 })
    }

    // Prepare content with prompt and last restored image
    const imagePart = await urlToGenerativePart(imageUrl)

    const contents = [
      {
        role: 'user',
        parts: [
          { text: prompt },
          imagePart,
        ],
      },
    ]

    // Request image editing using gemini-2.5-flash-image
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    })

    // Try to extract an inline image from the response
    const candidate = result.candidates?.[0]
    const parts = candidate?.content?.parts || []

    const inlineImagePart = parts.find((p: any) => p.inlineData)

    if (!inlineImagePart || !inlineImagePart.inlineData) {
      const text = (result as any).text || candidate?.content?.parts?.find((p: any) => p?.text)?.text
      return NextResponse.json({ error: text || 'No image returned from model' }, { status: 502 })
    }

    const { inlineData } = inlineImagePart
    const mimeType: string = inlineData.mimeType || 'image/png'
    const base64Data: string = inlineData.data ?? ''

    if (!base64Data) {
      return NextResponse.json({ error: 'Empty image data from model' }, { status: 502 })
    }

    const buffer = Buffer.from(base64Data, 'base64')
    const cleanPng = await normalizeToPng(buffer)
    const isLocked = !hasPaid
    const previewPng = isLocked ? await watermarkBringBack(cleanPng, 'BringBack.ai') : cleanPng

    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 10)
    const baseKey = `${user.id}/${timestamp}_rerestore_${randomId}`
    const cleanPath = `${baseKey}_clean.png`
    const previewPath = isLocked ? `${baseKey}_preview.png` : cleanPath

    const { error: cleanUploadError } = await supabase.storage
      .from('restored_photos')
      .upload(cleanPath, new Blob([new Uint8Array(cleanPng)], { type: 'image/png' }), { contentType: 'image/png', cacheControl: '3600' })

    if (cleanUploadError) {
      return NextResponse.json({ error: 'Failed to store restored image' }, { status: 500 })
    }

    if (previewPath !== cleanPath) {
      const { error: previewUploadError } = await supabase.storage
        .from('restored_photos')
        .upload(previewPath, new Blob([new Uint8Array(previewPng)], { type: 'image/png' }), { contentType: 'image/png', cacheControl: '3600' })

      if (previewUploadError) {
        return NextResponse.json({ error: 'Failed to store preview image' }, { status: 500 })
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from('image_restorations')
      .insert({
        user_id: user.id,
        preview_image_path: previewPath,
        clean_image_path: cleanPath,
        is_unlocked: !isLocked,
        was_trial: isLocked,
        status: 'completed',
      })
      .select('id')
      .single()

    if (insertError || !inserted) {
      return NextResponse.json({ error: 'Failed to save restoration record' }, { status: 500 })
    }

    const previewUrl = `/api/restorations/${inserted.id}/preview`
    const downloadUrl = `/api/restorations/${inserted.id}/download`

    // Mark second-pass usage to prevent future free passes for same image
    await supabase.from('webhook_events').insert({
      event_id: eventId,
      event_type: 'second_pass_used',
      processed: true,
    })

    // Minimal usage logging: one row per actual second-pass
    await supabase.from('second_pass_usage').insert({
      user_id: user.id,
      image_key: eventKey,
      restored_image_url: previewUrl,
      used_at: new Date().toISOString(),
    })

    return NextResponse.json({
      restoredImageUrl: previewUrl,
      restorationId: inserted.id,
      previewUrl,
      downloadUrl,
      isLocked,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
