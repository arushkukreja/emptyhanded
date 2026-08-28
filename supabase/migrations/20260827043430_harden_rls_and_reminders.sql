-- Restrict direct Data API privileges to only the operations the browser uses.
-- Subscription fields are server-managed, so authenticated users can read but
-- cannot update public.users.
revoke all privileges on table public.users from anon, authenticated;
revoke all privileges on table public.events from anon, authenticated;
revoke all privileges on table public.recipient_profiles from anon, authenticated;
revoke all privileges on table public.recommendations from anon, authenticated;
revoke all privileges on table public.products from anon, authenticated;
revoke all privileges on table public.reminders_sent from anon, authenticated;
revoke all privileges on table public.launch_leads from anon, authenticated;

grant select on table public.users to authenticated;
grant select, insert, update, delete on table public.events to authenticated;
grant select, insert, update, delete on table public.recipient_profiles to authenticated;
grant select, insert, update, delete on table public.recommendations to authenticated;
grant select on table public.products to authenticated;

grant all privileges on table public.users to service_role;
grant all privileges on table public.events to service_role;
grant all privileges on table public.recipient_profiles to service_role;
grant all privileges on table public.recommendations to service_role;
grant all privileges on table public.products to service_role;
grant all privileges on table public.reminders_sent to service_role;
grant all privileges on table public.launch_leads to service_role;

-- auth.uid() is wrapped in a scalar subquery so Postgres evaluates it once per
-- statement rather than once per row.
drop policy if exists "users_select_self" on public.users;
create policy "users_select_self" on public.users
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "users_update_self" on public.users;

drop policy if exists "events_select_own" on public.events;
create policy "events_select_own" on public.events
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "events_update_own" on public.events;
create policy "events_update_own" on public.events
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own" on public.events
  for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "rp_select_own" on public.recipient_profiles;
create policy "rp_select_own" on public.recipient_profiles
  for select to authenticated
  using (exists (
    select 1 from public.events e
    where e.id = recipient_profiles.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "rp_insert_own" on public.recipient_profiles;
create policy "rp_insert_own" on public.recipient_profiles
  for insert to authenticated
  with check (exists (
    select 1 from public.events e
    where e.id = recipient_profiles.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "rp_update_own" on public.recipient_profiles;
create policy "rp_update_own" on public.recipient_profiles
  for update to authenticated
  using (exists (
    select 1 from public.events e
    where e.id = recipient_profiles.event_id
      and e.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.events e
    where e.id = recipient_profiles.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "rp_delete_own" on public.recipient_profiles;
create policy "rp_delete_own" on public.recipient_profiles
  for delete to authenticated
  using (exists (
    select 1 from public.events e
    where e.id = recipient_profiles.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "rec_select_own" on public.recommendations;
create policy "rec_select_own" on public.recommendations
  for select to authenticated
  using (exists (
    select 1 from public.events e
    where e.id = recommendations.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "rec_insert_own" on public.recommendations;
create policy "rec_insert_own" on public.recommendations
  for insert to authenticated
  with check (exists (
    select 1 from public.events e
    where e.id = recommendations.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "rec_update_own" on public.recommendations;
create policy "rec_update_own" on public.recommendations
  for update to authenticated
  using (exists (
    select 1 from public.events e
    where e.id = recommendations.event_id
      and e.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.events e
    where e.id = recommendations.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "rec_delete_own" on public.recommendations;
create policy "rec_delete_own" on public.recommendations
  for delete to authenticated
  using (exists (
    select 1 from public.events e
    where e.id = recommendations.event_id
      and e.user_id = (select auth.uid())
  ));

drop policy if exists "products_select_auth" on public.products;
create policy "products_select_auth" on public.products
  for select to authenticated
  using (true);

-- Enforce one recorded reminder per event even if multiple cron invocations race.
create unique index if not exists reminders_sent_event_unique_idx
  on public.reminders_sent(event_id);
