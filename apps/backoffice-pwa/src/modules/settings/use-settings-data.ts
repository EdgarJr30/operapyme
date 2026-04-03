import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  getSettingsUserProfile,
  getTenantBrandingSettings,
  listTenantMembersForSettings
} from "@/lib/supabase/settings-data";

export function useSettingsData(canManageMembers: boolean) {
  const { activeTenantId, isConfigured, status, user } = useBackofficeAuth();

  const canLoadUserProfile = Boolean(
    isConfigured && status === "signed_in" && user?.id
  );
  const canLoadTenantSettings = Boolean(
    isConfigured && status === "signed_in" && activeTenantId
  );

  const userProfileQuery = useQuery({
    queryKey: ["settings-user-profile", user?.id],
    queryFn: () => getSettingsUserProfile(user?.id ?? ""),
    enabled: canLoadUserProfile
  });

  const tenantSettingsQuery = useQuery({
    queryKey: ["tenant-settings", activeTenantId],
    queryFn: () => getTenantBrandingSettings(activeTenantId ?? ""),
    enabled: canLoadTenantSettings
  });

  const tenantMembersQuery = useQuery({
    queryKey: ["tenant-settings-members", activeTenantId],
    queryFn: () => listTenantMembersForSettings(activeTenantId ?? ""),
    enabled: Boolean(canLoadTenantSettings && canManageMembers)
  });

  return {
    activeTenantId,
    userProfileQuery,
    tenantMembersQuery,
    tenantSettingsQuery
  };
}
