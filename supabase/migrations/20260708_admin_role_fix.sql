-- 20260708_admin_role_fix.sql
-- Fix: the previous "Admins can read all profiles" and "Admins can update any
-- profile" policies I added were separate policies, which Supabase AND's within
-- the same role/action. For non-admin users this made the admin subquery's
-- USING clause return false, which silently blocked their own row reads and
-- the dashboard's credit display.
--
-- The safe pattern is to fold the admin allowance into the existing
-- "Users can view/update own profile" policies so the admin check is OR'd with
-- the regular "auth.uid() = user_id" check instead of competing with it.

-- Drop the broken extra policies.
drop policy if exists "Admins can read all profiles" on public.user_profiles;
drop policy if exists "Admins can update any profile" on public.user_profiles;

-- Recreate the standard user policies with admin OR'd in. Users can always
-- read or update their own row. Admins (is_admin = true on their own
-- user_profiles row) can read or update any row.
drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
  on public.user_profiles
  for select
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.user_profiles me
      where me.user_id = auth.uid()
        and me.is_admin = true
    )
  );

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.user_profiles me
      where me.user_id = auth.uid()
        and me.is_admin = true
    )
  )
  with check (
    auth.uid() = user_id
    or exists (
      select 1
      from public.user_profiles me
      where me.user_id = auth.uid()
        and me.is_admin = true
    )
  );
