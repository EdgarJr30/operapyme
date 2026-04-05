-- ─────────────────────────────────────────────────────────────────────────────
-- Fix reversal note immutability
--
-- The previous migration accidentally created a spurious 3-param overload of
-- move_invoice_status (without p_void_reason) instead of replacing the 4-param
-- version. This migration:
--   1. Drops the spurious 3-param overload.
--   2. Replaces the canonical 4-param move_invoice_status to also block
--      reversal notes (invoices with reversal_of_invoice_id IS NOT NULL).
--   3. Replaces update_invoice to also block reversal notes.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Drop spurious 3-param overload created by previous migration
drop function if exists public.move_invoice_status(uuid, uuid, text);

-- 2. Canonical move_invoice_status — blocks cancelled AND reversal notes
create or replace function public.move_invoice_status(
  target_tenant_id  uuid,
  target_invoice_id uuid,
  target_status     text,
  p_void_reason     text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_status text := lower(trim(coalesce(target_status, '')));
  normalized_reason text := nullif(btrim(coalesce(p_void_reason, '')), '');
  inv               public.invoices%rowtype;
  updated_id        uuid;
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

  select * into inv
  from public.invoices
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  if not found then
    raise exception 'Invoice not found';
  end if;

  if inv.status = 'cancelled' then
    raise exception 'Cannot change the status of a cancelled invoice';
  end if;

  if inv.reversal_of_invoice_id is not null then
    raise exception 'Reversal notes cannot be moved through the status pipeline';
  end if;

  if normalized_status = 'void' and normalized_reason is null then
    raise exception 'A void reason is required';
  end if;

  update public.invoices
  set status     = normalized_status,
      void_reason = case
        when normalized_status = 'void' then normalized_reason
        else void_reason
      end,
      issued_on  = case
        when normalized_status = 'issued' and issued_on is null then current_date
        else issued_on
      end,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_invoice_id
  returning id into updated_id;

  return updated_id;
end;
$$;

revoke all on function public.move_invoice_status(uuid, uuid, text, text) from public;
grant execute on function public.move_invoice_status(uuid, uuid, text, text) to authenticated;

-- 3. update_invoice — also block reversal notes
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
  inv                              public.invoices%rowtype;
  normalized_title                 text    := nullif(btrim(target_title), '');
  normalized_currency              text    := upper(nullif(btrim(target_currency_code), ''));
  normalized_document_kind         text    := nullif(btrim(target_document_kind), '');
  normalized_recipient_kind        text    := nullif(btrim(target_recipient_kind), '');
  normalized_recipient_display_name text   := nullif(btrim(target_recipient_display_name), '');
  normalized_recipient_contact_name text   := nullif(btrim(target_recipient_contact_name), '');
  normalized_recipient_email       text    := nullif(btrim(target_recipient_email), '');
  normalized_recipient_whatsapp    text    := nullif(btrim(target_recipient_whatsapp), '');
  normalized_recipient_phone       text    := nullif(btrim(target_recipient_phone), '');
  normalized_notes                 text    := nullif(btrim(target_notes), '');
  normalized_document_discount     numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  resolved_customer_id             uuid;
  resolved_lead_id                 uuid;
  resolved_recipient_display_name  text;
  resolved_recipient_contact_name  text;
  resolved_recipient_email         text;
  resolved_recipient_whatsapp      text;
  resolved_recipient_phone         text;
  computed_subtotal                numeric;
  computed_line_discount_total     numeric;
  computed_tax_total               numeric;
  computed_grand_total             numeric;
  computed_total_discount          numeric;
  discountable_subtotal            numeric;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'invoice.write') then
    raise exception 'You do not have permission to update invoices for this tenant';
  end if;

  select * into inv
  from public.invoices
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  if not found then
    raise exception 'Invoice not found';
  end if;

  if inv.status not in ('draft', 'issued') then
    raise exception 'Only draft or issued invoices can be edited';
  end if;

  if inv.reversal_of_invoice_id is not null then
    raise exception 'Reversal notes cannot be edited';
  end if;

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

  if normalized_recipient_kind = 'customer' then
    select c.id, c.display_name, c.contact_name, c.email, c.whatsapp, c.phone
    into resolved_customer_id, resolved_recipient_display_name,
         resolved_recipient_contact_name, resolved_recipient_email,
         resolved_recipient_whatsapp, resolved_recipient_phone
    from public.customers c
    where c.id = target_customer_id
      and c.tenant_id = target_tenant_id;

    if resolved_customer_id is null then
      raise exception 'Customer does not belong to the active tenant';
    end if;

  elsif normalized_recipient_kind = 'lead' then
    select l.id, l.display_name, l.contact_name, l.email, l.whatsapp, l.phone
    into resolved_lead_id, resolved_recipient_display_name,
         resolved_recipient_contact_name, resolved_recipient_email,
         resolved_recipient_whatsapp, resolved_recipient_phone
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

  update public.invoices
  set customer_id             = resolved_customer_id,
      lead_id                 = resolved_lead_id,
      recipient_kind          = normalized_recipient_kind,
      recipient_display_name  = resolved_recipient_display_name,
      recipient_contact_name  = resolved_recipient_contact_name,
      recipient_email         = resolved_recipient_email,
      recipient_whatsapp      = resolved_recipient_whatsapp,
      recipient_phone         = resolved_recipient_phone,
      title                   = normalized_title,
      document_kind           = normalized_document_kind,
      currency_code           = normalized_currency,
      issued_on               = target_issued_on,
      due_on                  = target_due_on,
      notes                   = normalized_notes,
      subtotal                = computed_subtotal,
      discount_total          = computed_total_discount,
      tax_total               = computed_tax_total,
      grand_total             = computed_grand_total,
      updated_at              = timezone('utc', now()),
      updated_by              = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  return target_invoice_id;
end;
$$;

revoke all on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text, text, text, text, date, date, text) from public;
grant execute on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text, text, text, text, date, date, text) to authenticated;
