alter table public.products
  add column if not exists age_group text;

create index if not exists products_age_group_idx
  on public.products (age_group);

alter table public.products enable row level security;

grant usage on schema public to anon;
grant select on public.products to anon;

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select
  to anon
  using (true);
