import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { createClient } from '@/utils/supabase/server'
import { uploadImageToR2 } from '@/lib/r2'

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

        // Check user credits - Full flow is 19 credits
        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', user.id)
            .single()

        if (profileError || !userProfile || (userProfile.credits ?? 0) < 19) {
            return NextResponse.json({
                error: 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS',
                requiresPayment: true,
            }, { status: 402 })
        }

        const formData = await req.formData()
        const image1 = formData.get('image1') as File
        const image2 = formData.get('image2') as File

        if (!image1 || !image2) {
            return NextResponse.json({ error: 'Missing images' }, { status: 400 })
        }

        // Upload both images to Fal storage
        const uploadToFal = async (file: File) => {
            const arrayBuf = await file.arrayBuffer()
            const contentType = file.type || 'image/png'
            const blob = new Blob([arrayBuf], { type: contentType })
            return await fal.storage.upload(blob)
        }

        const [firstUrl, secondUrl] = await Promise.all([
            uploadToFal(image1),
            uploadToFal(image2)
        ])
        const [firstBuffer, secondBuffer] = await Promise.all([
            image1.arrayBuffer(),
            image2.arrayBuffer(),
        ])
        const [preservedFirstKey, preservedSecondKey] = await Promise.all([
            uploadImageToR2(Buffer.from(firstBuffer), `nostalgic-hug-source-a-${Date.now()}.jpg`, user.id, image1.type || 'image/jpeg'),
            uploadImageToR2(Buffer.from(secondBuffer), `nostalgic-hug-source-b-${Date.now()}.jpg`, user.id, image2.type || 'image/jpeg'),
        ])

        // Create initial database record (reusing existing columns to avoid migration)
        const { data: generation, error: insertError } = await supabase
            .from("nostalgic_hug_generations")
            .insert({
                user_id: user.id,
                sofa_image_url: preservedFirstKey,
                hug_image_url: preservedSecondKey,
                status: "uploading",
            })
            .select()
            .single()

        if (insertError) {
            console.error("Failed to create generation record", insertError)
            return NextResponse.json({ error: "Failed to create generation record" }, { status: 500 })
        }

        try {
            // Submit to Fal workflow queue
            const queueResult = await fal.queue.submit("workflows/KissuChaudhary/nostalgic-hug", {
                input: {
                    first_user_image_url: firstUrl,
                    second_user_image_url: secondUrl
                },
                webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/nostalgic-hug/webhook?generationId=${generation.id}`
            })

            const requestId = queueResult.request_id

            // Update database with generating status and FAL request ID
            await supabase
                .from("nostalgic_hug_generations")
                .update({
                    fal_request_id: requestId,
                    status: "generating"
                })
                .eq("id", generation.id)

            // Deduct full flow credits immediately (19)
            await supabase
                .from('user_profiles')
                .update({ credits: (userProfile.credits ?? 0) - 19 })
                .eq('user_id', user.id)

            return NextResponse.json({
                success: true,
                generationId: generation.id,
                requestId: requestId,
                status: "generating",
                creditsRemaining: (userProfile.credits ?? 0) - 19,
                message: "Video generation started. Check My Media for progress."
            })

        } catch (falError) {
            // Update database with error status
            await supabase
                .from("nostalgic_hug_generations")
                .update({
                    status: "failed",
                })
                .eq("id", generation.id)

            console.error("Fal API Error", falError)
            return NextResponse.json({ error: 'Failed to start video generation' }, { status: 500 })
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 })
    }
}
