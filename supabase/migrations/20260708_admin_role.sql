-- Add admin role to user_profiles so a single dashboard user (the project owner)
-- can be granted admin access. Other users stay is_admin = false.
--
-- To bootstrap the first admin, run this query once (replace with your email):
--   update public.user_profiles set is_admin = true where email = 'you@example.com';

alter table public.user_profiles
  add column if not exists is_admin boolean not null default false;

-- Admins can read every user_profiles row (the regular SELECT policy on the
-- table is auth.uid() = user_id, which would block the admin from listing
-- other users via the anon client). Service-role bypasses RLS anyway, but
-- this keeps the policy self-consistent if a future endpoint uses the anon
-- client for some admin operation.
drop policy if exists "Admins can read all profiles" on public.user_profiles;
create policy "Admins can read all profiles"
  on public.user_profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.user_profiles me
      where me.user_id = auth.uid()
        and me.is_admin = true
    )
  );

-- Allow admins to update any profile's credits via the anon client. The
-- service-role client bypasses RLS, so this policy is only relevant if a
-- future flow switches to the anon client.
drop policy if exists "Admins can update any profile" on public.user_profiles;
create policy "Admins can update any profile"
  on public.user_profiles
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.user_profiles me
      where me.user_id = auth.uid()
        and me.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.user_profiles me
      where me.user_id = auth.uid()
        and me.is_admin = true
    )
  );
