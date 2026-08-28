drop policy if exists "products_select_public" on public.products;

-- The unique index added in the previous migration also supports event_id lookups.
drop index if exists public.reminders_sent_event_idx;
