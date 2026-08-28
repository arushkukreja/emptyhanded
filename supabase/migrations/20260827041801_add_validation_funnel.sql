create table if not exists public.launch_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_path text,
  consent_scope text not null default 'product_updates',
  consent_at timestamptz not null default now(),
  converted_user_id uuid references auth.users(id) on delete set null,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint launch_leads_email_normalized check (email = lower(email)),
  constraint launch_leads_email_length check (char_length(email) between 3 and 320),
  constraint launch_leads_email_shape check (email like '%_@_%._%'),
  constraint launch_leads_email_unique unique (email)
);

create index if not exists launch_leads_created_at_idx
  on public.launch_leads (created_at desc);

create index if not exists launch_leads_converted_user_id_idx
  on public.launch_leads (converted_user_id)
  where converted_user_id is not null;

alter table public.launch_leads enable row level security;

revoke all on table public.launch_leads from anon, authenticated;
grant select, insert, update, delete on table public.launch_leads to service_role;

comment on table public.launch_leads is
  'Server-managed launch and waitlist leads with campaign attribution and signup conversion.';
