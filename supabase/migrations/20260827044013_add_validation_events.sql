create table if not exists public.validation_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null check (event_name in (
    'account_created',
    'occasion_created',
    'recommendation_saved',
    'checkout_started',
    'subscription_activated'
  )),
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, event_name)
);

create index if not exists validation_events_created_at_idx
  on public.validation_events(created_at desc);

alter table public.validation_events enable row level security;
revoke all privileges on table public.validation_events from anon, authenticated;
grant all privileges on table public.validation_events to service_role;
