create table if not exists public.media_uploads (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket_id text not null check (bucket_id = 'profile-images'),
  object_path text not null,
  scope text not null check (scope in ('self', 'recipients')),
  size_bytes bigint not null check (size_bytes between 1 and 5242880),
  status text not null default 'reserved'
    check (status in ('reserved', 'completed', 'failed', 'deleted')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  finished_at timestamptz,
  unique (bucket_id, object_path)
);

create index if not exists media_uploads_user_active_idx
  on public.media_uploads (user_id, created_at desc)
  where status in ('reserved', 'completed');

create index if not exists media_uploads_user_rate_idx
  on public.media_uploads (user_id, created_at desc);

alter table public.media_uploads enable row level security;

revoke all on table public.media_uploads from public, anon, authenticated;
revoke all on sequence public.media_uploads_id_seq from public, anon, authenticated;
grant select, insert, update on table public.media_uploads to service_role;
grant usage, select on sequence public.media_uploads_id_seq to service_role;

create or replace function public.reserve_media_upload(
  p_user_id uuid,
  p_bucket_id text,
  p_object_path text,
  p_scope text,
  p_size_bytes bigint
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  active_count bigint;
  active_bytes bigint;
  recent_attempts bigint;
begin
  if p_bucket_id <> 'profile-images'
    or p_scope not in ('self', 'recipients')
    or p_object_path not like p_user_id::text || '/' || p_scope || '/%'
    or p_size_bytes < 1
    or p_size_bytes > 5242880 then
    raise exception using errcode = '22023', message = 'invalid_media_upload';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text, 240829)
  );

  select count(*)
  into recent_attempts
  from public.media_uploads
  where user_id = p_user_id
    and created_at >= pg_catalog.now() - interval '10 minutes';

  if recent_attempts >= 6 then
    raise exception using errcode = 'P0001', message = 'media_upload_rate_limit';
  end if;

  select count(*), coalesce(sum(size_bytes), 0)
  into active_count, active_bytes
  from public.media_uploads
  where user_id = p_user_id
    and status in ('reserved', 'completed');

  if active_count >= 50 then
    raise exception using errcode = 'P0001', message = 'media_upload_count_limit';
  end if;

  if active_bytes + p_size_bytes > 104857600 then
    raise exception using errcode = 'P0001', message = 'media_upload_storage_limit';
  end if;

  insert into public.media_uploads (
    user_id,
    bucket_id,
    object_path,
    scope,
    size_bytes
  ) values (
    p_user_id,
    p_bucket_id,
    p_object_path,
    p_scope,
    p_size_bytes
  );
end;
$$;

create or replace function public.complete_media_upload(
  p_user_id uuid,
  p_bucket_id text,
  p_object_path text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.media_uploads
  set status = 'completed',
      completed_at = pg_catalog.now(),
      finished_at = pg_catalog.now()
  where user_id = p_user_id
    and bucket_id = p_bucket_id
    and object_path = p_object_path
    and status = 'reserved';

  if not found then
    raise exception using errcode = 'P0001', message = 'media_upload_reservation_not_found';
  end if;
end;
$$;

create or replace function public.fail_media_upload(
  p_user_id uuid,
  p_bucket_id text,
  p_object_path text
)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.media_uploads
  set status = 'failed',
      finished_at = pg_catalog.now()
  where user_id = p_user_id
    and bucket_id = p_bucket_id
    and object_path = p_object_path
    and status = 'reserved';
$$;

create or replace function public.delete_media_upload(
  p_user_id uuid,
  p_bucket_id text,
  p_object_path text
)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.media_uploads
  set status = 'deleted',
      finished_at = pg_catalog.now()
  where user_id = p_user_id
    and bucket_id = p_bucket_id
    and object_path = p_object_path
    and status in ('reserved', 'completed');
$$;

revoke execute on function public.reserve_media_upload(uuid, text, text, text, bigint)
  from public, anon, authenticated;
revoke execute on function public.complete_media_upload(uuid, text, text)
  from public, anon, authenticated;
revoke execute on function public.fail_media_upload(uuid, text, text)
  from public, anon, authenticated;
revoke execute on function public.delete_media_upload(uuid, text, text)
  from public, anon, authenticated;

grant execute on function public.reserve_media_upload(uuid, text, text, text, bigint)
  to service_role;
grant execute on function public.complete_media_upload(uuid, text, text)
  to service_role;
grant execute on function public.fail_media_upload(uuid, text, text)
  to service_role;
grant execute on function public.delete_media_upload(uuid, text, text)
  to service_role;

insert into public.media_uploads (
  user_id,
  bucket_id,
  object_path,
  scope,
  size_bytes,
  status,
  created_at,
  completed_at,
  finished_at
)
select
  auth_user.id,
  object.bucket_id,
  object.name,
  case split_part(object.name, '/', 2)
    when 'self' then 'self'
    else 'recipients'
  end,
  greatest(1, least(5242880, coalesce((object.metadata->>'size')::bigint, 1))),
  'completed',
  coalesce(object.created_at, now()),
  coalesce(object.created_at, now()),
  coalesce(object.created_at, now())
from storage.objects as object
join auth.users as auth_user
  on auth_user.id::text = split_part(object.name, '/', 1)
where object.bucket_id = 'profile-images'
on conflict (bucket_id, object_path) do nothing;
