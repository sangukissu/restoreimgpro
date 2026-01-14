create table public.payment_plans (
  id uuid not null default gen_random_uuid (),
  name text not null,
  price_cents integer not null,
  credits integer not null,
  description text null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  dodo_product_id text not null,
  constraint payment_plans_pkey primary key (id)
) TABLESPACE pg_default;

create table public.payments (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  dodo_payment_id text not null,
  payment_plan_id uuid null,
  amount_cents integer not null,
  credits_purchased integer not null,
  status text not null default 'pending'::text,
  payment_link text null,
  metadata jsonb null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint payments_pkey primary key (id),
  constraint payments_dodo_payment_id_key unique (dodo_payment_id),
  constraint payments_payment_plan_id_fkey foreign KEY (payment_plan_id) references payment_plans (id),
  constraint payments_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_payments_user_id on public.payments using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_payments_dodo_payment_id on public.payments using btree (dodo_payment_id) TABLESPACE pg_default;



create table public.webhook_events (
  id uuid not null default gen_random_uuid (),
  event_id text not null,
  event_type text not null,
  object_id text not null,
  payment_id uuid null,
  processed boolean null default false,
  data jsonb not null,
  created_at timestamp with time zone null default now(),
  constraint webhook_events_pkey primary key (id),
  constraint webhook_events_event_id_key unique (event_id),
  constraint webhook_events_payment_id_fkey foreign KEY (payment_id) references payments (id)
) TABLESPACE pg_default;

create index IF not exists idx_webhook_events_event_id on public.webhook_events using btree (event_id) TABLESPACE pg_default;

create index IF not exists idx_webhook_events_processed on public.webhook_events using btree (processed) TABLESPACE pg_default;


create table public.user_profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  email text not null,
  name text null,
  credits integer null default 0,
  total_credits_purchased integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_user_id_key unique (user_id),
  constraint user_profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_user_profiles_user_id on public.user_profiles using btree (user_id) TABLESPACE pg_default;