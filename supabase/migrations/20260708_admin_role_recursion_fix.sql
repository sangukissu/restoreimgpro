-- 20260708_admin_role_recursion_fix.sql
-- The previous "Users can view/update own profile" policies referenced
-- public.user_profiles inside the USING clause, which caused infinite
-- recursion (Postgres raises 42P17). This silently broke the dashboard
-- credit read for every user.
--
-- Fix: replace the inline subquery with a SECURITY DEFINER helper function
-- that reads is_admin while bypassing RLS, so the policy no longer
-- recursively consults the same table.

create or replace function public.current_user_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.user_profiles where user_id = auth.uid() limit 1),
    false
  );
$$;

-- Anyone can execute the helper; it only exposes a boolean.
grant execute on function public.current_user_is_admin() to authenticated;

drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
  on public.user_profiles
  for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.current_user_is_admin()
  );

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (
    auth.uid() = user_id
    or public.current_user_is_admin()
  )
  with check (
    auth.uid() = user_id
    or public.current_user_is_admin()
  );
