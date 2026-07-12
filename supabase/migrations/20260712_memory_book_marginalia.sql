begin;

-- Reader's Marginalia: reactions become shared, per-page handwritten notes
-- visible to every reader of the book, anchored to a page, in a stable ink colour.

alter table public.memory_book_reactions
  add column if not exists page_index int null
    check (page_index is null or (page_index between 0 and 100)),
  add column if not exists ink_color_key smallint not null default 1
    check (ink_color_key between 1 and 5),
  add column if not exists hidden boolean not null default false;

-- Visible marginalia, grouped by book + page for fast per-page reads.
drop index if exists idx_memory_book_reactions_book_page;
create index idx_memory_book_reactions_book_page
  on public.memory_book_reactions(book_id, page_index, created_at desc)
  where hidden = false;

commit;