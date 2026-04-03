-- Add cancellation reason tracking to quotes and invoices for audit and operational history.
-- Backend enforces that destructive status transitions (rejected, expired, void) require a reason.

-- 1. Add cancellation_reason to quotes (for rejected / expired transitions)
alter table public.quotes
  add column if not exists cancellation_reason text;

-- 2. Add void_reason to invoices (for void transitions)
alter table public.invoices
  add column if not exists void_reason text;

-- 3. Replace move_quote_status: drop old signature, recreate with required reason for destructive statuses
drop function if exists public.move_quote_status(uuid, uuid, integer, text);

create or replace function public.move_quote_status(
  target_tenant_id      uuid,
  target_quote_id       uuid,
  expected_version      integer,
  target_status         text,
  p_cancellation_reason text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_status text := lower(trim(coalesce(target_status, '')));
  normalized_reason text := trim(coalesce(p_cancellation_reason, ''));
  updated_quote_id   uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'quote.write') then
    raise exception 'You do not have permission to update quotes for this tenant';
  end if;

  if normalized_status not in ('draft', 'sent', 'viewed', 'approved', 'rejected', 'expired') then
    raise exception 'Quote status is invalid';
  end if;

  -- Require a non-empty reason when closing a quote (rejected or expired)
  if normalized_status in ('rejected', 'expired') and normalized_reason = '' then
    raise exception 'A cancellation reason is required when rejecting or expiring a quote';
  end if;

  update public.quotes
  set
    status               = normalized_status,
    version              = public.quotes.version + 1,
    cancellation_reason  = case
                             when normalized_status in ('rejected', 'expired') then normalized_reason
                             else cancellation_reason
                           end,
    updated_at           = timezone('utc', now()),
    updated_by           = auth.uid()
  where tenant_id = target_tenant_id
    and id        = target_quote_id
    and version   = expected_version
  returning id into updated_quote_id;

  if updated_quote_id is null then
    raise exception 'Quote not found or version mismatch';
  end if;

  return updated_quote_id;
end;
$$;

revoke all on function public.move_quote_status(uuid, uuid, integer, text, text) from public;
grant execute on function public.move_quote_status(uuid, uuid, integer, text, text) to authenticated;

-- 4. Replace move_invoice_status: drop old signature, recreate with required reason for void
drop function if exists public.move_invoice_status(uuid, uuid, text);

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
  normalized_reason text := trim(coalesce(p_void_reason, ''));
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

  -- Require a non-empty reason when voiding an invoice
  if normalized_status = 'void' and normalized_reason = '' then
    raise exception 'A void reason is required when voiding an invoice';
  end if;

  update public.invoices
  set
    status      = normalized_status,
    issued_on   = case
                    when normalized_status = 'issued' and issued_on is null then current_date
                    else issued_on
                  end,
    void_reason = case
                    when normalized_status = 'void' then normalized_reason
                    else void_reason
                  end,
    updated_at  = timezone('utc', now()),
    updated_by  = auth.uid()
  where tenant_id = target_tenant_id
    and id        = target_invoice_id
  returning id into updated_invoice_id;

  if updated_invoice_id is null then
    raise exception 'Invoice not found';
  end if;

  return updated_invoice_id;
end;
$$;

revoke all on function public.move_invoice_status(uuid, uuid, text, text) from public;
grant execute on function public.move_invoice_status(uuid, uuid, text, text) to authenticated;
