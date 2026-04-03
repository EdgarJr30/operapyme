import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim() ?? "";

function normalizePublicSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getAuthCallbackUrl(search = "") {
  const baseUrl =
    publicSiteUrl.length > 0
      ? normalizePublicSiteUrl(publicSiteUrl)
      : window.location.origin;

  return `${baseUrl}/auth/callback${search}`;
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "operapyme.backoffice.auth"
      }
    })
  : null;
