alter table public.events
  drop constraint if exists events_event_date_reasonable,
  add constraint events_event_date_reasonable
    check (event_date between date '2000-01-01' and date '2100-12-31');
