-- Keep a single canonical create_tenant_with_owner RPC signature.
-- The legacy two-argument overload becomes ambiguous once the four-argument
-- version with defaults exists, because PostgREST can match both candidates
-- when the client only sends target_name + target_slug.
drop function if exists public.create_tenant_with_owner(text, text);
