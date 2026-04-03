alter table public.tenants
alter column palette_id set default 'slate';

update public.tenants
set palette_id = 'slate'
where palette_id = 'custom'
  and palette_seed_colors = jsonb_build_object(
    'paper', '#f4f7f9',
    'primary', '#2d3e50',
    'secondary', '#ff7a00',
    'tertiary', '#4b637a'
  );

create or replace function public.create_tenant_with_owner(
  target_name text,
  target_slug text,
  next_palette_id text default 'slate',
  next_palette_seed_colors jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  new_membership_id uuid;
  owner_role_id uuid;
  normalized_name text := trim(coalesce(target_name, ''));
  normalized_slug text := lower(trim(coalesce(target_slug, '')));
  normalized_palette_id text := lower(trim(coalesce(next_palette_id, 'slate')));
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if length(normalized_name) < 2 then
    raise exception 'Tenant name is required';
  end if;

  if normalized_slug = '' or normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Tenant slug is invalid';
  end if;

  if normalized_palette_id not in ('slate', 'linen', 'mist', 'clay', 'dusk', 'custom') then
    raise exception 'Tenant palette is invalid';
  end if;

  if not public.is_tenant_slug_available(normalized_slug) then
    raise exception 'Tenant slug is already in use';
  end if;

  insert into public.app_users (id, email, display_name)
  values (
    auth.uid(),
    coalesce((select email from auth.users where id = auth.uid()), ''),
    coalesce(
      (select raw_user_meta_data ->> 'full_name' from auth.users where id = auth.uid()),
      (select raw_user_meta_data ->> 'name' from auth.users where id = auth.uid())
    )
  )
  on conflict (id) do update
  set updated_at = timezone('utc', now());

  insert into public.tenants (
    slug,
    name,
    palette_id,
    palette_seed_colors,
    created_by,
    updated_by
  )
  values (
    normalized_slug,
    normalized_name,
    normalized_palette_id,
    coalesce(
      next_palette_seed_colors,
      jsonb_build_object(
        'paper', '#f4f7f9',
        'primary', '#2d3e50',
        'secondary', '#ff7a00',
        'tertiary', '#4b637a'
      )
    ),
    auth.uid(),
    auth.uid()
  )
  returning id into new_tenant_id;

  insert into public.tenant_memberships (
    tenant_id,
    app_user_id,
    status,
    created_by,
    updated_by
  )
  values (new_tenant_id, auth.uid(), 'active', auth.uid(), auth.uid())
  returning id into new_membership_id;

  select id
  into owner_role_id
  from public.tenant_roles
  where role_key = 'tenant_owner';

  if owner_role_id is null then
    raise exception 'tenant_owner role is missing';
  end if;

  insert into public.tenant_membership_roles (
    membership_id,
    role_id,
    created_by,
    updated_by
  )
  values (new_membership_id, owner_role_id, auth.uid(), auth.uid())
  on conflict (membership_id, role_id) do nothing;

  return jsonb_build_object(
    'tenantId', new_tenant_id,
    'membershipId', new_membership_id,
    'tenantSlug', normalized_slug
  );
exception
  when unique_violation then
    raise exception 'Tenant slug is already in use';
end;
$$;
