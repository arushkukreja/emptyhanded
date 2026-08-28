alter table public.users
  add column if not exists display_name text,
  add column if not exists avatar_path text,
  add column if not exists is_admin boolean not null default false;

alter table public.recipient_profiles
  add column if not exists avatar_path text;

update public.users as profile
set display_name = coalesce(
  profile.display_name,
  nullif(auth_user.raw_user_meta_data->>'full_name', ''),
  nullif(auth_user.raw_user_meta_data->>'name', '')
)
from auth.users as auth_user
where auth_user.id = profile.id;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('profile-images', 'profile-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), nullif(new.raw_user_meta_data->>'name', ''))
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(public.users.display_name, excluded.display_name);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
