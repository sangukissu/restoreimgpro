begin;

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

  if v_assigned_count < 6 or v_assigned_count > 20 then
    raise exception 'A published book requires 6 to 20 assigned memories';
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

grant execute on function public.publish_memory_book(uuid, integer, jsonb) to authenticated;

commit;