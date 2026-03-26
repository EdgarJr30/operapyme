import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  createCatalogItem,
  updateCatalogItem,
  type CreateCatalogItemInput,
  type UpdateCatalogItemInput
} from "@/lib/supabase/backoffice-data";

function ensureTenantId(tenantId: string | null) {
  if (!tenantId) {
    throw new Error("No active tenant available for this operation.");
  }

  return tenantId;
}

export function useCatalogMutations() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useBackofficeAuth();

  const invalidate = async (tenantId: string) => {
    await queryClient.invalidateQueries({
      queryKey: ["catalog-items", tenantId]
    });
  };

  const createCatalogItemMutation = useMutation({
    mutationFn: (input: Omit<CreateCatalogItemInput, "tenantId">) =>
      createCatalogItem({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  const updateCatalogItemMutation = useMutation({
    mutationFn: (input: Omit<UpdateCatalogItemInput, "tenantId">) =>
      updateCatalogItem({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  return {
    createCatalogItemMutation,
    updateCatalogItemMutation
  };
}
