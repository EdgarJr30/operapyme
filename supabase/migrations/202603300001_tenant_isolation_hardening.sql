create or replace function public.prevent_tenant_reassignment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.tenant_id is distinct from old.tenant_id then
    raise exception 'tenant_id is immutable once inserted';
  end if;

  return new;
end;
$$;

alter table public.customers
  add constraint customers_tenant_id_id_key unique (tenant_id, id);

alter table public.leads
  add constraint leads_tenant_id_id_key unique (tenant_id, id);

alter table public.catalog_items
  add constraint catalog_items_tenant_id_id_key unique (tenant_id, id);

alter table public.quotes
  add constraint quotes_tenant_id_id_key unique (tenant_id, id);

alter table public.quotes
  drop constraint if exists quotes_customer_id_fkey,
  drop constraint if exists quotes_lead_id_fkey,
  add constraint quotes_customer_id_tenant_id_fkey
    foreign key (tenant_id, customer_id)
    references public.customers (tenant_id, id)
    on delete restrict,
  add constraint quotes_lead_id_tenant_id_fkey
    foreign key (tenant_id, lead_id)
    references public.leads (tenant_id, id)
    on delete set null;

alter table public.quote_line_items
  drop constraint if exists quote_line_items_quote_id_fkey,
  drop constraint if exists quote_line_items_catalog_item_id_fkey,
  add constraint quote_line_items_quote_id_tenant_id_fkey
    foreign key (tenant_id, quote_id)
    references public.quotes (tenant_id, id)
    on delete cascade,
  add constraint quote_line_items_catalog_item_id_tenant_id_fkey
    foreign key (tenant_id, catalog_item_id)
    references public.catalog_items (tenant_id, id)
    on delete set null;

drop trigger if exists customers_prevent_tenant_reassignment on public.customers;
create trigger customers_prevent_tenant_reassignment
before update on public.customers
for each row
execute function public.prevent_tenant_reassignment();

drop trigger if exists leads_prevent_tenant_reassignment on public.leads;
create trigger leads_prevent_tenant_reassignment
before update on public.leads
for each row
execute function public.prevent_tenant_reassignment();

drop trigger if exists catalog_items_prevent_tenant_reassignment on public.catalog_items;
create trigger catalog_items_prevent_tenant_reassignment
before update on public.catalog_items
for each row
execute function public.prevent_tenant_reassignment();

drop trigger if exists quotes_prevent_tenant_reassignment on public.quotes;
create trigger quotes_prevent_tenant_reassignment
before update on public.quotes
for each row
execute function public.prevent_tenant_reassignment();

drop trigger if exists quote_line_items_prevent_tenant_reassignment on public.quote_line_items;
create trigger quote_line_items_prevent_tenant_reassignment
before update on public.quote_line_items
for each row
execute function public.prevent_tenant_reassignment();

drop trigger if exists quote_number_sequences_prevent_tenant_reassignment on public.quote_number_sequences;
create trigger quote_number_sequences_prevent_tenant_reassignment
before update on public.quote_number_sequences
for each row
execute function public.prevent_tenant_reassignment();
