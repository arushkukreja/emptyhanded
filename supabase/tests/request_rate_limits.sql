begin;

do $$
begin
  if has_table_privilege('anon', 'public.ai_generation_requests', 'select')
    or has_table_privilege('authenticated', 'public.ai_generation_requests', 'select')
    or has_table_privilege('anon', 'public.lead_capture_attempts', 'select')
    or has_table_privilege('authenticated', 'public.lead_capture_attempts', 'select') then
    raise exception 'rate-limit ledgers must not be readable by browser roles';
  end if;

  if has_function_privilege(
    'anon',
    'public.reserve_ai_generation(uuid,uuid,text)',
    'execute'
  ) or has_function_privilege(
    'authenticated',
    'public.reserve_ai_generation(uuid,uuid,text)',
    'execute'
  ) or has_function_privilege(
    'anon',
    'public.reserve_lead_capture(text,text)',
    'execute'
  ) or has_function_privilege(
    'authenticated',
    'public.reserve_lead_capture(text,text)',
    'execute'
  ) then
    raise exception 'rate-limit reservation functions must remain server-only';
  end if;

  if not has_function_privilege(
    'service_role',
    'public.reserve_ai_generation(uuid,uuid,text)',
    'execute'
  ) or not has_function_privilege(
    'service_role',
    'public.reserve_lead_capture(text,text)',
    'execute'
  ) then
    raise exception 'service_role must be able to reserve protected requests';
  end if;
end;
$$;

rollback;
