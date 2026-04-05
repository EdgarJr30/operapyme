-- ─────────────────────────────────────────────────────────────────────────────
-- Invoice edit and cancel with contable reversal
--
-- Changes:
--   1. Add 'cancelled' to invoices.status check constraint
--   2. Add reversal_of_invoice_id self-reference column + index
--   3. Update move_invoice_status to block transitions from cancelled
--   4. New RPC: update_invoice  (edits draft or issued invoices)
--   5. New RPC: cancel_invoice  (cancels paid invoice + creates reversal)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Extend status check constraint to include 'cancelled'
-- Drop whatever auto-generated name PostgreSQL gave the inline check.
do $$
declare
  cname text;
begin
  select conname into cname
  from pg_constraint
  where conrelid = 'public.invoices'::regclass
    and contype = 'c'
    and conname like '%status%';

  if cname is not null then
    execute format('alter table public.invoices drop constraint %I', cname);
  end if;
end;
$$;

alter table public.invoices
  add constraint invoices_status_check
  check (status in ('draft', 'issued', 'paid', 'void', 'cancelled'));

-- 2. Self-reference column for reversal notes
alter table public.invoices
  add column if not exists reversal_of_invoice_id uuid
  references public.invoices (id) on delete set null;

create index if not exists invoices_reversal_of_invoice_id_idx
  on public.invoices (reversal_of_invoice_id)
  where reversal_of_invoice_id is not null;

-- 3. Prevent any status change on a cancelled invoice
create or replace function public.move_invoice_status(
  target_tenant_id uuid,
  target_invoice_id uuid,
  target_status text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_status text := lower(trim(coalesce(target_status, '')));
  current_status     text;
  updated_invoice_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'invoice.write') then
    raise exception 'You do not have permission to update invoices for this tenant';
  end if;

  if normalized_status not in ('draft', 'issued', 'paid', 'void') then
    raise exception 'Invoice status is invalid';
  end if;

  select status into current_status
  from public.invoices
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  if current_status is null then
    raise exception 'Invoice not found';
  end if;

  if current_status = 'cancelled' then
    raise exception 'Cannot change the status of a cancelled invoice';
  end if;

  update public.invoices
  set status = normalized_status,
      issued_on = case
        when normalized_status = 'issued' and issued_on is null then current_date
        else issued_on
      end,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_invoice_id
  returning id into updated_invoice_id;

  return updated_invoice_id;
end;
$$;

-- 4. update_invoice — edit header + line items of a draft or issued invoice
create or replace function public.update_invoice(
  target_tenant_id               uuid,
  target_invoice_id              uuid,
  target_title                   text,
  target_document_kind           text,
  target_currency_code           text,
  target_recipient_kind          text,
  target_line_items              jsonb,
  target_document_discount_total numeric default 0,
  target_customer_id             uuid    default null,
  target_lead_id                 uuid    default null,
  target_recipient_display_name  text    default null,
  target_recipient_contact_name  text    default null,
  target_recipient_email         text    default null,
  target_recipient_whatsapp      text    default null,
  target_recipient_phone         text    default null,
  target_issued_on               date    default null,
  target_due_on                  date    default null,
  target_notes                   text    default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_status                  text;
  normalized_title                text    := nullif(btrim(target_title), '');
  normalized_currency             text    := upper(nullif(btrim(target_currency_code), ''));
  normalized_document_kind        text    := nullif(btrim(target_document_kind), '');
  normalized_recipient_kind       text    := nullif(btrim(target_recipient_kind), '');
  normalized_recipient_display_name text  := nullif(btrim(target_recipient_display_name), '');
  normalized_recipient_contact_name text  := nullif(btrim(target_recipient_contact_name), '');
  normalized_recipient_email      text    := nullif(btrim(target_recipient_email), '');
  normalized_recipient_whatsapp   text    := nullif(btrim(target_recipient_whatsapp), '');
  normalized_recipient_phone      text    := nullif(btrim(target_recipient_phone), '');
  normalized_notes                text    := nullif(btrim(target_notes), '');
  normalized_document_discount    numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  resolved_customer_id            uuid;
  resolved_lead_id                uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email        text;
  resolved_recipient_whatsapp     text;
  resolved_recipient_phone        text;
  computed_subtotal               numeric;
  computed_line_discount_total    numeric;
  computed_tax_total              numeric;
  computed_grand_total            numeric;
  computed_total_discount         numeric;
  discountable_subtotal           numeric;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'invoice.write') then
    raise exception 'You do not have permission to update invoices for this tenant';
  end if;

  -- Validate invoice exists and is editable
  select status into current_status
  from public.invoices
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  if current_status is null then
    raise exception 'Invoice not found';
  end if;

  if current_status not in ('draft', 'issued') then
    raise exception 'Only draft or issued invoices can be edited';
  end if;

  -- Validate inputs
  if normalized_title is null or length(normalized_title) < 2 then
    raise exception 'Invoice title is required';
  end if;

  if normalized_currency is null or length(normalized_currency) <> 3 then
    raise exception 'Currency code must have exactly 3 letters';
  end if;

  if normalized_document_kind is null or normalized_document_kind not in ('items', 'services') then
    raise exception 'Invoice document kind is invalid';
  end if;

  if normalized_document_discount < 0 then
    raise exception 'Document discount cannot be negative';
  end if;

  -- Resolve recipient
  if normalized_recipient_kind = 'customer' then
    select
      c.id,
      c.display_name,
      c.contact_name,
      c.email,
      c.whatsapp,
      c.phone
    into
      resolved_customer_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.customers c
    where c.id = target_customer_id
      and c.tenant_id = target_tenant_id;

    if resolved_customer_id is null then
      raise exception 'Customer does not belong to the active tenant';
    end if;

  elsif normalized_recipient_kind = 'lead' then
    select
      l.id,
      l.display_name,
      l.contact_name,
      l.email,
      l.whatsapp,
      l.phone
    into
      resolved_lead_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.leads l
    where l.id = target_lead_id
      and l.tenant_id = target_tenant_id;

    if resolved_lead_id is null then
      raise exception 'Lead does not belong to the active tenant';
    end if;

  elsif normalized_recipient_kind = 'ad_hoc' then
    resolved_customer_id := null;
    resolved_lead_id     := null;
  else
    raise exception 'Invoice recipient kind is invalid';
  end if;

  resolved_recipient_display_name := coalesce(normalized_recipient_display_name, resolved_recipient_display_name);
  resolved_recipient_contact_name := coalesce(normalized_recipient_contact_name, resolved_recipient_contact_name);
  resolved_recipient_email        := coalesce(normalized_recipient_email,        resolved_recipient_email);
  resolved_recipient_whatsapp     := coalesce(normalized_recipient_whatsapp,     resolved_recipient_whatsapp);
  resolved_recipient_phone        := coalesce(normalized_recipient_phone,        resolved_recipient_phone);

  if resolved_recipient_display_name is null or length(resolved_recipient_display_name) < 2 then
    raise exception 'Recipient display name is required';
  end if;

  -- Replace line items and get new totals
  select subtotal, discount_total, tax_total, grand_total
  into computed_subtotal, computed_line_discount_total, computed_tax_total, computed_grand_total
  from public.replace_invoice_line_items(
    target_tenant_id,
    target_invoice_id,
    target_line_items,
    auth.uid()
  );

  discountable_subtotal := round((computed_subtotal - computed_line_discount_total)::numeric, 2);

  if normalized_document_discount > discountable_subtotal then
    raise exception 'Document discount cannot exceed invoice subtotal after line discounts';
  end if;

  computed_total_discount := round((computed_line_discount_total + normalized_document_discount)::numeric, 2);
  computed_grand_total    := round((computed_subtotal - computed_total_discount + computed_tax_total)::numeric, 2);

  -- Update invoice header + totals
  update public.invoices
  set customer_id               = resolved_customer_id,
      lead_id                   = resolved_lead_id,
      recipient_kind            = normalized_recipient_kind,
      recipient_display_name    = resolved_recipient_display_name,
      recipient_contact_name    = resolved_recipient_contact_name,
      recipient_email           = resolved_recipient_email,
      recipient_whatsapp        = resolved_recipient_whatsapp,
      recipient_phone           = resolved_recipient_phone,
      title                     = normalized_title,
      document_kind             = normalized_document_kind,
      currency_code             = normalized_currency,
      issued_on                 = target_issued_on,
      due_on                    = target_due_on,
      notes                     = normalized_notes,
      subtotal                  = computed_subtotal,
      discount_total            = computed_total_discount,
      tax_total                 = computed_tax_total,
      grand_total               = computed_grand_total,
      updated_at                = timezone('utc', now()),
      updated_by                = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  return target_invoice_id;
end;
$$;

-- 5. cancel_invoice — cancels a paid invoice and auto-creates its reversal note
create or replace function public.cancel_invoice(
  target_tenant_id   uuid,
  target_invoice_id  uuid,
  p_cancel_reason    text
)
returns table (
  cancelled_invoice_id   uuid,
  reversal_invoice_id    uuid,
  reversal_invoice_number text
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_status           text;
  original                 public.invoices%rowtype;
  reversal_id              uuid := gen_random_uuid();
  reversal_number          text;
  normalized_cancel_reason text := nullif(btrim(p_cancel_reason), '');
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'invoice.write') then
    raise exception 'You do not have permission to update invoices for this tenant';
  end if;

  if normalized_cancel_reason is null or length(normalized_cancel_reason) < 10 then
    raise exception 'A cancellation reason of at least 10 characters is required';
  end if;

  -- Load original invoice
  select * into original
  from public.invoices
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  if not found then
    raise exception 'Invoice not found';
  end if;

  if original.status <> 'paid' then
    raise exception 'Only paid invoices can be cancelled';
  end if;

  -- 1. Mark original as cancelled
  update public.invoices
  set status     = 'cancelled',
      notes      = coalesce(notes || e'\n', '') || '[Cancelada] ' || normalized_cancel_reason,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  -- 2. Allocate a new sequential number for the reversal
  reversal_number := public.allocate_invoice_number(target_tenant_id);

  -- 3. Insert reversal invoice header with negated totals
  --    grand_total = -(original.grand_total) preserves the contable identity:
  --    original + reversal = 0
  insert into public.invoices (
    id,
    tenant_id,
    source_quote_id,
    customer_id,
    lead_id,
    recipient_kind,
    recipient_display_name,
    recipient_contact_name,
    recipient_email,
    recipient_whatsapp,
    recipient_phone,
    invoice_number,
    title,
    document_kind,
    status,
    currency_code,
    subtotal,
    discount_total,
    tax_total,
    grand_total,
    issued_on,
    due_on,
    notes,
    reversal_of_invoice_id,
    created_by,
    updated_by
  )
  values (
    reversal_id,
    target_tenant_id,
    null,                                    -- not linked to original quote
    original.customer_id,
    original.lead_id,
    original.recipient_kind,
    original.recipient_display_name,
    original.recipient_contact_name,
    original.recipient_email,
    original.recipient_whatsapp,
    original.recipient_phone,
    reversal_number,
    original.title,
    original.document_kind,
    'issued',                                -- reversal is immediately issued
    original.currency_code,
    -(original.subtotal),
    -(original.discount_total),
    -(original.tax_total),
    -(original.grand_total),
    current_date,
    null,
    '[Reverso de ' || original.invoice_number || '] ' || normalized_cancel_reason,
    target_invoice_id,
    auth.uid(),
    auth.uid()
  );

  -- 4. Copy original line items to the reversal for traceability / PDF rendering.
  --    Quantities stay positive (they are informational; the negative invoice
  --    totals carry the contable meaning).
  insert into public.invoice_line_items (
    tenant_id,
    invoice_id,
    catalog_item_id,
    sort_order,
    item_name,
    item_description,
    quantity,
    unit_label,
    unit_price,
    discount_total,
    tax_total,
    line_subtotal,
    line_total,
    created_by,
    updated_by
  )
  select
    target_tenant_id,
    reversal_id,
    ili.catalog_item_id,
    ili.sort_order,
    ili.item_name,
    ili.item_description,
    ili.quantity,
    ili.unit_label,
    ili.unit_price,
    ili.discount_total,
    ili.tax_total,
    ili.line_subtotal,
    ili.line_total,
    auth.uid(),
    auth.uid()
  from public.invoice_line_items ili
  where ili.tenant_id = target_tenant_id
    and ili.invoice_id = target_invoice_id
  order by ili.sort_order;

  -- Return both identifiers so the caller can show the reversal number
  cancelled_invoice_id    := target_invoice_id;
  reversal_invoice_id     := reversal_id;
  reversal_invoice_number := reversal_number;
  return next;
end;
$$;

-- Grants
revoke all on function public.move_invoice_status(uuid, uuid, text) from public;
grant execute on function public.move_invoice_status(uuid, uuid, text) to authenticated;

revoke all on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text, text, text, text, date, date, text) from public;
grant execute on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text, text, text, text, date, date, text) to authenticated;

revoke all on function public.cancel_invoice(uuid, uuid, text) from public;
grant execute on function public.cancel_invoice(uuid, uuid, text) to authenticated;
