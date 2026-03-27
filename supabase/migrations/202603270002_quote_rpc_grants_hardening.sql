revoke execute on function public.replace_quote_line_items(uuid, uuid, jsonb, uuid)
from public, anon, authenticated;

revoke execute on function public.create_quote(
  uuid,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
)
from public, anon;

revoke execute on function public.update_quote(
  uuid,
  uuid,
  integer,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
)
from public, anon;

grant execute on function public.create_quote(
  uuid,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
)
to authenticated;

grant execute on function public.update_quote(
  uuid,
  uuid,
  integer,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
)
to authenticated;
