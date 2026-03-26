import { useEffect, useState } from "react";

import { useTranslation } from "@operapyme/i18n";
import { Navigate } from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

export function AuthCallbackPage() {
  const { t } = useTranslation("backoffice");
  const { isBootstrapped, isConfigured, refreshAccessContext, status } =
    useBackofficeAuth();
  const [callbackError, setCallbackError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || typeof window === "undefined") {
      return;
    }

    const supabaseClient = supabase;
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      return;
    }

    const authCode = code;

    async function exchangeCode() {
      const { error } =
        await supabaseClient.auth.exchangeCodeForSession(authCode);

      if (error) {
        setCallbackError(error.message);
        return;
      }

      await refreshAccessContext();
    }

    void exchangeCode();
  }, [refreshAccessContext]);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === "signed_in") {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-12 sm:px-6">
      <Card className="w-full">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
            {t("auth.callback.eyebrow")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {t("auth.callback.title")}
          </h1>
          <p className="text-sm leading-7 text-ink-soft">
            {callbackError ?? t("auth.callback.description")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
