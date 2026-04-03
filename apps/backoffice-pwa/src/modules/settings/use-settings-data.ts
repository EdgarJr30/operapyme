import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  getSettingsUserProfile,
  getTenantBrandingSettings,
  listTenantMembersForSettings
} from "@/lib/supabase/settings-data";

export function useSettingsData(canManageMembers: boolean) {
  const { activeTenantId, user } = useBackofficeAuth();

  const userProfileQuery = useQuery({
    queryKey: ["settings-user-profile", user?.id],
    queryFn: () => getSettingsUserProfile(user?.id ?? ""),
    enabled: Boolean(user?.id)
  });

  const tenantSettingsQuery = useQuery({
    queryKey: ["tenant-settings", activeTenantId],
    queryFn: () => getTenantBrandingSettings(activeTenantId ?? ""),
    enabled: Boolean(activeTenantId)
  });

  const tenantMembersQuery = useQuery({
    queryKey: ["tenant-settings-members", activeTenantId],
    queryFn: () => listTenantMembersForSettings(activeTenantId ?? ""),
    enabled: Boolean(activeTenantId && canManageMembers)
  });

  return {
    activeTenantId,
    userProfileQuery,
    tenantMembersQuery,
    tenantSettingsQuery
  };
}
