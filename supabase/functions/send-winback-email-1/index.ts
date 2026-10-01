/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// @ts-nocheck - Deno types not available in Node.js project

// Supabase Edge Function: send-winback-email-1
// Sends a checkout reminder after 2 hours, or a signup follow-up after 4 hours
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
// Email 1: two hours after checkout, or four hours after signup without checkout.
// The hourly cron may add up to one hour of delay.

const EMAIL_SUBJECT = 'Any questions before you decide?'

function getCheckoutUrl(planId: string): string {
    const loginUrl = new URL('/login', APP_URL)
    const dashboardUrl = new URL('/dashboard', APP_URL)
    dashboardUrl.searchParams.set('buyPlan', planId)
    loginUrl.searchParams.set('next', dashboardUrl.pathname + dashboardUrl.search)
    return loginUrl.toString()
}

const getEmailBody = (firstName: string | null, planId: string | null): string => {
    const greeting = firstName ? `Hi ${firstName},` : 'Hi there,'
    const context = planId
        ? "You started checkout on BringBack earlier but didn't finish. If something got in the way, just reply to this email — I read the replies myself."
        : "You signed up for BringBack but haven't made a purchase yet. If something is holding you back, just reply to this email — I read the replies myself."
    const question = planId
        ? 'Was it the price, uncertainty about how your photo would turn out, or a payment problem? A short reply would help me improve the experience.'
        : 'Was it the price or uncertainty about how your photo would turn out? A short reply would help me improve the experience.'
    const action = planId
        ? `Continue with the pack you chose:
${getCheckoutUrl(planId)}`
        : `Take another look when you're ready:
${new URL('/login?next=%2Fdashboard', APP_URL).toString()}`
    return `${greeting}

${context}

${question}

If you decide to try it, credit packs are a one-time purchase with no subscription, and your credits don't expire. Web purchases are covered by our 30-day refund policy: ${APP_URL}/refunds

If price was the hesitation, use code COMEBACK10 for 10% off the Pro or Family pack at checkout. The $4.99 Starter pack isn't included.

${action}

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
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        // Keep a short catch-up window for signups affected by a temporary mail outage.
        const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()

        const { data: attempts, error: attemptsError } = await supabase
            .from('checkout_attempts')
            .select('id, user_id, plan_id, created_at, completed_at, reminder_sent_at')
            .gte('created_at', threeDaysAgo)
            .order('created_at', { ascending: false })
            .limit(1000)
        if (attemptsError) {
            console.error('Error fetching checkout attempts:', attemptsError)
            return new Response(JSON.stringify({ error: attemptsError.message }), { status: 500 })
        }

        const latestByUser = new Map<string, typeof attempts[number]>()
        for (const attempt of attempts || []) {
            if (!latestByUser.has(attempt.user_id)) latestByUser.set(attempt.user_id, attempt)
        }

        const { data: signupProfiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('user_id, email, name, winback_email_1_sent_at')
            .is('winback_email_1_sent_at', null)
            .gte('created_at', threeDaysAgo)
            .lte('created_at', fourHoursAgo)
            .order('created_at', { ascending: true })
            .limit(1000)
        if (profilesError) {
            console.error('Error fetching signup profiles:', profilesError)
            return new Response(JSON.stringify({ error: profilesError.message }), { status: 500 })
        }

        let sentCount = 0
        const errors: string[] = []

        async function sendReminder(userId: string, email: string, name: string | null, planId: string | null, attemptId: string | null) {
            const { data: payments, error: paymentsError } = await supabase
                .from('payments')
                .select('id')
                .eq('user_id', userId)
                .in('status', ['completed', 'succeeded'])
                .limit(1)
            if (paymentsError) {
                errors.push(`${userId}: payment check failed`)
                return
            }
            if (payments?.length) return

            const sendResult = await sendEmailWithRetry(
                email, EMAIL_SUBJECT, getEmailBody(extractFirstName(name), planId)
            )
            if (!sendResult.ok) {
                console.error(`Win-back email 1 failed for ${userId}:`, sendResult.errorText)
                errors.push(`${userId}: send failed (${sendResult.status}) ${sendResult.errorText}`)
                return
            }

            const sentAt = new Date().toISOString()
            const { error: profileUpdateError } = await supabase
                .from('user_profiles')
                .update({ winback_email_1_sent_at: sentAt })
                .eq('user_id', userId)
            if (profileUpdateError) {
                errors.push(`${userId}: sent, but profile tracking failed`)
            }
            if (attemptId) {
                const { error: attemptUpdateError } = await supabase
                    .from('checkout_attempts')
                    .update({ reminder_sent_at: sentAt })
                    .eq('id', attemptId)
                if (attemptUpdateError) errors.push(`${userId}: sent, but checkout tracking failed`)
            }
            sentCount++
            await sleep(250)
        }

        // An attempted checkout takes precedence over the generic signup message.
        for (const attempt of latestByUser.values()) {
            if (attempt.completed_at || attempt.reminder_sent_at || attempt.created_at > twoHoursAgo) continue
            try {
                const { data: user, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('email, name, winback_email_1_sent_at')
                    .eq('user_id', attempt.user_id)
                    .maybeSingle()
                if (profileError) {
                    errors.push(`${attempt.user_id}: profile lookup failed`)
                    continue
                }
                if (!user || user.winback_email_1_sent_at || !user.email?.trim()) continue
                await sendReminder(attempt.user_id, user.email.trim(), user.name, attempt.plan_id, attempt.id)
            } catch (error) {
                errors.push(`${attempt.user_id}: ${String(error)}`)
            }
        }

        // Signups who never reached checkout still receive the original follow-up.
        for (const user of signupProfiles || []) {
            if (latestByUser.has(user.user_id) || !user.email?.trim()) continue
            try {
                await sendReminder(user.user_id, user.email.trim(), user.name, null, null)
            } catch (error) {
                errors.push(`${user.user_id}: ${String(error)}`)
            }
        }

        console.log(`Win-back email 1 job complete. Sent: ${sentCount}, Errors: ${errors.length}`)
        return new Response(
            JSON.stringify({ message: 'Win-back email 1 job complete', sent: sentCount, errors: errors.length ? errors : undefined }),
            { status: errors.length && !sentCount ? 502 : 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
    }
})
