    
create table public.image_restorations (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  restored_image_url text null,
  status text not null default 'processing'::text,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint image_restorations_pkey primary key (id),
  constraint image_restorations_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint image_restorations_status_check check (
    (
      status = any (
        array[
          'processing'::text,
          'completed'::text,
          'failed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create trigger update_image_restorations_updated_at BEFORE
update on image_restorations for EACH row
execute FUNCTION update_updated_at_column ();

create table public.payment_plans (
  id text not null default 'premium-plan'::text,
  name text not null,
  price_cents integer not null,
  credits integer not null,
  dodo_product_id text not null,
  created_at timestamp with time zone null default now(),
  constraint payment_plans_pkey primary key (id)
) TABLESPACE pg_default;

create table public.payments (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  dodo_payment_id text not null,
  amount_cents integer not null,
  credits_purchased integer not null,
  status text not null default 'pending'::text,
  payment_link text null,
  created_at timestamp with time zone null default now(),
  constraint payments_pkey primary key (id),
  constraint payments_dodo_payment_id_key unique (dodo_payment_id),
  constraint payments_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_payments_user_id on public.payments using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_payments_dodo_payment_id on public.payments using btree (dodo_payment_id) TABLESPACE pg_default;

create table public.user_profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  email text not null,
  name text null,
  credits integer null default 0,
  created_at timestamp with time zone null default now(),
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_user_id_key unique (user_id),
  constraint user_profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_user_profiles_credits on public.user_profiles using btree (credits) TABLESPACE pg_default;

create index IF not exists idx_user_profiles_user_id on public.user_profiles using btree (user_id) TABLESPACE pg_default;


create table public.webhook_events (
  id uuid not null default gen_random_uuid (),
  event_id text not null,
  event_type text not null,
  payment_id uuid null,
  processed boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint webhook_events_pkey primary key (id),
  constraint webhook_events_event_id_key unique (event_id),
  constraint webhook_events_payment_id_fkey foreign KEY (payment_id) references payments (id)
) TABLESPACE pg_default;

create index IF not exists idx_webhook_events_event_id on public.webhook_events using btree (event_id) TABLESPACE pg_default;

create index IF not exists idx_webhook_events_processed on public.webhook_events using btree (processed) TABLESPACE pg_default;
