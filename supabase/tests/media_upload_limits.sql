begin;

do $$
begin
  if has_table_privilege('anon', 'public.media_uploads', 'select')
    or has_table_privilege('authenticated', 'public.media_uploads', 'select') then
    raise exception 'media_uploads must not be readable by browser roles';
  end if;

  if has_function_privilege(
    'anon',
    'public.reserve_media_upload(uuid,text,text,text,bigint)',
    'execute'
  ) or has_function_privilege(
    'authenticated',
    'public.reserve_media_upload(uuid,text,text,text,bigint)',
    'execute'
  ) then
    raise exception 'media upload reservation must remain server-only';
  end if;

  if not has_function_privilege(
    'service_role',
    'public.reserve_media_upload(uuid,text,text,text,bigint)',
    'execute'
  ) then
    raise exception 'service_role must be able to reserve media uploads';
  end if;
end;
$$;

rollback;
