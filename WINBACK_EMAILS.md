# Checkout recovery

The checkout session API saves a `checkout_attempts` row after Dodo creates a hosted
checkout. The `payment.succeeded` webhook marks the matching attempt complete via
`checkout_attempt_id` in Dodo metadata. These server-side rows are the source of
truth for the funnel; browser analytics can be blocked by consent or navigation.

## Reminder sequence

- **Email 1:** The hourly job sends about 2–3 hours after the user's latest
  checkout start, if no successful payment exists. It asks what got in the way
  and offers `COMEBACK10` for 10% off Pro or Family. It runs only for attempts
  less than 24 hours old.
- **Email 2:** 48 hours after Email 1, if the user still has no successful
  payment. It offers `WELCOME15` for 15% off Pro or Family. Neither coupon
  applies to the $4.99 Starter pack.
- The existing `winback_email_1_sent_at` and `winback_email_2_sent_at` profile
  fields keep each message to one per user. Signups who never start checkout no
  longer receive Email 1.

Reminder links pass the saved plan through sign-in and reopen the plan picker
with that pack selected. The hosted checkout receives the signed-in email and
explicitly allows discount-code entry; the codes remain restricted to Pro and
Family in Dodo.

The Dodo cancel/back link returns to the dashboard with a short, optional reason
question. Closing the hosted browser tab cannot display this question; the email
reply invitation also gathers feedback. `checkout_attempts.exit_reason` is
self-reported by respondents, not a census of all abandoners. A
`payment.failed` webhook records `failed_at` on its checkout attempt even when
no payment row exists yet. A later successful payment still counts as completed.

The old timed dashboard discount popup has been removed. The Trustpilot review
prompt for purchasers remains.

## Rollout

1. Apply `supabase/migrations/20260930_checkout_recovery.sql` if it is not
   already installed, then `supabase/migrations/20261001_checkout_failure_tracking.sql`.
2. Deploy the web app and `send-winback-email-1` and `send-winback-email-2` Edge
   Functions. The existing hourly and daily cron schedules remain in place.
3. Confirm the functions' cron authorization matches the deployed
   `WINBACK_CRON_SECRET` setting, and that Dodo sends both `payment.succeeded`
   and `payment.failed` events to the web app's webhook URL.
4. Test a sandbox checkout for each pack: confirm the signed-in email is
   prefilled; the code field is available; `COMEBACK10` and `WELCOME15` apply
   to Pro and Family but not Starter; and a reminder link selects the pack
   originally attempted, including after sign-in.
5. Return via Dodo's back link and submit one feedback response. Verify a
   failed sandbox payment sets `failed_at`, and a successful payment sets
   `completed_at`.

## Simple 14-day report

Run in the Supabase SQL editor. Count completed checkouts only after allowing
time for Dodo webhooks to arrive.

```sql
select date_trunc('day', created_at)::date as day,
       count(*) as checkout_starts,
       count(distinct user_id) as people,
       count(*) filter (where completed_at is not null) as completed,
       count(*) filter (where completed_at is null and failed_at is not null) as failed_unpaid,
       count(*) filter (where completed_at is null and failed_at is null) as no_failure_recorded,
       count(*) filter (where reminder_sent_at is not null) as reminded
from public.checkout_attempts
where created_at >= now() - interval '14 days'
  and created_at < now() - interval '1 day'
group by 1
order by 1 desc;
```

`no_failure_recorded` includes checkouts that were closed, left open, or
otherwise unfinished without a failure webhook. It does not prove why someone
left. Use Dodo's payment details to inspect actual failure causes.

```sql
select coalesce(p.name, a.plan_id) as plan,
       count(*) as checkout_starts,
       count(*) filter (where a.completed_at is not null) as completed,
       count(*) filter (where a.completed_at is null and a.failed_at is not null) as failed_unpaid
from public.checkout_attempts a
left join public.payment_plans p on p.id = a.plan_id
where a.created_at >= now() - interval '14 days'
  and a.created_at < now() - interval '1 day'
group by 1
order by checkout_starts desc;
```

```sql
select exit_reason, count(*) as responses
from public.checkout_attempts
where feedback_at >= now() - interval '14 days'
group by exit_reason
order by responses desc;
```
