-- A failed payment can occur before a successful payment row exists.
alter table public.checkout_attempts
  add column if not exists failed_at timestamptz;
