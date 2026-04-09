create or replace function public.normalize_catalog_item_kind()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  normalized_kind text;
begin
  if new.kind is null then
    return new;
  end if;

  normalized_kind := translate(
    lower(btrim(new.kind)),
    'áàäéèëíìïóòöúùüñ',
    'aaaeeeiiiooouuun'
  );

  if normalized_kind = 'producto' then
    new.kind := 'product';
  elsif normalized_kind = 'servicio' then
    new.kind := 'service';
  else
    new.kind := lower(btrim(new.kind));
  end if;

  return new;
end;
$$;

drop trigger if exists catalog_items_normalize_kind on public.catalog_items;
create trigger catalog_items_normalize_kind
before insert or update on public.catalog_items
for each row
execute function public.normalize_catalog_item_kind();
