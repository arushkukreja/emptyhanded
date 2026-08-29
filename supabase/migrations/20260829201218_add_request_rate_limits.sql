create table public.ai_generation_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  operation text not null check (operation in ('create', 'regenerate')),
  status text not null default 'reserved'
    check (status in ('reserved', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create index ai_generation_requests_user_created_idx
  on public.ai_generation_requests (user_id, created_at desc);

create index ai_generation_requests_event_created_idx
  on public.ai_generation_requests (event_id, created_at desc);

alter table public.ai_generation_requests enable row level security;

revoke all on table public.ai_generation_requests from public, anon, authenticated;
revoke all on sequence public.ai_generation_requests_id_seq from public, anon, authenticated;
grant select, insert, update on table public.ai_generation_requests to service_role;
grant usage, select on sequence public.ai_generation_requests_id_seq to service_role;

create or replace function public.reserve_ai_generation(
  p_user_id uuid,
  p_event_id uuid,
  p_operation text
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  attempts_last_ten_minutes bigint;
  attempts_last_day bigint;
  request_id bigint;
begin
  if p_operation not in ('create', 'regenerate') then
    raise exception using errcode = '22023', message = 'invalid_ai_generation_operation';
  end if;

  if not exists (
    select 1
    from public.events
    where id = p_event_id
      and user_id = p_user_id
  ) then
    raise exception using errcode = 'P0001', message = 'ai_generation_event_not_found';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text, 24082901)
  );

  select
    count(*) filter (
      where created_at >= pg_catalog.now() - interval '10 minutes'
    ),
    count(*)
  into attempts_last_ten_minutes, attempts_last_day
  from public.ai_generation_requests
  where user_id = p_user_id
    and created_at >= pg_catalog.now() - interval '24 hours';

  if attempts_last_ten_minutes >= 6 then
    raise exception using errcode = 'P0001', message = 'ai_generation_burst_limit';
  end if;

  if attempts_last_day >= 30 then
    raise exception using errcode = 'P0001', message = 'ai_generation_daily_limit';
  end if;

  insert into public.ai_generation_requests (
    user_id,
    event_id,
    operation
  ) values (
    p_user_id,
    p_event_id,
    p_operation
  )
  returning id into request_id;

  return request_id;
end;
$$;

create or replace function public.finish_ai_generation(
  p_request_id bigint,
  p_user_id uuid,
  p_status text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_status not in ('completed', 'failed') then
    raise exception using errcode = '22023', message = 'invalid_ai_generation_status';
  end if;

  update public.ai_generation_requests
  set status = p_status,
      finished_at = pg_catalog.now()
  where id = p_request_id
    and user_id = p_user_id
    and status = 'reserved';

  if not found then
    raise exception using errcode = 'P0001', message = 'ai_generation_reservation_not_found';
  end if;
end;
$$;

revoke execute on function public.reserve_ai_generation(uuid, uuid, text)
  from public, anon, authenticated;
revoke execute on function public.finish_ai_generation(bigint, uuid, text)
  from public, anon, authenticated;

grant execute on function public.reserve_ai_generation(uuid, uuid, text)
  to service_role;
grant execute on function public.finish_ai_generation(bigint, uuid, text)
  to service_role;

create table public.lead_capture_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  email_hash text not null check (email_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

create index lead_capture_attempts_ip_created_idx
  on public.lead_capture_attempts (ip_hash, created_at desc);

create index lead_capture_attempts_email_created_idx
  on public.lead_capture_attempts (email_hash, created_at desc);

alter table public.lead_capture_attempts enable row level security;

revoke all on table public.lead_capture_attempts from public, anon, authenticated;
revoke all on sequence public.lead_capture_attempts_id_seq from public, anon, authenticated;
grant select, insert on table public.lead_capture_attempts to service_role;
grant usage, select on sequence public.lead_capture_attempts_id_seq to service_role;

create or replace function public.reserve_lead_capture(
  p_ip_hash text,
  p_email_hash text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  ip_attempts_last_ten_minutes bigint;
  ip_attempts_last_day bigint;
  email_attempts_last_hour bigint;
begin
  if p_ip_hash !~ '^[0-9a-f]{64}$'
    or p_email_hash !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = '22023', message = 'invalid_lead_rate_limit_identifier';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_ip_hash, 24082902)
  );
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_email_hash, 24082903)
  );

  select
    count(*) filter (
      where created_at >= pg_catalog.now() - interval '10 minutes'
    ),
    count(*)
  into ip_attempts_last_ten_minutes, ip_attempts_last_day
  from public.lead_capture_attempts
  where ip_hash = p_ip_hash
    and created_at >= pg_catalog.now() - interval '24 hours';

  if ip_attempts_last_ten_minutes >= 10 then
    raise exception using errcode = 'P0001', message = 'lead_ip_burst_limit';
  end if;

  if ip_attempts_last_day >= 50 then
    raise exception using errcode = 'P0001', message = 'lead_ip_daily_limit';
  end if;

  select count(*)
  into email_attempts_last_hour
  from public.lead_capture_attempts
  where email_hash = p_email_hash
    and created_at >= pg_catalog.now() - interval '1 hour';

  if email_attempts_last_hour >= 5 then
    raise exception using errcode = 'P0001', message = 'lead_email_rate_limit';
  end if;

  insert into public.lead_capture_attempts (ip_hash, email_hash)
  values (p_ip_hash, p_email_hash);
end;
$$;

revoke execute on function public.reserve_lead_capture(text, text)
  from public, anon, authenticated;

grant execute on function public.reserve_lead_capture(text, text)
  to service_role;
