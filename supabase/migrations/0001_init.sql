-- EmptyHanded initial schema

create extension if not exists "pgcrypto";

-- users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  stripe_customer_id text,
  subscription_status text not null default 'free'
    check (subscription_status in ('free','active','canceled','past_due')),
  created_at timestamptz not null default now()
);

-- events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occasion_type text not null
    check (occasion_type in ('birthday','anniversary','wedding','baby_shower','graduation','housewarming','holiday')),
  event_date date not null,
  recipient_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists events_user_date_idx on public.events(user_id, event_date);

-- recipient_profiles
create table if not exists public.recipient_profiles (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references public.events(id) on delete cascade,
  relationship text,
  age_range text,
  gender text,
  archetypes text[] not null default '{}',
  interests text,
  budget_tier text,
  past_gifts text,
  created_at timestamptz not null default now()
);

-- recommendations
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  product_name text not null,
  asin text,
  amazon_url text not null,
  budget_range text,
  reason text,
  is_saved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists recommendations_event_saved_idx on public.recommendations(event_id, is_saved);

-- products (admin catalog)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  asin text unique not null,
  name text not null,
  category text,
  archetype_tags text[] not null default '{}',
  budget_tier text,
  image_url text,
  amazon_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists products_archetype_gin_idx on public.products using gin (archetype_tags);
create index if not exists products_budget_idx on public.products(budget_tier);

-- reminders_sent (idempotency)
create table if not exists public.reminders_sent (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  sent_at timestamptz not null default now()
);

create index if not exists reminders_sent_event_idx on public.reminders_sent(event_id);

-- RLS
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.recipient_profiles enable row level security;
alter table public.recommendations enable row level security;
alter table public.products enable row level security;
alter table public.reminders_sent enable row level security;

-- users policies
drop policy if exists "users_select_self" on public.users;
create policy "users_select_self" on public.users
  for select using (auth.uid() = id);
drop policy if exists "users_update_self" on public.users;
create policy "users_update_self" on public.users
  for update using (auth.uid() = id);

-- events policies
drop policy if exists "events_select_own" on public.events;
create policy "events_select_own" on public.events
  for select using (auth.uid() = user_id);
drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = user_id);
drop policy if exists "events_update_own" on public.events;
create policy "events_update_own" on public.events
  for update using (auth.uid() = user_id);
drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own" on public.events
  for delete using (auth.uid() = user_id);

-- recipient_profiles policies (event ownership)
drop policy if exists "rp_select_own" on public.recipient_profiles;
create policy "rp_select_own" on public.recipient_profiles
  for select using (
    exists (select 1 from public.events e where e.id = recipient_profiles.event_id and e.user_id = auth.uid())
  );
drop policy if exists "rp_insert_own" on public.recipient_profiles;
create policy "rp_insert_own" on public.recipient_profiles
  for insert with check (
    exists (select 1 from public.events e where e.id = recipient_profiles.event_id and e.user_id = auth.uid())
  );
drop policy if exists "rp_update_own" on public.recipient_profiles;
create policy "rp_update_own" on public.recipient_profiles
  for update using (
    exists (select 1 from public.events e where e.id = recipient_profiles.event_id and e.user_id = auth.uid())
  );
drop policy if exists "rp_delete_own" on public.recipient_profiles;
create policy "rp_delete_own" on public.recipient_profiles
  for delete using (
    exists (select 1 from public.events e where e.id = recipient_profiles.event_id and e.user_id = auth.uid())
  );

-- recommendations policies (event ownership)
drop policy if exists "rec_select_own" on public.recommendations;
create policy "rec_select_own" on public.recommendations
  for select using (
    exists (select 1 from public.events e where e.id = recommendations.event_id and e.user_id = auth.uid())
  );
drop policy if exists "rec_insert_own" on public.recommendations;
create policy "rec_insert_own" on public.recommendations
  for insert with check (
    exists (select 1 from public.events e where e.id = recommendations.event_id and e.user_id = auth.uid())
  );
drop policy if exists "rec_update_own" on public.recommendations;
create policy "rec_update_own" on public.recommendations
  for update using (
    exists (select 1 from public.events e where e.id = recommendations.event_id and e.user_id = auth.uid())
  );
drop policy if exists "rec_delete_own" on public.recommendations;
create policy "rec_delete_own" on public.recommendations
  for delete using (
    exists (select 1 from public.events e where e.id = recommendations.event_id and e.user_id = auth.uid())
  );

-- products: read-only for authenticated
drop policy if exists "products_select_auth" on public.products;
create policy "products_select_auth" on public.products
  for select to authenticated using (true);

-- reminders_sent: no client policies; service-role bypasses RLS

-- handle_new_user trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
