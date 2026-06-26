create table if not exists public.remove_person_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  result_image_url text not null,
  instruction text,
  aspect_ratio text not null default 'auto',
  status text not null default 'completed' check (status in ('processing','completed','failed')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.remove_person_generations enable row level security;

drop policy if exists "Users can view own remove-person generations" on public.remove_person_generations;
create policy "Users can view own remove-person generations" on public.remove_person_generations
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own remove-person generations" on public.remove_person_generations;
create policy "Users can insert own remove-person generations" on public.remove_person_generations
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own remove-person generations" on public.remove_person_generations;
create policy "Users can update own remove-person generations" on public.remove_person_generations
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own remove-person generations" on public.remove_person_generations;
create policy "Users can delete own remove-person generations" on public.remove_person_generations
  for delete using (auth.uid() = user_id);

create or replace trigger update_remove_person_generations_updated_at
  before update on public.remove_person_generations
  for each row execute function public.update_updated_at_column();

create index if not exists idx_remove_person_generations_user_id on public.remove_person_generations(user_id);
create index if not exists idx_remove_person_generations_created_at on public.remove_person_generations(created_at desc);

alter table public.memory_book_assets drop constraint if exists memory_book_assets_source_type_check;
alter table public.memory_book_assets
  add constraint memory_book_assets_source_type_check
  check (source_type in ('restoration', 'family_portrait', 'add_person', 'remove_person', 'animation', 'nostalgic_hug', 'upload'));

alter table public.memory_book_media_derivatives drop constraint if exists memory_book_media_derivatives_source_type_check;
alter table public.memory_book_media_derivatives
  add constraint memory_book_media_derivatives_source_type_check
  check (source_type in ('restoration', 'family_portrait', 'add_person', 'remove_person', 'animation', 'nostalgic_hug'));


  