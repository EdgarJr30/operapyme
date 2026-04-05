import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  convertLeadToCustomer,
  createLead,
  updateLead,
  type ConvertLeadToCustomerInput,
  type CreateLeadInput,
  type UpdateLeadInput
} from "@/lib/supabase/backoffice-data";

function ensureTenantId(tenantId: string | null) {
  if (!tenantId) {
    throw new Error("No active tenant available for this operation.");
  }

  return tenantId;
}

export function useLeadMutations() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useBackofficeAuth();

  const invalidate = async (tenantId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["leads", tenantId] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot", tenantId] })
    ]);
  };

  const createLeadMutation = useMutation({
    mutationFn: (input: Omit<CreateLeadInput, "tenantId">) =>
      createLead({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: (input: Omit<UpdateLeadInput, "tenantId">) =>
      updateLead({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  const convertLeadToCustomerMutation = useMutation({
    mutationFn: (input: Omit<ConvertLeadToCustomerInput, "tenantId">) =>
      convertLeadToCustomer({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSettled: async () => {
      const tenantId = ensureTenantId(activeTenantId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["leads", tenantId] }),
        queryClient.invalidateQueries({ queryKey: ["customers", tenantId] }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard-snapshot", tenantId]
        })
      ]);
    }
  });

  return {
    convertLeadToCustomerMutation,
    createLeadMutation,
    updateLeadMutation
  };
}
