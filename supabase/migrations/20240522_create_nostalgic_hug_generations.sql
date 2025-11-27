create table nostalgic_hug_generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  sofa_image_url text not null,
  hug_image_url text not null,
  video_url text,
  fal_request_id text,
  status text check (status in ('uploading', 'generating', 'completed', 'failed')) default 'uploading',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table nostalgic_hug_generations enable row level security;

-- Create policies
create policy "Users can view their own generations"
  on nostalgic_hug_generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on nostalgic_hug_generations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own generations"
  on nostalgic_hug_generations for update
  using (auth.uid() = user_id);
