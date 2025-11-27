import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import mime from 'mime'
import { createClient } from '@/utils/supabase/server'

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
        const sofaImageUrl = formData.get('sofaImageUrl') as string

        if (!image || !sofaImageUrl) {
            return NextResponse.json({ error: 'Missing image or sofaImageUrl' }, { status: 400 })
        }

        // Upload second person image to Fal storage
        const arrayBuf = await image.arrayBuffer()
        const contentType = image.type || 'image/png'
        const blob = new Blob([arrayBuf], { type: contentType })
        const uploadedUrl = await fal.storage.upload(blob)

        // Call Fal model
        const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
            input: {
                prompt: "A heartfelt, warm embrace between both person from reference photos, seated together on that sofa .\n  Both individuals are locked in a genuine, gentle, and loving hugging pose, exactly mathcing the facial identity and clothing they are wearing in reference photos. Their faces are clearly visible towards camera conveying authentic, deep familial affection. They are naturally positioned on the sofa, with their bodies angled towards each other in a believable embrace. Ensure there is no distortion, unnatural melding of bodies, or uncanny valley effect in their interaction.",
                num_images: 1,
                aspect_ratio: "4:3",
                output_format: "png",
                image_urls: [sofaImageUrl, uploadedUrl],
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
                const fileName = `${user.id}/${timestamp}_nostalgic_hug_${randomId}.${fileExtension}`

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
        return NextResponse.json({ error: 'Failed to generate hug image' }, { status: 500 })
    }
}
