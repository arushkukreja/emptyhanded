alter table public.recipient_profiles
  add column if not exists age smallint;

alter table public.recipient_profiles
  drop constraint if exists recipient_profiles_age_check;

alter table public.recipient_profiles
  add constraint recipient_profiles_age_check
  check (age is null or age between 0 and 120);
