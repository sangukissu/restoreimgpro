import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { createClient } from '@/utils/supabase/server'
import { VideoGenerationError, logError } from "@/lib/error-handling"

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

        // Check user credits - Video is 15 credits
        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('user_id', user.id)
            .single()

        if (profileError || !userProfile || (userProfile.credits ?? 0) < 15) {
            return NextResponse.json({
                error: 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS',
                requiresPayment: true,
            }, { status: 402 })
        }

        const { sofaImageUrl, hugImageUrl } = await req.json()

        if (!sofaImageUrl || !hugImageUrl) {
            return NextResponse.json({ error: 'Missing image URLs' }, { status: 400 })
        }

        // Create initial database record
        const { data: generation, error: insertError } = await supabase
            .from("nostalgic_hug_generations")
            .insert({
                user_id: user.id,
                sofa_image_url: sofaImageUrl,
                hug_image_url: hugImageUrl,
                status: "uploading",
            })
            .select()
            .single()

        if (insertError) {
            console.error("Failed to create generation record", insertError)
            return NextResponse.json({ error: "Failed to create generation record" }, { status: 500 })
        }

        // Prepare input for Fal AI
        const input = {
            prompt: "Generate a photorealistic video beginning with the first frame (mother alone on sofa, displaying gentle, natural movements like a subtle head turn or soft posture adjustment). The scene should then transition smoothly by introducing the second figure from second frame moving into the frame from the side, approaching the mother. The mother should react authentically, turning and looking towards the user with immediate recognition and warmth. The video culminates as the the person from second image sits beside the mother and the two figures move into the hug position shown in the final second frame.",
            image_url: sofaImageUrl,
            duration: "5",
            negative_prompt: "blur, distort, and low quality",
            cfg_scale: 0.5,
            tail_image_url: hugImageUrl
        }

        try {
            // Submit to Fal queue
            const queueResult = await fal.queue.submit("fal-ai/kling-video/v2.5-turbo/pro/image-to-video", {
                input: input,
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

            // Deduct credits immediately
            await supabase
                .from('user_profiles')
                .update({ credits: (userProfile.credits ?? 0) - 15 })
                .eq('user_id', user.id)

            return NextResponse.json({
                success: true,
                generationId: generation.id,
                requestId: requestId,
                status: "generating",
                creditsRemaining: (userProfile.credits ?? 0) - 15,
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
