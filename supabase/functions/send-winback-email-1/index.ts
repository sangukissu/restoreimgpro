/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// @ts-nocheck - Deno types not available in Node.js project

// Supabase Edge Function: send-winback-email-1
// Sends a checkout reminder 2+ hours after a hosted checkout starts without purchase
// Triggered by cron every hour

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const WINBACK_FROM = Deno.env.get('WINBACK_FROM') || 'Harvansh <harvansh@updates.bringback.pro>'
const WINBACK_REPLY_TO = Deno.env.get('WINBACK_REPLY_TO') || 'support@bringback.pro'
const WINBACK_CRON_SECRET = Deno.env.get('WINBACK_CRON_SECRET')
const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://bringback.pro'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function extractFirstName(fullName: string | null | undefined): string | null {
    if (typeof fullName !== 'string') return null
    const trimmed = fullName.trim()
    if (!trimmed || trimmed.includes('@')) return null
    const first = trimmed.split(/\s+/)[0]
    if (first.includes('@')) return null
    // Cap at 24 chars so a runaway name doesn't break email layout
    return first.length > 24 ? first.slice(0, 24) : first
}

async function sendEmailWithRetry(email: string, subject: string, text: string) {
    let lastStatus = 500
    let lastErrorText = 'Unknown email error'

    for (let attempt = 0; attempt < 3; attempt++) {
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: WINBACK_FROM,
                reply_to: WINBACK_REPLY_TO,
                to: email,
                subject,
                text,
            }),
        })

        if (emailResponse.ok) {
            return { ok: true as const }
        }

        lastStatus = emailResponse.status
        lastErrorText = await emailResponse.text()

        if (emailResponse.status !== 429 || attempt === 2) {
            break
        }

        const retryAfterHeader = emailResponse.headers.get('retry-after')
        const retryAfterSeconds = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : NaN
        const waitMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : 1250
        await sleep(waitMs)
    }

    return {
        ok: false as const,
        status: lastStatus,
        errorText: lastErrorText,
    }
}

// Email template
//
// Email 1: two hours after a checkout attempt, while the user has not purchased.
// The hourly cron may add up to one hour of delay.

const EMAIL_SUBJECT = 'Any questions before you decide?'

const getEmailBody = (firstName: string | null): string => {
    const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
    return `${greeting}

You started checkout on BringBack earlier but didn't finish. If something got in the way, just reply to this email — I read the replies myself.

Was it the price, uncertainty about how your photo would turn out, or a payment problem? A short reply would help me improve the experience.

If you decide to try it, credit packs are a one-time purchase with no subscription, and your credits don't expire. Web purchases are covered by our 30-day refund policy: ${APP_URL}/refunds

If price was the hesitation, use code COMEBACK10 for 10% off the Pro or Family pack at checkout. The $4.99 Starter pack isn't included.

You can choose your plan again here:
${APP_URL}/dashboard

Best,
Harvansh
Founder, BringBack`
}

serve(async (req: Request) => {
    try {
        // Only allow POST requests (from cron or manual invocation)
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 })
        }

        if (WINBACK_CRON_SECRET && req.headers.get('x-winback-secret') !== WINBACK_CRON_SECRET) {
            return new Response('Unauthorized', { status: 401 })
        }

        console.log('Starting win-back email 1 job...')

        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        // Use the latest attempt for each user so a retry resets the clock.
        const { data: attempts, error: usersError } = await supabase
            .from('checkout_attempts')
            .select('id, user_id, created_at, completed_at, reminder_sent_at')
            .gte('created_at', oneDayAgo)
            .order('created_at', { ascending: false })

        if (usersError) {
            console.error('Error fetching users:', usersError)
            return new Response(JSON.stringify({ error: usersError.message }), { status: 500 })
        }

        if (!attempts || attempts.length === 0) {
            console.log('No eligible users found for win-back email 1')
            return new Response(JSON.stringify({ message: 'No eligible users', sent: 0 }), { status: 200 })
        }

        const latestByUser = new Map<string, typeof attempts[number]>()
        for (const attempt of attempts) {
            if (!latestByUser.has(attempt.user_id)) latestByUser.set(attempt.user_id, attempt)
        }

        let sentCount = 0
        const sentUserIds: string[] = []
        const errors: string[] = []

        for (const attempt of latestByUser.values()) {
            try {
                if (attempt.completed_at || attempt.reminder_sent_at || attempt.created_at > twoHoursAgo) continue

                const { data: user, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('email, name, winback_email_1_sent_at')
                    .eq('user_id', attempt.user_id)
                    .single()
                if (profileError || !user || user.winback_email_1_sent_at || !user.email?.trim()) continue

                // Recheck payment at send time in case the checkout webhook was delayed.
                const { data: payments, error: paymentsError } = await supabase
                    .from('payments')
                    .select('id')
                    .eq('user_id', attempt.user_id)
                    .in('status', ['completed', 'succeeded'])
                    .limit(1)
                if (paymentsError || (payments && payments.length > 0)) continue

                const sendResult = await sendEmailWithRetry(
                    user.email.trim(),
                    EMAIL_SUBJECT,
                    getEmailBody(extractFirstName(user.name))
                )

                if (!sendResult.ok) {
                    console.error(`Failed to send email to ${user.email}:`, sendResult.errorText)
                    errors.push(`${user.email}: send failed (${sendResult.status}) ${sendResult.errorText}`)
                    continue
                }

                const sentAt = new Date().toISOString()
                const { error: attemptUpdateError } = await supabase
                    .from('checkout_attempts')
                    .update({ reminder_sent_at: sentAt })
                    .eq('id', attempt.id)
                const { error: profileUpdateError } = await supabase
                    .from('user_profiles')
                    .update({ winback_email_1_sent_at: sentAt })
                    .eq('user_id', attempt.user_id)

                if (attemptUpdateError || profileUpdateError) {
                    errors.push(`${user.email}: sent, but tracking update failed`)
                }

                sentCount++
                sentUserIds.push(attempt.user_id)
                console.log(`Sent win-back email 1 to ${user.email}`)
                await sleep(250)
            } catch (err) {
                console.error(`Error processing checkout ${attempt.id}:`, err)
                errors.push(`${attempt.id}: ${err}`)
            }
        }

        console.log(`Win-back email 1 job complete. Sent: ${sentCount}, Errors: ${errors.length}`)

        
        return new Response(
            JSON.stringify({
                message: 'Win-back email 1 job complete',
                sent: sentCount,
                sent_user_ids: sentUserIds.length > 0 ? sentUserIds : undefined,
                errors: errors.length > 0 ? errors : undefined,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
    }
})
