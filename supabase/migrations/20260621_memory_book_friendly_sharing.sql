begin;

alter table public.memory_books
  add column if not exists share_slug text;

with normalized as (
  select
    id,
    coalesce(
      nullif(
        trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')),
        ''
      ),
      'family-keepsake'
    ) as candidate
  from public.memory_books
),
ranked as (
  select
    id,
    left(candidate, 60) as candidate,
    count(*) over (partition by candidate) as candidate_count
  from normalized
)
update public.memory_books as books
set share_slug = case
  when ranked.candidate_count = 1
    and length(ranked.candidate) >= 3
    and ranked.candidate not in (
      'api', 'app', 'admin', 'dashboard', 'login', 'logout', 'memory-book',
      'new', 'privacy', 'settings', 'share', 'support', 'terms'
    )
    then ranked.candidate
  else left(
    case
      when length(ranked.candidate) >= 3 then ranked.candidate
      else 'family-keepsake'
    end,
    52
  ) || '-' || left(books.id::text, 7)
end
from ranked
where books.id = ranked.id
  and books.share_slug is null;

alter table public.memory_books
  alter column share_slug set not null;

alter table public.memory_books
  add constraint memory_books_share_slug_format
  check (
    share_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    and length(share_slug) between 3 and 60
  ) not valid;

alter table public.memory_books
  validate constraint memory_books_share_slug_format;

create unique index if not exists memory_books_share_slug_unique
  on public.memory_books (lower(share_slug));

commit;
