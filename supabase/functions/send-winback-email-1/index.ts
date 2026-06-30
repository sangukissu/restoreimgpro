/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// @ts-nocheck - Deno types not available in Node.js project

// Supabase Edge Function: send-winback-email-1
// Sends "Inspiration" email to users 4+ hours after signup who haven't purchased
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
    if (!trimmed) return null
    const first = trimmed.split(/\s+/)[0]
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
// Winback Email 1 — sent 4–24h after signup to non-buyers.
//
// Structure (PAS-lite, single CTA, founder voice):
//   1. Acknowledge without guilt
//   2. Hook: the new Memory Book feature (emotionally unique)
//   3. Specific, concrete offer (Family Plan, not a vague % off)
//   4. Single CTA
//   5. P.S. with founder name (the most-read part of any email)
//
// Personalization: we use the user's first name if we have it. Falling back
// to "there" reads as cold, so we never do that — we just sign as Harvansh.

const EMAIL_SUBJECT = 'One photo you haven’t restored yet'

const getEmailBody = (firstName: string | null): string => {
    const greeting = firstName ? `Hi ${firstName},` : 'Hi,'
    return `${greeting}

I noticed you signed up to BringBack yesterday but haven’t restored a photo yet. I won’t pretend to know why — could be timing, could be you opened the page, looked at the pricing, and closed the tab. Both are fair.

I just wanted you to know about something we launched this week that I’m especially proud of: Memory Books.

It’s a way to take the photos you’ve restored and turn them into a private, paginated keepsake — a real book, with your family’s names and stories woven in. The pages turn. The book gets a private link. The people you love can open it, scroll through, and read the memories you wrote for them.

Most of our users tell us it ends up being the most meaningful thing they’ve ever made online. One customer told me her dad cried. (I’m not making that up.)

If you want to try it, the Family Plan is what unlocks it. Right now I’ve made a small discount code just for people who are still on the fence:

    Code: COMEBACK10
    10% off the Family Plan or the Plus Plan
    Expires in 48 hours

The Family Plan is $21.99 (about the cost of two coffees) and comes with 60 restorations, the Memory Book, every feature we make, and priority support.

Open BringBack and try the first photo. It takes 30 seconds:
${APP_URL}/dashboard

If you try and don’t love the result, reply to this email. I read every one.

P.S. — One photo is all you need to start. You don’t have to know who it’s for yet. That part comes later.

— Harvansh
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

        // Query users who:
        // 1. Signed up 4-24 hours ago
        // 2. Have NOT received win-back email 1 yet
        // 3. Have NO successful payment in the payments table
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        // First, get users who haven't received email 1 and signed up 4-24h ago
        const { data: eligibleUsers, error: usersError } = await supabase
            .from('user_profiles')
            .select('user_id, email, name')
            .is('winback_email_1_sent_at', null)
            .lte('created_at', fourHoursAgo)
            .gte('created_at', twentyFourHoursAgo)

        if (usersError) {
            console.error('Error fetching users:', usersError)
            return new Response(JSON.stringify({ error: usersError.message }), { status: 500 })
        }

        if (!eligibleUsers || eligibleUsers.length === 0) {
            console.log('No eligible users found for win-back email 1')
            return new Response(JSON.stringify({ message: 'No eligible users', sent: 0 }), { status: 200 })
        }

        console.log(`Found ${eligibleUsers.length} potentially eligible users`)

        // Filter out users who have any successful payment
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

            // Only include users with NO successful payments
            if (!payments || payments.length === 0) {
                usersWithoutPayments.push({ ...user, email })
            }
        }

        console.log(`${usersWithoutPayments.length} users have no successful payments`)

        let sentCount = 0
        const sentUserIds: string[] = []
        const errors: string[] = []

        // Send emails
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

                // Mark email as sent
                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ winback_email_1_sent_at: new Date().toISOString() })
                    .eq('user_id', user.user_id)

                if (updateError) {
                    console.error(`Failed to update user ${user.user_id}:`, updateError)
                    errors.push(`${user.email}: update failed ${updateError.message}`)
                    continue
                }

                sentCount++
                sentUserIds.push(user.user_id)
                console.log(`Sent win-back email 1 to ${user.email}`)
                await sleep(250)
            } catch (err) {
                console.error(`Error processing user ${user.email}:`, err)
                errors.push(`${user.email}: ${err}`)
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
