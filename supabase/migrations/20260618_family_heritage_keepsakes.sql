begin;

create extension if not exists pgcrypto;

create table if not exists public.memory_book_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  live_book_id uuid null,
  source text not null default 'purchase',
  granted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memory_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  theme text not null default 'family_heritage_v1'
    check (theme = 'family_heritage_v1'),
  title text not null default 'Our Family Heritage',
  honoree text not null default '',
  period_label text not null default '',
  dedication text not null default '',
  notes text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'preparing', 'published', 'needs_attention')),
  draft_version integer not null default 1 check (draft_version > 0),
  draft_document jsonb not null default '{}'::jsonb,
  settings jsonb not null default jsonb_build_object(
    'musicEnabled', true,
    'downloadsEnabled', false
  ),
  preservation_consent boolean not null default false,
  share_token uuid not null default gen_random_uuid(),
  share_version integer not null default 1 check (share_version > 0),
  pin_hash text null,
  pin_updated_at timestamptz null,
  downloads_enabled boolean not null default false,
  music_enabled boolean not null default true,
  published_revision_id uuid null,
  last_activity_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null default timezone('utc', now()) + interval '90 days',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memory_book_assets (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.memory_books(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null
    check (source_type in ('restoration', 'family_portrait', 'animation', 'nostalgic_hug', 'upload')),
  source_id uuid null,
  media_type text not null check (media_type in ('image', 'video')),
  source_locator text null,
  preserved_key text null,
  poster_key text null,
  original_label text not null default 'Family memory',
  caption text not null default '',
  alt_text text not null default 'Family memory',
  position integer not null default 0 check (position >= 0),
  is_featured boolean not null default false,
  is_hidden boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'ready', 'failed')),
  metadata jsonb not null default '{}'::jsonb,
  error_message text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.memory_book_revisions (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.memory_books(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  revision_number integer not null check (revision_number > 0),
  document jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (book_id, revision_number)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'memory_books_published_revision_id_fkey'
  ) then
    alter table public.memory_books
      add constraint memory_books_published_revision_id_fkey
      foreign key (published_revision_id)
      references public.memory_book_revisions(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'memory_book_entitlements_live_book_id_fkey'
  ) then
    alter table public.memory_book_entitlements
      add constraint memory_book_entitlements_live_book_id_fkey
      foreign key (live_book_id)
      references public.memory_books(id)
      on delete set null;
  end if;
end
$$;

create table if not exists public.memory_book_jobs (
  id uuid primary key default gen_random_uuid(),
  book_id uuid null references public.memory_books(id) on delete set null,
  asset_id uuid null references public.memory_book_assets(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  job_type text not null
    check (job_type in ('preserve_asset', 'polish_copy', 'reaction_email', 'delete_storage', 'draft_expiry_warning')),
  status text not null default 'queued'
    check (status in ('queued', 'running', 'completed', 'failed', 'dead')),
  payload jsonb not null default '{}'::jsonb,
  result jsonb null,
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts > 0),
  idempotency_key text not null unique,
  available_at timestamptz not null default timezone('utc', now()),
  lease_expires_at timestamptz null,
  locked_by text null,
  error_message text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz null
);

create table if not exists public.memory_book_reactions (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.memory_books(id) on delete cascade,
  reaction text not null check (reaction in ('love', 'moved', 'remember', 'thank_you')),
  display_name text not null default '',
  note text not null default '' check (char_length(note) <= 280),
  ip_hash text not null,
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'queued', 'sent', 'failed')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_memory_books_user_activity
  on public.memory_books(user_id, last_activity_at desc);
create index if not exists idx_memory_books_share
  on public.memory_books(share_token, share_version)
  where status = 'published';
create index if not exists idx_memory_book_assets_book_position
  on public.memory_book_assets(book_id, position);
create index if not exists idx_memory_book_assets_status
  on public.memory_book_assets(status);
create index if not exists idx_memory_book_revisions_book
  on public.memory_book_revisions(book_id, revision_number desc);
create index if not exists idx_memory_book_jobs_claim
  on public.memory_book_jobs(status, available_at, lease_expires_at);
create index if not exists idx_memory_book_reactions_book
  on public.memory_book_reactions(book_id, created_at desc);
create index if not exists idx_memory_book_reactions_rate
  on public.memory_book_reactions(book_id, ip_hash, created_at desc);

create or replace function public.touch_memory_book()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  new.last_activity_at = timezone('utc', now());
  if new.status <> 'published' then
    new.expires_at = timezone('utc', now()) + interval '90 days';
  end if;
  return new;
end;
$$;

drop trigger if exists touch_memory_books on public.memory_books;
create trigger touch_memory_books
  before update on public.memory_books
  for each row execute function public.touch_memory_book();

create or replace function public.touch_memory_book_row()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists touch_memory_book_assets on public.memory_book_assets;
create trigger touch_memory_book_assets
  before update on public.memory_book_assets
  for each row execute function public.touch_memory_book_row();

drop trigger if exists touch_memory_book_jobs on public.memory_book_jobs;
create trigger touch_memory_book_jobs
  before update on public.memory_book_jobs
  for each row execute function public.touch_memory_book_row();

drop trigger if exists touch_memory_book_entitlements on public.memory_book_entitlements;
create trigger touch_memory_book_entitlements
  before update on public.memory_book_entitlements
  for each row execute function public.touch_memory_book_row();

insert into public.memory_book_entitlements (user_id, source)
select distinct p.user_id, 'historical_purchase'
from public.payments p
where p.status in ('completed', 'succeeded')
on conflict (user_id) do nothing;

create or replace function public.grant_memory_book_entitlement_from_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('completed', 'succeeded') then
    insert into public.memory_book_entitlements (user_id, source)
    values (new.user_id, 'purchase')
    on conflict (user_id) do update
      set updated_at = timezone('utc', now());
  end if;
  return new;
end;
$$;

drop trigger if exists grant_memory_book_entitlement_after_payment on public.payments;
create trigger grant_memory_book_entitlement_after_payment
  after insert or update of status on public.payments
  for each row execute function public.grant_memory_book_entitlement_from_payment();

create or replace function public.publish_memory_book(
  p_book_id uuid,
  p_expected_version integer,
  p_document jsonb
)
returns table(revision_id uuid, revision_number integer, share_token uuid, share_version integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_book public.memory_books%rowtype;
  v_entitlement public.memory_book_entitlements%rowtype;
  v_revision_id uuid;
  v_revision_number integer;
  v_asset_count integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select * into v_book
  from public.memory_books
  where id = p_book_id and user_id = v_user_id
  for update;

  if not found then
    raise exception 'Memory book not found';
  end if;

  if v_book.draft_version <> p_expected_version then
    raise exception 'STALE_VERSION';
  end if;

  if not v_book.preservation_consent then
    raise exception 'Preservation consent is required';
  end if;

  select count(*) into v_asset_count
  from public.memory_book_assets
  where book_id = p_book_id
    and status = 'ready'
    and is_hidden = false;

  if v_asset_count < 6 or v_asset_count > 12 then
    raise exception 'A published book requires 6 to 12 ready memories';
  end if;

  select * into v_entitlement
  from public.memory_book_entitlements
  where user_id = v_user_id
  for update;

  if not found then
    raise exception 'A completed purchase is required to publish';
  end if;

  if v_entitlement.live_book_id is not null
     and v_entitlement.live_book_id <> p_book_id then
    raise exception 'Only one published memory book is available';
  end if;

  select coalesce(max(r.revision_number), 0) + 1
  into v_revision_number
  from public.memory_book_revisions r
  where r.book_id = p_book_id;

  insert into public.memory_book_revisions (
    book_id,
    user_id,
    revision_number,
    document
  )
  values (
    p_book_id,
    v_user_id,
    v_revision_number,
    p_document
  )
  returning id into v_revision_id;

  update public.memory_books
  set
    status = 'published',
    published_revision_id = v_revision_id,
    expires_at = 'infinity'::timestamptz
  where id = p_book_id;

  update public.memory_book_entitlements
  set live_book_id = p_book_id
  where user_id = v_user_id;

  return query
  select v_revision_id, v_revision_number, v_book.share_token, v_book.share_version;
end;
$$;

create or replace function public.unpublish_memory_book(p_book_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  update public.memory_books
  set
    status = 'draft',
    published_revision_id = null,
    expires_at = timezone('utc', now()) + interval '90 days'
  where id = p_book_id and user_id = v_user_id;

  if not found then
    raise exception 'Memory book not found';
  end if;

  update public.memory_book_entitlements
  set live_book_id = null
  where user_id = v_user_id and live_book_id = p_book_id;
end;
$$;

create or replace function public.claim_memory_book_jobs(
  p_worker_id text,
  p_limit integer default 10
)
returns setof public.memory_book_jobs
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with claimable as (
    select j.id
    from public.memory_book_jobs j
    where
      (
        j.status in ('queued', 'failed')
        or (j.status = 'running' and j.lease_expires_at < timezone('utc', now()))
      )
      and j.available_at <= timezone('utc', now())
      and j.attempts < j.max_attempts
    order by j.available_at, j.created_at
    for update skip locked
    limit greatest(1, least(p_limit, 25))
  )
  update public.memory_book_jobs j
  set
    status = 'running',
    attempts = j.attempts + 1,
    locked_by = p_worker_id,
    lease_expires_at = timezone('utc', now()) + interval '2 minutes',
    error_message = null
  from claimable
  where j.id = claimable.id
  returning j.*;
end;
$$;

alter table public.memory_book_entitlements enable row level security;
alter table public.memory_books enable row level security;
alter table public.memory_book_assets enable row level security;
alter table public.memory_book_revisions enable row level security;
alter table public.memory_book_jobs enable row level security;
alter table public.memory_book_reactions enable row level security;

drop policy if exists "Users read own memory book entitlement" on public.memory_book_entitlements;
create policy "Users read own memory book entitlement"
  on public.memory_book_entitlements for select
  using (auth.uid() = user_id);

drop policy if exists "Users manage own memory books" on public.memory_books;
create policy "Users manage own memory books"
  on public.memory_books for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own memory book assets" on public.memory_book_assets;
create policy "Users manage own memory book assets"
  on public.memory_book_assets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users read own memory book revisions" on public.memory_book_revisions;
create policy "Users read own memory book revisions"
  on public.memory_book_revisions for select
  using (auth.uid() = user_id);

drop policy if exists "Users read own memory book jobs" on public.memory_book_jobs;
create policy "Users read own memory book jobs"
  on public.memory_book_jobs for select
  using (auth.uid() = user_id);

drop policy if exists "Users read reactions to own memory books" on public.memory_book_reactions;
create policy "Users read reactions to own memory books"
  on public.memory_book_reactions for select
  using (
    exists (
      select 1
      from public.memory_books b
      where b.id = memory_book_reactions.book_id
        and b.user_id = auth.uid()
    )
  );

grant select on public.memory_book_entitlements to authenticated;
grant select, insert, update, delete on public.memory_books to authenticated;
grant select, insert, update, delete on public.memory_book_assets to authenticated;
grant select on public.memory_book_revisions to authenticated;
grant select on public.memory_book_jobs to authenticated;
grant select on public.memory_book_reactions to authenticated;
grant execute on function public.publish_memory_book(uuid, integer, jsonb) to authenticated;
grant execute on function public.unpublish_memory_book(uuid) to authenticated;
revoke all on function public.claim_memory_book_jobs(text, integer) from public, anon, authenticated;
grant execute on function public.claim_memory_book_jobs(text, integer) to service_role;

do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'memory_books'
    ) then
      alter publication supabase_realtime add table public.memory_books;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'memory_book_assets'
    ) then
      alter publication supabase_realtime add table public.memory_book_assets;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'memory_book_jobs'
    ) then
      alter publication supabase_realtime add table public.memory_book_jobs;
    end if;
  end if;
end
$$;

commit;
