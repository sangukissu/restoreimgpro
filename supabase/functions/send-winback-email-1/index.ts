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
const WINBACK_FROM = Deno.env.get('WINBACK_FROM') || 'updates.bringback.pro'
const WINBACK_REPLY_TO = Deno.env.get('WINBACK_REPLY_TO') || 'support@bringback.pro'
const WINBACK_CRON_SECRET = Deno.env.get('WINBACK_CRON_SECRET')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Email template
const EMAIL_SUBJECT = 'Quick tip for your first restoration'
const getEmailBody = `Hi,

Saw you joined BringBack.pro—welcome!

A lot of users get stuck thinking they need a high-res scan to get good results. I wanted to let you know that a simple phone snap works perfectly.

Our AI actually fixes the lighting and sharpens the blur automatically.

Give it a try with a photo you have lying around. If you don't love the result, reply to this email and let me know.

Cheers,
Harvansh
Founder, BringBack.pro`

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
                // Send email via Resend
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: WINBACK_FROM,
                        reply_to: WINBACK_REPLY_TO,
                        to: user.email,
                        subject: EMAIL_SUBJECT,
                        text: getEmailBody,
                    }),
                })

                if (!emailResponse.ok) {
                    const errorText = await emailResponse.text()
                    console.error(`Failed to send email to ${user.email}:`, errorText)
                    errors.push(`${user.email}: send failed (${emailResponse.status}) ${errorText}`)
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
