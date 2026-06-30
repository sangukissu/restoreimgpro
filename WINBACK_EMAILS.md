# Winback Email System

Two-email sequence for signups who haven't purchased within 24h. Both are
delivered from Harvansh's personal address via Resend. The first email is
strong, founder-voiced, and leads with the Memory Book hook. The second is
emotionally heavier, loss-averse, and offers a bigger discount.

## Email 1 — `send-winback-email-1`

- **When**: 4–24 hours after signup
- **Who**: User has no `payments` row of any status
- **Subject**: `One photo you haven't restored yet`
- **Offer**: `COMEBACK10` — 10% off Plus or Family Plan
- **Expiry**: 48 hours
- **Hook**: Memory Book launch (the emotionally unique differentiator)
- **Voice**: Founder, personal, "I read every email"

## Email 2 — `send-winback-email-2`

- **When**: 7 days after Email 1 was sent
- **Who**: User received Email 1, has not bought Plus or Family
  (Starter buyers are excluded — they already converted at the entry tier)
- **Subject**: `Your photos are still waiting`
- **Offer**: `KEEPTHEIR15` — 15% off Plus or Family Plan
- **Expiry**: 72 hours
- **Hook**: Future-regret + Memory Book
- **Voice**: Founder, loss-averse, "I'm not going to email you again"
- **This is the last touchpoint.** After this, we don't email non-buyers.

## Why this is structured this way

| Decision | Why |
|---|---|
| Founder voice (not brand) | Personal emails convert 2-3x better than company emails |
| Lead with the new feature | Memory Book is the unique value — without it, we're just another restoration app |
| Specific, concrete numbers | "$18.69" beats "15% off" because the brain anchors on absolute price |
| Time-box the discount (48h, 72h) | Open-ended discounts feel like marketing. Bounded ones feel real. |
| Skip email 2 for Starter buyers | They've converted. Pushing them again irritates without lifting LTV much. |
| "I'm not emailing again" | Removes the implicit threat of an infinite drip. Makes THIS email feel like the moment. |
| P.S. with Memory Book | The P.S. is the most-read part. Repeat the killer hook there. |

## Files

- `supabase/functions/send-winback-email-1/index.ts`
- `supabase/functions/send-winback-email-2/index.ts`
- This file (`WINBACK_EMAILS.md`) — internal reference only
