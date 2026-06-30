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

function extractFirstName(fullName: string | null | undefined): string | null {
    if (typeof fullName !== 'string') return null
    const trimmed = fullName.trim()
    if (!trimmed) return null
    const first = trimmed.split(/\s+/)[0]
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

// Winback Email 2 — sent 7 days after Email 1 to users who have NOT bought
// the Plus or Family plan. (Starter buyers are excluded — they already
// converted at the entry tier and we don't keep pushing them.)
//
// Structure (loss-aversion + hypnotic future-regret + bigger offer):
//   1. Time acknowledgement (it's been a week)
//   2. Hypnotic line: "your photos are still where you left them"
//   3. Future-regret: who will see them in 5 years if you do nothing?
//   4. The Memory Book hook (your restored photos, made into a book)
//   5. Specific offer: 15% off Plus or Family, expires in 72 hours
//   6. Single CTA
//   7. P.S. with founder name + reply-promise
//
// This is the last touchpoint. After this, we don't email non-buyers again.

const EMAIL_SUBJECT = 'Your photos are still waiting'

const getEmailBody = (firstName: string | null): string => {
    const greeting = firstName ? `Hi ${firstName},` : 'Hi,'
    return `${greeting}

It’s been a week since you signed up for BringBack, and I’ve been thinking about you a little more than I should admit.

I don’t usually write a second email. But I checked, and the photo you opened when you signed up — the one that brought you to us in the first place — is still exactly where you left it. On your phone. In a camera roll. In a drawer somewhere. Maybe in an envelope in a closet.

Here’s the thing I keep thinking about, and I’ll say it straight: in five years, that photo is going to be in the same place. The faces in it will be a little older. The people around you will start forgetting small details — the year, the occasion, the name of the person standing next to your grandmother.

You came to BringBack for a reason. Whatever that reason was, it didn’t go away because a week passed. If anything, it got a little heavier.

So I made you a code. A real one — bigger than the one I sent last time.

    Code: WELCOME15
    15% off the Plus Plan or the Family Plan
    Expires in 72 hours

The Family Plan is what unlocks the Memory Book — the thing I keep hearing about from customers who tell me it changed how their family talks about the past. 60 restorations. Every feature. Priority support. ${APP_URL}/dashboard

The Plus Plan is $8.49 with the code applied. The Family Plan is $18.69. Both unlock what brought you here in the first place.

I’m not going to email you again about this. This is it. If the photo matters, this is the moment. If it doesn’t, no hard feelings — I hope the email wasn’t a bother.

If you try and something feels off, reply to this email. I read every one personally. Not a support team. Me.

P.S. — The Memory Book feature is the part I’m proudest of. If you only try one thing this year, make it that.

— Harvansh
Founder, BringBack`
}

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

            // Exclude users who have already bought the Plus or Family plan.
            // We want to nudge non-buyers and Starter-only buyers toward a
            // bigger plan — not keep emailing people who already converted.
            const { data: qualifyingPayments, error: paymentsError } = await supabase
                .from('payments')
                .select('id, payment_plan_id')
                .eq('user_id', user.user_id)
                .in('status', ['completed', 'succeeded'])
                .in('payment_plan_id', ['plus-plan', 'family-plan'])
                .limit(1)

            if (paymentsError) {
                console.error(`Error checking payments for user ${user.user_id}:`, paymentsError)
                continue
            }

            // Skip users who have Plus or Family. Send to everyone else.
            if (!qualifyingPayments || qualifyingPayments.length === 0) {
                usersWithoutPayments.push({ ...user, email })
            }
        }

        console.log(`${usersWithoutPayments.length} users have no successful payments`)

        let sentCount = 0
        const sentUserIds: string[] = []
        const errors: string[] = []

        for (const user of usersWithoutPayments) {
            try {
                const sendResult = await sendEmailWithRetry(
                    user.email,
                    EMAIL_SUBJECT,
                    getEmailBody(extractFirstName(user.name))
                )

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
