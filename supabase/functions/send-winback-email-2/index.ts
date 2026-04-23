/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// @ts-nocheck - Deno types not available in Node.js project

// Supabase Edge Function: send-winback-email-2

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'https://bringback.pro'
const WINBACK_FROM = Deno.env.get('WINBACK_FROM') || 'Harvansh <harvansh@updates.bringback.pro>'
const WINBACK_REPLY_TO = Deno.env.get('WINBACK_REPLY_TO') || 'support@bringback.pro'
const WINBACK_CRON_SECRET = Deno.env.get('WINBACK_CRON_SECRET')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

const EMAIL_SUBJECT = 'Is it the price?'
const getEmailBody = `Hi,

It's been a week since you joined BringBack.pro, but I noticed you haven't tried the Pro Plan yet.

I'm trying to understand what holds users back. Is it the pricing? The features?

If you've been on the fence, I created a small discount code to make the decision a little easier for you.

Code: WELCOME10 (10% OFF the Pro and Family Plan)

The Pro Plan unlocks the Reunion Video feature (where you can hug your loved ones) and 20 restorations. I'd love for you to try it.

Upgrade now: ${APP_URL}/dashboard

Best,
Harvansh Chaudhary`

serve(async (req: Request) => {
    try {
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 })
        }

        if (WINBACK_CRON_SECRET && req.headers.get('x-winback-secret') !== WINBACK_CRON_SECRET) {
            return new Response('Unauthorized', { status: 401 })
        }

        console.log('Starting win-back email 2 job...')

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

        const { data: eligibleUsers, error: usersError } = await supabase
            .from('user_profiles')
            .select('user_id, email, name')
            .not('winback_email_1_sent_at', 'is', null)
            .is('winback_email_2_sent_at', null)
            .lte('winback_email_1_sent_at', sevenDaysAgo)

        if (usersError) {
            console.error('Error fetching users:', usersError)
            return new Response(JSON.stringify({ error: usersError.message }), { status: 500 })
        }

        if (!eligibleUsers || eligibleUsers.length === 0) {
            console.log('No eligible users found for win-back email 2')
            return new Response(JSON.stringify({ message: 'No eligible users', sent: 0 }), { status: 200 })
        }

        console.log(`Found ${eligibleUsers.length} potentially eligible users`)

        const usersWithoutPayments: typeof eligibleUsers = []

        for (const user of eligibleUsers) {
            const email = typeof user.email === 'string' ? user.email.trim() : ''
            if (!email) {
                continue
            }

            const { data: payments, error: paymentsError } = await supabase
                .from('payments')
                .select('id')
                .eq('user_id', user.user_id)
                .in('status', ['completed', 'succeeded'])
                .limit(1)

            if (paymentsError) {
                console.error(`Error checking payments for user ${user.user_id}:`, paymentsError)
                continue
            }

            if (!payments || payments.length === 0) {
                usersWithoutPayments.push({ ...user, email })
            }
        }

        console.log(`${usersWithoutPayments.length} users have no successful payments`)

        let sentCount = 0
        const sentUserIds: string[] = []
        const errors: string[] = []

        for (const user of usersWithoutPayments) {
            try {
                const sendResult = await sendEmailWithRetry(user.email, EMAIL_SUBJECT, getEmailBody)

                if (!sendResult.ok) {
                    console.error(`Failed to send email to ${user.email}:`, sendResult.errorText)
                    errors.push(`${user.email}: send failed (${sendResult.status}) ${sendResult.errorText}`)
                    continue
                }

                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ winback_email_2_sent_at: new Date().toISOString() })
                    .eq('user_id', user.user_id)

                if (updateError) {
                    console.error(`Failed to update user ${user.user_id}:`, updateError)
                    errors.push(`${user.email}: update failed ${updateError.message}`)
                    continue
                }

                sentCount++
                sentUserIds.push(user.user_id)
                console.log(`Sent win-back email 2 to ${user.email}`)
                await sleep(250)
            } catch (err) {
                console.error(`Error processing user ${user.email}:`, err)
                errors.push(`${user.email}: ${err}`)
            }
        }

        console.log(`Win-back email 2 job complete. Sent: ${sentCount}, Errors: ${errors.length}`)

        return new Response(
            JSON.stringify({
                message: 'Win-back email 2 job complete',
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
