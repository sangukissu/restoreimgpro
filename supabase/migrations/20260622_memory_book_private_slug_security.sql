begin;

-- Published books must always have a PIN. Keep existing revisions and media,
-- but lock legacy PIN-less books until their owner republishes with a PIN.
update public.memory_books
set status = 'needs_attention'
where status = 'published'
  and pin_hash is null;

alter table public.memory_books
  drop constraint if exists memory_books_published_requires_pin;

alter table public.memory_books
  add constraint memory_books_published_requires_pin
  check (status <> 'published' or pin_hash is not null);

create table if not exists public.memory_book_pin_attempts (
  id bigint generated always as identity primary key,
  book_id uuid null references public.memory_books(id) on delete cascade,
  network_hash text not null,
  attempted_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_memory_book_pin_attempts_book_network
  on public.memory_book_pin_attempts(book_id, network_hash, attempted_at desc);

create index if not exists idx_memory_book_pin_attempts_network
  on public.memory_book_pin_attempts(network_hash, attempted_at desc);

alter table public.memory_book_pin_attempts enable row level security;
revoke all on public.memory_book_pin_attempts from anon, authenticated;

create or replace function public.memory_book_pin_rate_status(
  p_book_id uuid,
  p_network_hash text
)
returns table(
  book_failures integer,
  network_failures integer,
  challenge_required boolean,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := timezone('utc', now());
  v_book_failures integer;
  v_network_failures integer;
  v_book_unlock_at timestamptz;
  v_network_unlock_at timestamptz;
  v_retry integer := 0;
begin
  delete from public.memory_book_pin_attempts
  where attempted_at < v_now - interval '24 hours';

  select count(*)::integer, min(attempted_at) + interval '15 minutes'
  into v_book_failures, v_book_unlock_at
  from public.memory_book_pin_attempts
  where book_id is not distinct from p_book_id
    and network_hash = p_network_hash
    and attempted_at >= v_now - interval '15 minutes';

  select count(*)::integer, min(attempted_at) + interval '1 hour'
  into v_network_failures, v_network_unlock_at
  from public.memory_book_pin_attempts
  where network_hash = p_network_hash
    and attempted_at >= v_now - interval '1 hour';

  if v_book_failures >= 5 then
    v_retry := greatest(
      v_retry,
      ceil(extract(epoch from (v_book_unlock_at - v_now)))::integer
    );
  end if;

  if v_network_failures >= 20 then
    v_retry := greatest(
      v_retry,
      ceil(extract(epoch from (v_network_unlock_at - v_now)))::integer
    );
  end if;

  return query select
    v_book_failures,
    v_network_failures,
    v_book_failures >= 2,
    greatest(v_retry, 0);
end;
$$;

create or replace function public.record_memory_book_pin_attempt(
  p_book_id uuid,
  p_network_hash text,
  p_success boolean
)
returns table(
  book_failures integer,
  network_failures integer,
  challenge_required boolean,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext(p_network_hash));

  if p_success then
    delete from public.memory_book_pin_attempts
    where book_id is not distinct from p_book_id
      and network_hash = p_network_hash;
  else
    insert into public.memory_book_pin_attempts(book_id, network_hash)
    values (p_book_id, p_network_hash);
  end if;

  return query
  select *
  from public.memory_book_pin_rate_status(p_book_id, p_network_hash);
end;
$$;

revoke all on function public.memory_book_pin_rate_status(uuid, text)
  from public, anon, authenticated;
revoke all on function public.record_memory_book_pin_attempt(uuid, text, boolean)
  from public, anon, authenticated;

grant execute on function public.memory_book_pin_rate_status(uuid, text)
  to service_role;
grant execute on function public.record_memory_book_pin_attempt(uuid, text, boolean)
  to service_role;

commit;
