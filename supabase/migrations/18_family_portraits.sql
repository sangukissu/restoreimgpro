-- Family Portraits table: stores composed portrait results per user
create table if not exists public.family_portraits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  composed_image_url text not null,
  aspect_ratio text not null default '4:3',
  input_image_count integer not null default 1,
  status text not null default 'completed' check (status in ('processing','completed','failed')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.family_portraits enable row level security;

-- Policies
drop policy if exists "Users can view own family portraits" on public.family_portraits;
create policy "Users can view own family portraits" on public.family_portraits
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own family portraits" on public.family_portraits;
create policy "Users can insert own family portraits" on public.family_portraits
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own family portraits" on public.family_portraits;
create policy "Users can delete own family portraits" on public.family_portraits
  for delete using (auth.uid() = user_id);

-- Trigger for updated_at
create or replace trigger update_family_portraits_updated_at
  before update on public.family_portraits
  for each row execute function public.update_updated_at_column();

-- Helpful indexes
create index if not exists idx_family_portraits_user_id on public.family_portraits(user_id);
create index if not exists idx_family_portraits_created_at on public.family_portraits(created_at desc);