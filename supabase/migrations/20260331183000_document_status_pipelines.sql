create or replace function public.move_quote_status(
  target_tenant_id uuid,
  target_quote_id uuid,
  expected_version integer,
  target_status text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_status text := lower(trim(coalesce(target_status, '')));
  updated_quote_id uuid;
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

  update public.quotes
  set status = normalized_status,
      version = public.quotes.version + 1,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_quote_id
    and version = expected_version
  returning id into updated_quote_id;

  if updated_quote_id is null then
    raise exception 'Quote not found or version mismatch';
  end if;

  return updated_quote_id;
end;
$$;

revoke all on function public.move_quote_status(uuid, uuid, integer, text) from public;
grant execute on function public.move_quote_status(uuid, uuid, integer, text) to authenticated;

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

  if updated_invoice_id is null then
    raise exception 'Invoice not found';
  end if;

  return updated_invoice_id;
end;
$$;

revoke all on function public.move_invoice_status(uuid, uuid, text) from public;
grant execute on function public.move_invoice_status(uuid, uuid, text) to authenticated;
