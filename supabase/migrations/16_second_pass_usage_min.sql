-- Minimal table to track second-pass (re-restoration) usage per user and image
-- One row per actual usage event
create table if not exists public.second_pass_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  image_key text not null, -- the gating key: originalUrl if provided, else imageUrl
  restored_image_url text, -- the resulting image URL from the second pass
  used_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists second_pass_usage_user_id_idx on public.second_pass_usage (user_id);
create index if not exists second_pass_usage_used_at_idx on public.second_pass_usage (used_at);