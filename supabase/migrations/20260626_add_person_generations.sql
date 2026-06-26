create table if not exists public.add_person_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  composed_image_url text not null,
  placement text not null default 'center',
  context text,
  aspect_ratio text not null default 'auto',
  status text not null default 'completed' check (status in ('processing','completed','failed')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.add_person_generations enable row level security;

drop policy if exists "Users can view own add-person generations" on public.add_person_generations;
create policy "Users can view own add-person generations" on public.add_person_generations
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own add-person generations" on public.add_person_generations;
create policy "Users can insert own add-person generations" on public.add_person_generations
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own add-person generations" on public.add_person_generations;
create policy "Users can update own add-person generations" on public.add_person_generations
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own add-person generations" on public.add_person_generations;
create policy "Users can delete own add-person generations" on public.add_person_generations
  for delete using (auth.uid() = user_id);

create or replace trigger update_add_person_generations_updated_at
  before update on public.add_person_generations
  for each row execute function public.update_updated_at_column();

create index if not exists idx_add_person_generations_user_id on public.add_person_generations(user_id);
create index if not exists idx_add_person_generations_created_at on public.add_person_generations(created_at desc);

alter table public.memory_book_assets drop constraint if exists memory_book_assets_source_type_check;
alter table public.memory_book_assets
  add constraint memory_book_assets_source_type_check
  check (source_type in ('restoration', 'family_portrait', 'add_person', 'animation', 'nostalgic_hug', 'upload'));

alter table public.memory_book_media_derivatives drop constraint if exists memory_book_media_derivatives_source_type_check;
alter table public.memory_book_media_derivatives
  add constraint memory_book_media_derivatives_source_type_check
  check (source_type in ('restoration', 'family_portrait', 'add_person', 'animation', 'nostalgic_hug'));