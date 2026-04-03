import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import type { EmailOtpType } from "@supabase/supabase-js";
import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "@operapyme/i18n";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { AppLoadingScreen } from "@/components/layout/app-loading-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backofficeTransition } from "@/lib/motion";
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
  | { kind: "code"; code: string }
  | { kind: "otp"; tokenHash: string; otpType: EmailOtpType }
  | { kind: "error"; message: string }
  | { kind: "missing" };

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
    return { kind: "code", code };
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

  return { kind: "missing" };
}

function checkPasswordRules(value: string) {
  return {
    minLength: value.length >= 8,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    numbers: /\d/.test(value)
  };
}

function AuthVisualPanel() {
  return (
    <div className="relative hidden w-0 flex-1 lg:block">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1908&q=80"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.52))]" />
    </div>
  );
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (callbackPayload.kind !== "code" && callbackPayload.kind !== "otp") {
      return;
    }

    hasHandledCallbackRef.current = true;
    let isCancelled = false;
    const supabaseClient = supabase;
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

  if (status === "loading" || (status === "signed_in" && isAccessContextLoading && !isRecoveryFlow)) {
    return <AppLoadingScreen variant="setup" />;
  }

  if (status === "signed_in" && !isRecoveryFlow) {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  if (status === "signed_out" && callbackPayload.kind === "missing") {
    return <Navigate to="/auth" replace />;
  }

  const passwordRules = checkPasswordRules(password);
  const allRulesMet = Object.values(passwordRules).every(Boolean);

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!allRulesMet) {
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

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={backofficeTransition}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <img alt="OperaPyme" src="/favicon.svg" className="h-10 w-auto rounded-xl" />

          {status === "signed_in" && isRecoveryFlow ? (
            <>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
                {t("auth.callback.recoveryTitle")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t("auth.callback.recoveryDescription")}
              </p>

              <form className="mt-10 space-y-6" onSubmit={handlePasswordSubmit}>
                <div>
                  <label htmlFor="recovery-password" className="block text-sm font-medium text-gray-900">
                    {t("auth.callback.newPasswordLabel")}
                  </label>
                  <div className="mt-2 relative">
                    <Input
                      id="recovery-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPasswordValue(event.target.value)}
                      placeholder={t("auth.callback.newPasswordPlaceholder")}
                      required
                      className="block h-11 w-full rounded-md border-gray-300 bg-white px-3 py-1.5 pr-11 text-base text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? t("auth.form.hidePassword") : t("auth.form.showPassword")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" aria-hidden="true" />
                      ) : (
                        <Eye className="size-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="recovery-confirm-password" className="block text-sm font-medium text-gray-900">
                    {t("auth.callback.confirmPasswordLabel")}
                  </label>
                  <div className="mt-2 relative">
                    <Input
                      id="recovery-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder={t("auth.callback.confirmPasswordPlaceholder")}
                      required
                      className="block h-11 w-full rounded-md border-gray-300 bg-white px-3 py-1.5 pr-11 text-base text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword ? t("auth.form.hidePassword") : t("auth.form.showPassword")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" aria-hidden="true" />
                      ) : (
                        <Eye className="size-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <KeyRound className="mt-0.5 h-5 w-5 text-indigo-600" aria-hidden="true" />
                    <div className="space-y-2">
                      <p className="text-sm leading-6 text-gray-600">{t("auth.callback.passwordRule")}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(
                          [
                            { key: "lowercase", label: t("auth.callback.ruleLowercase"), met: passwordRules.lowercase },
                            { key: "uppercase", label: t("auth.callback.ruleUppercase"), met: passwordRules.uppercase },
                            { key: "numbers", label: t("auth.callback.ruleNumbers"), met: passwordRules.numbers },
                            { key: "minLength", label: t("auth.callback.ruleMinLength"), met: passwordRules.minLength }
                          ] as const
                        ).map(({ key, label, met }) => (
                          <div key={key} className="flex items-center gap-2">
                            <div
                              className={
                                met
                                  ? "flex size-5 items-center justify-center rounded-full bg-indigo-600"
                                  : "size-5 rounded-full border-2 border-gray-300"
                              }
                            >
                              {met ? <Check className="size-3 text-white" strokeWidth={3} aria-hidden="true" /> : null}
                            </div>
                            <span className={met ? "text-sm text-gray-900" : "text-sm text-gray-500"}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  {isSubmittingPassword
                    ? t("auth.callback.passwordSaving")
                    : t("auth.callback.passwordSubmit")}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="flex w-full justify-center rounded-md"
                  onClick={() => {
                    window.location.assign(isBootstrapped ? "/" : "/setup");
                  }}
                >
                  {t("auth.callback.continueToWorkspace")}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
                {t("auth.callback.title")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {callbackError ||
                  (callbackPayload.kind === "missing"
                    ? t("auth.callback.errorMissing")
                    : t("auth.callback.description"))}
              </p>

              {callbackError ? (
                <Link
                  to="/auth"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  {t("auth.callback.backToAuth")}
                </Link>
              ) : (
                <div className="mt-8 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-indigo-600" aria-hidden="true" />
                    <p className="text-sm leading-6 text-gray-600">{t("auth.preview.accessText")}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <AuthVisualPanel />
    </div>
  );
}
