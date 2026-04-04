import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ThemePaletteSeedColors,
  ThemePaletteSelectionId
} from "@operapyme/ui";

import {
  defaultCustomThemePaletteSeeds,
  defaultThemePaletteId
} from "@operapyme/ui";

import { supabase } from "@/lib/supabase/client";

export interface SettingsUserProfile {
  appUserId: string;
  email: string;
  displayName: string | null;
  updatedAt: string;
}

export interface TenantBrandingSettings {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive" | "suspended";
  paletteId: ThemePaletteSelectionId;
  paletteSeedColors: ThemePaletteSeedColors | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsTenantMember {
  membershipId: string;
  appUserId: string;
  email: string;
  displayName: string | null;
  status: "active" | "invited" | "suspended";
  tenantRoleKeys: string[];
  createdAt: string;
  updatedAt: string;
}

interface RawSettingsUserProfile {
  id: string;
  email: string;
  display_name: string | null;
  updated_at: string;
}

interface RawTenantBrandingSettings {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive" | "suspended";
  palette_id: ThemePaletteSelectionId | null;
  palette_seed_colors: Partial<ThemePaletteSeedColors> | null;
  created_at: string;
  updated_at: string;
}

interface RawSettingsTenantMember {
  membership_id: string;
  app_user_id: string;
  email: string;
  display_name: string | null;
  status: "active" | "invited" | "suspended";
  tenant_role_keys: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateSettingsUserProfileInput {
  appUserId: string;
  displayName: string | null;
}

export interface UpdateTenantBrandingSettingsInput {
  tenantId: string;
  name: string;
  paletteId: ThemePaletteSelectionId;
  paletteSeedColors: ThemePaletteSeedColors | null;
}

export interface DeleteTenantAccountInput {
  tenantId: string;
  confirmationText: string;
}

export interface DeleteTenantAccountResult {
  accountDeleted: boolean;
  remainingTenantMemberships: number;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

function ensureClient(client?: SupabaseClient) {
  const resolvedClient = client ?? supabase;

  if (!resolvedClient) {
    throw new Error("Supabase client is not configured.");
  }

  return resolvedClient;
}

async function extractFunctionErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "context" in error &&
    error.context instanceof Response
  ) {
    try {
      const payload = await error.context.clone().json();

      if (
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof payload.error === "string" &&
        payload.error.trim()
      ) {
        return payload.error;
      }
    } catch {
      try {
        const text = await error.context.clone().text();

        if (text.trim()) {
          return text;
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

function parsePaletteSeedColors(
  value: Partial<ThemePaletteSeedColors> | null | undefined
) {
  return {
    paper: value?.paper ?? defaultCustomThemePaletteSeeds.paper,
    primary: value?.primary ?? defaultCustomThemePaletteSeeds.primary,
    secondary: value?.secondary ?? defaultCustomThemePaletteSeeds.secondary,
    tertiary: value?.tertiary ?? defaultCustomThemePaletteSeeds.tertiary
  };
}

function mapSettingsUserProfile(
  row: RawSettingsUserProfile
): SettingsUserProfile {
  return {
    appUserId: row.id,
    email: row.email,
    displayName: row.display_name,
    updatedAt: row.updated_at
  };
}

function mapTenantBrandingSettings(
  row: RawTenantBrandingSettings
): TenantBrandingSettings {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    paletteId: row.palette_id ?? defaultThemePaletteId,
    paletteSeedColors: row.palette_seed_colors
      ? parsePaletteSeedColors(row.palette_seed_colors)
      : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSettingsTenantMember(
  row: RawSettingsTenantMember
): SettingsTenantMember {
  return {
    membershipId: row.membership_id,
    appUserId: row.app_user_id,
    email: row.email,
    displayName: row.display_name,
    status: row.status,
    tenantRoleKeys: row.tenant_role_keys ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getSettingsUserProfile(
  appUserId: string,
  client?: SupabaseClient
) {
  const resolvedClient = ensureClient(client);
  const { data, error } = await resolvedClient
    .from("app_users")
    .select("id, email, display_name, updated_at")
    .eq("id", appUserId)
    .single();

  if (error) {
    const errorMessage = await extractFunctionErrorMessage(error);

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    throw error;
  }

  return mapSettingsUserProfile(data as RawSettingsUserProfile);
}

export async function updateSettingsUserProfile(
  input: UpdateSettingsUserProfileInput,
  client?: SupabaseClient
) {
  const resolvedClient = ensureClient(client);
  const { data, error } = await resolvedClient
    .from("app_users")
    .update({
      display_name: input.displayName?.trim() || null
    })
    .eq("id", input.appUserId)
    .select("id, email, display_name, updated_at")
    .single();

  if (error) {
    throw error;
  }

  return mapSettingsUserProfile(data as RawSettingsUserProfile);
}

export async function getTenantBrandingSettings(
  tenantId: string,
  client?: SupabaseClient
) {
  const resolvedClient = ensureClient(client);
  const { data, error } = await resolvedClient
    .from("tenants")
    .select(
      "id, name, slug, status, palette_id, palette_seed_colors, created_at, updated_at"
    )
    .eq("id", tenantId)
    .single();

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    throw new Error("Tenant branding settings update returned no data.");
  }

  return mapTenantBrandingSettings(row as RawTenantBrandingSettings);
}

export async function updateTenantBrandingSettings(
  input: UpdateTenantBrandingSettingsInput,
  client?: SupabaseClient
) {
  const resolvedClient = ensureClient(client);
  const { data, error } = await resolvedClient.rpc(
    "update_tenant_branding_settings",
    {
      target_tenant_id: input.tenantId,
      next_name: input.name.trim(),
      next_palette_id: input.paletteId,
      next_palette_seed_colors: input.paletteSeedColors
    }
  );

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    throw new Error("Tenant branding settings update returned no data.");
  }

  return mapTenantBrandingSettings(row as RawTenantBrandingSettings);
}

export async function listTenantMembersForSettings(
  tenantId: string,
  client?: SupabaseClient
) {
  const resolvedClient = ensureClient(client);
  const { data, error } = await resolvedClient.rpc(
    "list_tenant_memberships_for_settings",
    {
      target_tenant_id: tenantId
    }
  );

  if (error) {
    throw error;
  }

  return ((data ?? []) as RawSettingsTenantMember[]).map(
    mapSettingsTenantMember
  );
}

export async function deleteTenantAccount(
  input: DeleteTenantAccountInput,
  client?: SupabaseClient
) {
  const resolvedClient = ensureClient(client);
  const {
    data: { session }
  } = await resolvedClient.auth.getSession();
  const { data, error } = await resolvedClient.functions.invoke(
    "delete-tenant-account",
    {
      headers: session?.access_token
        ? {
            Authorization: `Bearer ${session.access_token}`
          }
        : undefined,
      body: {
        tenantId: input.tenantId,
        confirmationText: input.confirmationText.trim()
      }
    }
  );

  if (error) {
    throw error;
  }

  const response = data as
    | (DeleteTenantAccountResult & { error?: string })
    | null
    | undefined;

  if (!response) {
    throw new Error("Tenant deletion returned no data.");
  }

  if ("error" in response && response.error) {
    throw new Error(response.error);
  }

  return response;
}
