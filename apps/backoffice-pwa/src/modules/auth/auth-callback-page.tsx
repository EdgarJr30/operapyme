import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import type { EmailOtpType } from "@supabase/supabase-js";
import { useTranslation } from "@operapyme/i18n";
import {
  Link,
  Navigate
} from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { AppLoadingScreen } from "@/components/layout/app-loading-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const {
    isAccessContextLoading,
    isBootstrapped,
    isConfigured,
    refreshAccessContext,
    setPassword,
    status
  } = useBackofficeAuth();
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const callbackPayload = useMemo(() => {
    if (typeof window === "undefined") {
      return { kind: "missing" } satisfies AuthCallbackPayload;
    }

    return readAuthCallbackPayload(window.location.href);
  }, []);
  const callbackFlow = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const url = new URL(window.location.href);

    return url.searchParams.get("flow");
  }, []);
  const hasHandledCallbackRef = useRef(false);
  const isRecoveryFlow =
    callbackFlow === "recovery" ||
    (callbackPayload.kind === "otp" && callbackPayload.otpType === "recovery");

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

  if (
    status === "loading" ||
    (status === "signed_in" &&
      isAccessContextLoading &&
      !isRecoveryFlow)
  ) {
    return <AppLoadingScreen variant="setup" />;
  }

  if (status === "signed_in" && !isRecoveryFlow) {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  if (status === "signed_out" && callbackPayload.kind === "missing") {
    return <Navigate to="/auth" replace />;
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error(t("auth.callback.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("auth.callback.passwordMismatch"));
      return;
    }

    setIsSubmittingPassword(true);
    const nextError = await setPassword(password);
    setIsSubmittingPassword(false);

    if (nextError) {
      toast.error(t("auth.callback.passwordSaveError", { message: nextError }));
      return;
    }

    toast.success(t("auth.callback.passwordSavedTitle"), {
      description: t("auth.callback.passwordSavedDescription")
    });
  }

  if (status === "signed_in" && isRecoveryFlow) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6">
        <Card className="w-full">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                {t("auth.callback.recoveryEyebrow")}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {t("auth.callback.recoveryTitle")}
              </h1>
              <p className="text-sm leading-6 text-ink-soft">
                {t("auth.callback.recoveryDescription")}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label
                  htmlFor="recovery-password"
                  className="block text-sm font-medium text-ink"
                >
                  {t("auth.callback.newPasswordLabel")}
                </label>
                <Input
                  id="recovery-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPasswordValue(event.target.value)}
                  placeholder={t("auth.callback.newPasswordPlaceholder")}
                  required
                  className="mt-2 rounded-xl border-line/80 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="recovery-confirm-password"
                  className="block text-sm font-medium text-ink"
                >
                  {t("auth.callback.confirmPasswordLabel")}
                </label>
                <Input
                  id="recovery-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder={t("auth.callback.confirmPasswordPlaceholder")}
                  required
                  className="mt-2 rounded-xl border-line/80 bg-white"
                />
              </div>

              <div className="rounded-2xl border border-line/70 bg-sand/35 px-4 py-3">
                <p className="text-sm leading-6 text-ink-soft">
                  {t("auth.callback.passwordRule")}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmittingPassword}
                className="flex w-full justify-center rounded-xl bg-brand text-sm font-semibold text-brand-contrast shadow-soft transition duration-200 ease-out hover:bg-brand-hover"
              >
                {isSubmittingPassword
                  ? t("auth.callback.passwordSaving")
                  : t("auth.callback.passwordSubmit")}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="flex w-full justify-center rounded-xl"
                onClick={() => {
                  window.location.assign(isBootstrapped ? "/" : "/setup");
                }}
              >
                {t("auth.callback.continueToWorkspace")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6">
      <Card className="w-full">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
            {t("auth.callback.eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t("auth.callback.title")}
          </h1>
          <p className="text-sm leading-6 text-ink-soft">
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
