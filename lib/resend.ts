import { Resend } from 'resend'

// Initialize Resend client
// API key should be set as RESEND_API_KEY environment variable
export const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender for win-back emails
export const WINBACK_SENDER = 'Harvansh <support@bringback.pro>'

// Email 1: Inspiration email (4 hours after signup)
export const winbackEmail1 = {
    subject: 'Quick tip for your first restoration',
    getBody: `Hey,

Saw you joined BringBack.pro—welcome!

A lot of users get stuck thinking they need a high-res scan to get good results. I wanted to let you know that a simple phone snap works perfectly.

Our AI actually fixes the lighting and sharpens the blur automatically.

Give it a try with a photo you have lying around. If you don't love the result, reply to this email and let me know.

Cheers,
Harvansh
Founder, BringBack.pro`,
}

// Email 2: Discount email (7 days after signup)
export const winbackEmail2 = {
    subject: 'Is it the price?',
    getBody: `Hi,

It's been a week since you joined BringBack.pro, but I noticed you haven't tried the Pro Plan yet.

I'm trying to understand what holds users back. Is it the pricing? The features?

If you've been on the fence, I created a small discount code to make the decision a little easier for you.

Code: WELCOME10 (10% OFF the Pro Plan)

The Pro Plan unlocks the Reunion Video feature (where you can hug your loved ones) and 20 restorations. I'd love for you to try it.

Upgrade now: ${process.env.NEXT_PUBLIC_APP_URL || 'https://bringback.pro'}/dashboard

Best,
Harvansh Chaudhary`,
}
