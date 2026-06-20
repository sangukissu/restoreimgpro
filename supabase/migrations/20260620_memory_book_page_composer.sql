begin;

create table if not exists public.memory_book_media_derivatives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('restoration', 'family_portrait', 'animation', 'nostalgic_hug', 'upload')),
  source_id uuid not null,
  media_type text not null check (media_type in ('image', 'video')),
  source_locator text not null,
  preview_locator text not null,
  thumbnail_small_key text null,
  thumbnail_medium_key text null,
  status text not null default 'queued' check (status in ('queued', 'processing', 'ready', 'failed')),
  error_message text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, source_type, source_id)
);

create index if not exists idx_memory_book_media_derivatives_status
  on public.memory_book_media_derivatives(status, updated_at);

alter table public.memory_book_media_derivatives enable row level security;
drop policy if exists "Users read own memory book derivatives" on public.memory_book_media_derivatives;
create policy "Users read own memory book derivatives"
  on public.memory_book_media_derivatives for select
  using (auth.uid() = user_id);
grant select on public.memory_book_media_derivatives to authenticated;

alter table public.memory_book_jobs
  drop constraint if exists memory_book_jobs_job_type_check;
alter table public.memory_book_jobs
  add constraint memory_book_jobs_job_type_check
  check (job_type in ('preserve_asset', 'generate_media_derivatives', 'polish_copy', 'reaction_email', 'delete_storage', 'draft_expiry_warning'));

with ranked_assets as (
  select
    a.book_id,
    a.id,
    a.position,
    a.metadata,
    ((row_number() over (partition by a.book_id order by a.position, a.created_at) - 1) / 2)::integer as spread_index
  from public.memory_book_assets a
  where a.is_hidden = false
), grouped_spreads as (
  select
    book_id,
    spread_index,
    jsonb_agg(to_jsonb(id) order by position) as asset_ids,
    (array_agg(metadata order by position))[1] as first_metadata
  from ranked_assets
  group by book_id, spread_index
), migrated_spreads as (
  select
    b.id as book_id,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', 'heritage-spread-' || (g.spread_index + 1),
          'assetIds', g.asset_ids,
          'heading', coalesce(
            nullif(g.first_metadata->>'customHeading', ''),
            (array[
              'Where our story begins',
              'The faces we carry',
              'Days worth remembering',
              'Love, passed forward',
              'The little family archive',
              'Still with us'
            ])[g.spread_index + 1],
            'Family memory ' || (g.spread_index + 1)
          ),
          'body', left(
            case
              when g.spread_index = 0 and b.notes <> '' then b.notes
              else coalesce(
                nullif(g.first_metadata->>'customBody', ''),
                (array[
                  'A few photographs can hold an entire generation: its tenderness, its courage, and the ordinary days that became precious.',
                  'These are the people whose expressions, rituals, and stories continue to shape the family we know today.',
                  'Time changes the paper, but it does not take away the warmth inside the moment.',
                  'Every generation leaves something gentle behind: a gesture, a saying, a familiar smile, a way of caring.',
                  'Gathered here are the fragments that deserve to remain together, close enough to be revisited.',
                  'The years move forward. What mattered stays, ready to be shared again.'
                ])[g.spread_index + 1],
                'A family memory worth keeping close.'
              )
            end,
            420
          )
        ) order by g.spread_index
      ) filter (where g.book_id is not null),
      '[]'::jsonb
    ) as spreads
  from public.memory_books b
  left join grouped_spreads g on g.book_id = b.id
  group by b.id
)
update public.memory_books b
set draft_document = jsonb_build_object(
  'schemaVersion', 1,
  'cover', jsonb_build_object(
    'title', coalesce(nullif(b.title, ''), 'Our Family Heritage'),
    'periodLabel', b.period_label
  ),
  'spreads', m.spreads,
  'closingMessage', b.dedication
)
from migrated_spreads m
where m.book_id = b.id
  and (
    b.draft_document = '{}'::jsonb
    or not (b.draft_document ? 'schemaVersion')
  );

alter table public.memory_books
  alter column draft_document set default jsonb_build_object(
    'schemaVersion', 1,
    'cover', jsonb_build_object('title', 'Our Family Heritage', 'periodLabel', ''),
    'spreads', '[]'::jsonb,
    'closingMessage', ''
  );

create or replace function public.queue_memory_book_media_derivative()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_json jsonb := to_jsonb(new);
  v_source_type text := tg_argv[0];
  v_media_type text := tg_argv[1];
  v_source_locator text;
  v_preview_locator text;
  v_derivative_id uuid;
begin
  if coalesce(v_json->>'status', '') <> 'completed' then
    return new;
  end if;

  v_source_locator := case v_source_type
    when 'restoration' then v_json->>'restored_image_url'
    when 'family_portrait' then v_json->>'composed_image_url'
    when 'animation' then v_json->>'video_url'
    when 'nostalgic_hug' then v_json->>'video_url'
  end;
  v_preview_locator := case v_source_type
    when 'restoration' then v_json->>'restored_image_url'
    when 'family_portrait' then v_json->>'composed_image_url'
    when 'animation' then v_json->>'original_image_url'
    when 'nostalgic_hug' then v_json->>'hug_image_url'
  end;

  if nullif(v_source_locator, '') is null or nullif(v_preview_locator, '') is null then
    return new;
  end if;

  insert into public.memory_book_media_derivatives (
    user_id, source_type, source_id, media_type, source_locator, preview_locator
  ) values (
    new.user_id, v_source_type, new.id, v_media_type, v_source_locator, v_preview_locator
  )
  on conflict (user_id, source_type, source_id) do update
    set source_locator = excluded.source_locator,
        preview_locator = excluded.preview_locator,
        status = case
          when public.memory_book_media_derivatives.preview_locator <> excluded.preview_locator
            then 'queued'
          else public.memory_book_media_derivatives.status
        end,
        updated_at = timezone('utc', now())
  returning id into v_derivative_id;

  insert into public.memory_book_jobs (
    user_id, job_type, idempotency_key, payload
  ) values (
    new.user_id,
    'generate_media_derivatives',
    'media-derivative:' || v_derivative_id || ':' || md5(v_preview_locator),
    jsonb_build_object('derivativeId', v_derivative_id)
  ) on conflict (idempotency_key) do nothing;

  return new;
end;
$$;

drop trigger if exists queue_restoration_memory_book_derivative on public.image_restorations;
create trigger queue_restoration_memory_book_derivative
after insert or update on public.image_restorations
for each row execute function public.queue_memory_book_media_derivative('restoration', 'image');

drop trigger if exists queue_portrait_memory_book_derivative on public.family_portraits;
create trigger queue_portrait_memory_book_derivative
after insert or update on public.family_portraits
for each row execute function public.queue_memory_book_media_derivative('family_portrait', 'image');

drop trigger if exists queue_animation_memory_book_derivative on public.video_generations;
create trigger queue_animation_memory_book_derivative
after insert or update on public.video_generations
for each row execute function public.queue_memory_book_media_derivative('animation', 'video');

drop trigger if exists queue_hug_memory_book_derivative on public.nostalgic_hug_generations;
create trigger queue_hug_memory_book_derivative
after insert or update on public.nostalgic_hug_generations
for each row execute function public.queue_memory_book_media_derivative('nostalgic_hug', 'video');

insert into public.memory_book_media_derivatives (
  user_id, source_type, source_id, media_type, source_locator, preview_locator
)
select user_id, 'restoration', id, 'image', restored_image_url, restored_image_url
from public.image_restorations
where status = 'completed' and restored_image_url is not null
on conflict (user_id, source_type, source_id) do nothing;

insert into public.memory_book_media_derivatives (
  user_id, source_type, source_id, media_type, source_locator, preview_locator
)
select user_id, 'family_portrait', id, 'image', composed_image_url, composed_image_url
from public.family_portraits
where status = 'completed' and composed_image_url is not null
on conflict (user_id, source_type, source_id) do nothing;

insert into public.memory_book_media_derivatives (
  user_id, source_type, source_id, media_type, source_locator, preview_locator
)
select user_id, 'animation', id, 'video', video_url, original_image_url
from public.video_generations
where status = 'completed' and video_url is not null and original_image_url is not null
on conflict (user_id, source_type, source_id) do nothing;

insert into public.memory_book_media_derivatives (
  user_id, source_type, source_id, media_type, source_locator, preview_locator
)
select user_id, 'nostalgic_hug', id, 'video', video_url, hug_image_url
from public.nostalgic_hug_generations
where status = 'completed' and video_url is not null and hug_image_url is not null
on conflict (user_id, source_type, source_id) do nothing;

insert into public.memory_book_jobs (user_id, job_type, idempotency_key, payload)
select
  d.user_id,
  'generate_media_derivatives',
  'media-derivative:' || d.id || ':' || md5(d.preview_locator),
  jsonb_build_object('derivativeId', d.id)
from public.memory_book_media_derivatives d
where d.status in ('queued', 'failed')
on conflict (idempotency_key) do nothing;

insert into public.memory_book_jobs (book_id, asset_id, user_id, job_type, idempotency_key)
select
  a.book_id,
  a.id,
  a.user_id,
  'preserve_asset',
  'generate-memory-book-previews:' || a.id
from public.memory_book_assets a
where a.status = 'ready'
  and a.preserved_key is not null
  and not (a.metadata ? 'thumbnailSmallKey' and a.metadata ? 'thumbnailMediumKey')
on conflict (idempotency_key) do nothing;

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
  v_assigned_ids uuid[];
  v_assigned_count integer;
  v_distinct_count integer;
  v_ready_count integer;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;

  select * into v_book
  from public.memory_books
  where id = p_book_id and user_id = v_user_id
  for update;

  if not found then raise exception 'Memory book not found'; end if;
  if v_book.draft_version <> p_expected_version then raise exception 'STALE_VERSION'; end if;
  if not v_book.preservation_consent then raise exception 'Preservation consent is required'; end if;

  if exists (
    select 1
    from jsonb_array_elements(v_book.draft_document->'spreads') spread
    where jsonb_array_length(spread->'assetIds') = 0
  ) then
    raise exception 'Every page must contain at least one memory';
  end if;

  select
    coalesce(array_agg(asset_id::uuid), '{}'::uuid[]),
    count(*),
    count(distinct asset_id)
  into v_assigned_ids, v_assigned_count, v_distinct_count
  from jsonb_array_elements(v_book.draft_document->'spreads') spread,
       jsonb_array_elements_text(spread->'assetIds') asset_id;

  if v_assigned_count < 6 or v_assigned_count > 12 then
    raise exception 'A published book requires 6 to 12 assigned memories';
  end if;
  if v_distinct_count <> v_assigned_count then
    raise exception 'A memory can only appear on one page';
  end if;

  select count(*) into v_ready_count
  from public.memory_book_assets
  where book_id = p_book_id
    and user_id = v_user_id
    and id = any(v_assigned_ids)
    and status = 'ready'
    and is_hidden = false;
  if v_ready_count <> v_assigned_count then
    raise exception 'Every assigned memory must be prepared before publishing';
  end if;

  select * into v_entitlement
  from public.memory_book_entitlements
  where user_id = v_user_id
  for update;
  if not found then raise exception 'A completed purchase is required to publish'; end if;
  if v_entitlement.live_book_id is not null and v_entitlement.live_book_id <> p_book_id then
    raise exception 'Only one published memory book is available';
  end if;

  select coalesce(max(r.revision_number), 0) + 1 into v_revision_number
  from public.memory_book_revisions r where r.book_id = p_book_id;

  insert into public.memory_book_revisions (book_id, user_id, revision_number, document)
  values (p_book_id, v_user_id, v_revision_number, p_document)
  returning id into v_revision_id;

  update public.memory_books
  set status = 'published', published_revision_id = v_revision_id, expires_at = 'infinity'::timestamptz
  where id = p_book_id;
  update public.memory_book_entitlements set live_book_id = p_book_id where user_id = v_user_id;

  return query select v_revision_id, v_revision_number, v_book.share_token, v_book.share_version;
end;
$$;

commit;