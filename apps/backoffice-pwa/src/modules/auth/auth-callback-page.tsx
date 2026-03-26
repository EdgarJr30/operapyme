import { useEffect, useMemo, useRef, useState } from "react";

import type { EmailOtpType } from "@supabase/supabase-js";
import { useTranslation } from "@operapyme/i18n";
import {
  Link,
  Navigate
} from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

const supportedEmailOtpTypes: EmailOtpType[] = [
  "email",
  "signup",
  "invite",
  "recovery",
  "email_change",
  "magiclink"
];

type AuthCallbackPayload =
  | {
      kind: "code";
      code: string;
    }
  | {
      kind: "otp";
      tokenHash: string;
      otpType: EmailOtpType;
    }
  | {
      kind: "error";
      message: string;
    }
  | {
      kind: "missing";
    };

function readAuthCallbackPayload(rawUrl: string): AuthCallbackPayload {
  const url = new URL(rawUrl);
  const errorDescription = url.searchParams.get("error_description");
  const errorCode = url.searchParams.get("error_code") ?? url.searchParams.get("error");

  if (errorDescription || errorCode) {
    return {
      kind: "error",
      message: errorDescription ?? errorCode ?? "Authentication callback failed."
    };
  }

  const code = url.searchParams.get("code");

  if (code) {
    return {
      kind: "code",
      code
    };
  }

  const tokenHash = url.searchParams.get("token_hash");
  const otpType = url.searchParams.get("type");

  if (tokenHash && otpType && supportedEmailOtpTypes.includes(otpType as EmailOtpType)) {
    return {
      kind: "otp",
      tokenHash,
      otpType: otpType as EmailOtpType
    };
  }

  if (tokenHash || otpType) {
    return {
      kind: "error",
      message: "unsupported"
    };
  }

  return {
    kind: "missing"
  };
}

export function AuthCallbackPage() {
  const { t } = useTranslation("backoffice");
  const { isBootstrapped, isConfigured, refreshAccessContext, status } =
    useBackofficeAuth();
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const callbackPayload = useMemo(() => {
    if (typeof window === "undefined") {
      return { kind: "missing" } satisfies AuthCallbackPayload;
    }

    return readAuthCallbackPayload(window.location.href);
  }, []);
  const hasHandledCallbackRef = useRef(false);

  useEffect(() => {
    if (!supabase || typeof window === "undefined") {
      return;
    }

    if (hasHandledCallbackRef.current) {
      return;
    }

    const supabaseClient = supabase;
    if (callbackPayload.kind === "missing") {
      return;
    }

    if (callbackPayload.kind === "error") {
      setCallbackError(
        callbackPayload.message === "unsupported"
          ? t("auth.callback.errorUnsupported")
          : callbackPayload.message
      );
      hasHandledCallbackRef.current = true;
      return;
    }

    hasHandledCallbackRef.current = true;
    let isCancelled = false;
    const authPayload = callbackPayload;

    async function resolveCallback() {
      const result =
        authPayload.kind === "code"
          ? await supabaseClient.auth.exchangeCodeForSession(authPayload.code)
          : await supabaseClient.auth.verifyOtp({
              token_hash: authPayload.tokenHash,
              type: authPayload.otpType
            });
      const { error } = result;

      if (!isCancelled && error) {
        setCallbackError(error.message);
        return;
      }

      await refreshAccessContext();
    }

    void resolveCallback();

    return () => {
      isCancelled = true;
    };
  }, [callbackPayload, refreshAccessContext, t]);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === "signed_in") {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  if (status === "signed_out" && callbackPayload.kind === "missing") {
    return <Navigate to="/auth" replace />;
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
            {callbackError ||
              (callbackPayload.kind === "missing"
                ? t("auth.callback.errorMissing")
                : t("auth.callback.description"))}
          </p>
          {callbackError ? (
            <Link
              className="inline-flex min-h-11 w-full min-w-11 items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-medium text-brand-contrast shadow-soft transition duration-200 ease-out hover:bg-brand-hover active:translate-y-px sm:w-auto"
              to="/auth"
            >
              {t("auth.callback.backToAuth")}
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
