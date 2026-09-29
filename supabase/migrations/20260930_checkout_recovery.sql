-- One row per hosted checkout. Only server code and Edge Functions can write it.
create table if not exists public.checkout_attempts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null unique,
  plan_id text not null,
  price_cents integer not null,
  country_code text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  reminder_sent_at timestamptz,
  exit_reason text check (exit_reason in (
    'too_expensive', 'unsure_results', 'trust', 'payment_issue',
    'payment_method', 'not_ready', 'other'
  )),
  exit_note text check (char_length(exit_note) <= 500),
  feedback_at timestamptz
);

create index if not exists checkout_attempts_user_created_idx
  on public.checkout_attempts (user_id, created_at desc);
create index if not exists checkout_attempts_reminder_idx
  on public.checkout_attempts (created_at desc)
  where completed_at is null and reminder_sent_at is null;

alter table public.checkout_attempts enable row level security;
grant all on public.checkout_attempts to service_role;
