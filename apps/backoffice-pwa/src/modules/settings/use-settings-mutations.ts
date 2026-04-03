import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  updateSettingsUserProfile,
  updateTenantBrandingSettings,
  type UpdateSettingsUserProfileInput,
  type UpdateTenantBrandingSettingsInput
} from "@/lib/supabase/settings-data";

function ensureTenantId(tenantId: string | null) {
  if (!tenantId) {
    throw new Error("No active tenant available for this operation.");
  }

  return tenantId;
}

function ensureUserId(userId: string | undefined) {
  if (!userId) {
    throw new Error("No authenticated user available for this operation.");
  }

  return userId;
}

export function useSettingsMutations() {
  const queryClient = useQueryClient();
  const { activeTenantId, refreshAccessContext, user } = useBackofficeAuth();

  const updateUserProfileMutation = useMutation({
    mutationFn: (input: Omit<UpdateSettingsUserProfileInput, "appUserId">) =>
      updateSettingsUserProfile({
        ...input,
        appUserId: ensureUserId(user?.id)
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["settings-user-profile", user?.id]
        }),
        refreshAccessContext()
      ]);
    }
  });

  const updateTenantSettingsMutation = useMutation({
    mutationFn: (input: Omit<UpdateTenantBrandingSettingsInput, "tenantId">) =>
      updateTenantBrandingSettings({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tenant-settings", activeTenantId]
        }),
        queryClient.invalidateQueries({
          queryKey: ["tenant-settings-members", activeTenantId]
        }),
        refreshAccessContext()
      ]);
    }
  });

  return {
    updateTenantSettingsMutation,
    updateUserProfileMutation
  };
}
