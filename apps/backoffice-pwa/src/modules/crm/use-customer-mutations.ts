import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  createCustomer,
  updateCustomer,
  type CreateCustomerInput,
  type UpdateCustomerInput
} from "@/lib/supabase/backoffice-data";

function ensureTenantId(tenantId: string | null) {
  if (!tenantId) {
    throw new Error("No active tenant available for this operation.");
  }

  return tenantId;
}

export function useCustomerMutations() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useBackofficeAuth();

  const invalidate = async (tenantId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["customers", tenantId] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot", tenantId] })
    ]);
  };

  const createCustomerMutation = useMutation({
    mutationFn: (input: Omit<CreateCustomerInput, "tenantId">) =>
      createCustomer({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: (input: Omit<UpdateCustomerInput, "tenantId">) =>
      updateCustomer({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  return {
    createCustomerMutation,
    updateCustomerMutation
  };
}

