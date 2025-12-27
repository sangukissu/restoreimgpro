# Win-back Email System - Setup Guide

## Overview
This system sends automated founder-style emails to users who sign up but don't purchase.

| Email | Trigger | Purpose |
|-------|---------|---------|
| Email 1 | 4 hours after signup | "Quick tip" inspiration email |
| Email 2 | 7 days after signup | 10% discount code (WELCOME10) |

---

## Files Created

```
scripts/18_winback_email_tracking.sql   # Database migration
lib/resend.ts                            # Email templates (for reference)
supabase/functions/
  ├── send-winback-email-1/index.ts     # 4h email function
  └── send-winback-email-2/index.ts     # 7d email function
```

---

## Setup Steps

### 1. Run Database Migration
Run this SQL in your Supabase SQL Editor:
```sql
-- From scripts/18_winback_email_tracking.sql
ALTER TABLE public.user_profiles 
  ADD COLUMN IF NOT EXISTS winback_email_1_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS winback_email_2_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_user_profiles_winback 
  ON public.user_profiles(winback_email_1_sent_at, winback_email_2_sent_at);

GRANT UPDATE (winback_email_1_sent_at, winback_email_2_sent_at) ON public.user_profiles TO service_role;
```

### 2. Get Resend API Key
1. Go to [resend.com](https://resend.com) and sign up
2. Verify your domain `bringback.pro`
3. Create an API key
4. Copy the key (starts with `re_`)

### 3. Set Supabase Secrets
```bash
# In your terminal
cd /Users/kishanchaudhary/Pictures/restoreimgpro

supabase secrets set RESEND_API_KEY=re_your_api_key_here
supabase secrets set NEXT_PUBLIC_APP_URL=https://bringback.pro
```

### 4. Deploy Edge Functions
```bash
supabase functions deploy send-winback-email-1
supabase functions deploy send-winback-email-2
```

### 5. Configure Cron Schedules
In Supabase Dashboard → Edge Functions → Schedules:

| Function | Schedule | Example |
|----------|----------|---------|
| send-winback-email-1 | Every hour | `0 * * * *` |
| send-winback-email-2 | Daily 10am UTC | `0 10 * * *` |

---

## Testing

### Manual Test Email 1
```bash
# Create a test user first, then:
supabase functions invoke send-winback-email-1 --no-verify-jwt
```

### Manual Test Email 2
```bash
supabase functions invoke send-winback-email-2 --no-verify-jwt
```

---

## How It Works

### Eligibility for Email 1
- User signed up 4-24 hours ago
- `winback_email_1_sent_at` is NULL
- NO entry in `payments` table with `status = 'succeeded'`

### Eligibility for Email 2
- User signed up 7-14 days ago
- `winback_email_1_sent_at` is NOT NULL (received email 1)
- `winback_email_2_sent_at` is NULL
- NO entry in `payments` table with `status = 'succeeded'`

---

## DodoPayments Discount Code
Make sure `WELCOME10` is created in your DodoPayments dashboard as a 10% discount code.
