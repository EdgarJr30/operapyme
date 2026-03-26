import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  createQuote,
  updateQuote,
  type CreateQuoteInput,
  type UpdateQuoteInput
} from "@/lib/supabase/backoffice-data";

function ensureTenantId(tenantId: string | null) {
  if (!tenantId) {
    throw new Error("No active tenant available for this operation.");
  }

  return tenantId;
}

export function useQuoteMutations() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useBackofficeAuth();

  const invalidate = async (tenantId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["quotes", tenantId] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot", tenantId] })
    ]);
  };

  const createQuoteMutation = useMutation({
    mutationFn: (input: Omit<CreateQuoteInput, "tenantId">) =>
      createQuote({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  const updateQuoteMutation = useMutation({
    mutationFn: (input: Omit<UpdateQuoteInput, "tenantId">) =>
      updateQuote({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  return {
    createQuoteMutation,
    updateQuoteMutation
  };
}
