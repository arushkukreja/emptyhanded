alter table public.users
  add column if not exists email_reminders_enabled boolean not null default true;

comment on column public.users.email_reminders_enabled is
  'Controls optional occasion reminder emails. Authentication and security emails are unaffected.';
