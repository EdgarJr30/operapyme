create index if not exists invoices_source_quote_id_tenant_id_idx
on public.invoices (tenant_id, source_quote_id);

create index if not exists invoices_customer_id_tenant_id_idx
on public.invoices (tenant_id, customer_id);

create index if not exists invoices_lead_id_tenant_id_idx
on public.invoices (tenant_id, lead_id);

create index if not exists invoice_line_items_invoice_id_tenant_id_sort_order_idx
on public.invoice_line_items (tenant_id, invoice_id, sort_order);

create index if not exists invoice_line_items_catalog_item_id_tenant_id_idx
on public.invoice_line_items (tenant_id, catalog_item_id);

drop index if exists public.invoice_line_items_invoice_id_sort_order_idx;

create policy "invoice_number_sequences_no_direct_access"
on public.invoice_number_sequences
for all
to authenticated
using (false)
with check (false);
