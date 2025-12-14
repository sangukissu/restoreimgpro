import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import mime from 'mime'
import { createClient } from '@/utils/supabase/server'

// Configure Fal AI client
fal.config({
    credentials: process.env.FAL_KEY,
})

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        // Check user credits
        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', user.id)
            .single()

        if (profileError || !userProfile || (userProfile.credits ?? 0) <= 0) {
            return NextResponse.json({
                error: 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS',
                requiresPayment: true,
            }, { status: 402 })
        }

        const formData = await req.formData()
        const image = formData.get('image') as File

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Upload to Fal storage
        const arrayBuf = await image.arrayBuffer()
        const contentType = image.type || 'image/png'
        const blob = new Blob([arrayBuf], { type: contentType })
        const uploadedUrl = await fal.storage.upload(blob)

        // Call Fal model
        const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
            input: {
                prompt: "Make the person sitting left, alone on a large, deep-set, realistic-looking, vintage-style sofa (e.g., deep brown, 90s floral pattern, or heavy brocade upholstery), dark maroon wooden wall background, with enough empty space beside them to comfortably accommodate a second person.\n  Understand the physics of body proportion in relation to the visible body part from the reference image; ensure the generated body has the relative height and size based on the reference face photo size, must not look like cartoon body.\n  Ultra realistic but natural look with real camera imperfections slight film grain minor chromatic aberration tiny lens dust soft depth of field light vignette and imperfect highlights.\n  important: Keep the face identity and clothing from the reference image exactly consistent. have proper lighting on faces so that they are clearly visible, no harsh shadows please.",
                num_images: 1,
                aspect_ratio: "4:3",
                output_format: "png",
                image_urls: [uploadedUrl],
                resolution: "1K"
            },
            logs: true,
            onQueueUpdate: (update) => {
                // console.log(update)
            },
        })

        const falOutput: any = result.data
        if (!falOutput || !falOutput.images || !falOutput.images[0]?.url) {
            throw new Error('No image returned from generation service')
        }

        const generatedImageUrl = falOutput.images[0].url

        // Store in Supabase
        let finalImageUrl = generatedImageUrl
        try {
            const imageResp = await fetch(generatedImageUrl)
            if (imageResp.ok) {
                const buf = await imageResp.arrayBuffer()
                const contentType = imageResp.headers.get('content-type') || 'image/png'
                const imageBlob = new Blob([buf], { type: contentType })
                const timestamp = Date.now()
                const randomId = Math.random().toString(36).substring(2, 10)
                const fileExtension = (mime.getExtension(contentType) || 'png')
                const fileName = `${user.id}/${timestamp}_nostalgic_sofa_${randomId}.${fileExtension}`

                const { error: uploadError } = await supabase.storage
                    .from('restored_photos')
                    .upload(fileName, imageBlob, { contentType, cacheControl: '3600' })

                if (!uploadError) {
                    const { data: publicUrlData } = await supabase.storage
                        .from('restored_photos')
                        .getPublicUrl(fileName)
                    finalImageUrl = publicUrlData.publicUrl
                }
            }
        } catch (e) {
            console.error('Failed to store image in Supabase, using Fal URL', e)
        }

        // Deduct credits
        await supabase
            .from('user_profiles')
            .update({ credits: (userProfile.credits ?? 0) - 2 })
            .eq('user_id', user.id)

        return NextResponse.json({
            success: true,
            imageUrl: finalImageUrl,
            creditsRemaining: (userProfile.credits ?? 0) - 2
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
    }
}
