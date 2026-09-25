# Winback Email System
 
Two-email sequence for signups who haven't purchased within 24h. Both are
delivered from Harvansh's personal address via Resend. Both emails speak naturally
to both use cases (restoring old photos and creating combined family portraits),
address the price/subscription barrier directly, and remove fake melodrama.

## Email 1 — `send-winback-email-1`

- **When**: 4–24 hours after signup
- **Who**: User has no `payments` row of any status
- **Subject**: `quick question about BringBack`
- **Offer**: `COMEBACK10` — 10% off
- **Hook**: Casual check-in, covers restoration + family photo creator, defuses subscription trap & offers satisfaction guarantee
- **Voice**: Founder, helpful, transparent

## Email 2 — `send-winback-email-2`

- **When**: 2 days (48 hours) after Email 1 was sent
- **Who**: User received Email 1, has not bought Plus or Family
  (Starter buyers are excluded — they already converted at the entry tier)
- **Subject**: `one last check-in`
- **Offer**: `WELCOME15` — 15% off any plan ($8.49 Plus Plan)
- **Hook**: Respectful final check-in, brings family members together / restores memories, leaves best discount
- **Voice**: Founder, respectful, "I won't email you again"
- **This is the last touchpoint.** After this, we don't email non-buyers.

## Why this is structured this way

| Decision | Why |
|---|---|
| Natural Founder voice | Personal emails without fake marketing copy convert significantly better |
| Restoration + Family Photo Creator | Analytics show users come for both restoring old photos and combining family portraits |
| Defuse subscription anxiety | Clarifies that purchases are one-time payments with no sneaky recurring billing |
| Money-back guarantee | Reverses risk on facial detail realism / quality |
| Clean, non-creepy follow-up | Avoids melodrama, fake urgency countdowns, or claims about stalking user clicks |
| Safe name fallback | Ensures emails never greet users with raw email addresses (`Hi there,` instead of `Hi user@email.com`) |

## Files

- `supabase/functions/send-winback-email-1/index.ts`
- `supabase/functions/send-winback-email-2/index.ts`
- This file (`WINBACK_EMAILS.md`) — internal reference only

