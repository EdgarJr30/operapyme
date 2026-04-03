import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import type { EmailOtpType } from "@supabase/supabase-js";
import { Check, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
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
import { backofficeTransition, pageTransitionVariants } from "@/lib/motion";
import { supabase } from "@/lib/supabase/client";
import { AuthHeroPanel } from "@/modules/auth/auth-hero-panel";
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

function checkPasswordRules(value: string) {
  return {
    minLength: value.length >= 8,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    numbers: /\d/.test(value)
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

  if (status === "signed_in" && isRecoveryFlow) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f8fbfd_0%,#eef4f8_38%,#f8fafc_100%)]">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <motion.div
            className="grid min-h-full flex-1 gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,30rem)] xl:grid-cols-[minmax(0,1.12fr)_30rem]"
            initial="initial"
            animate="animate"
            variants={pageTransitionVariants}
          >
            <AuthHeroPanel />

            <motion.section
              className="relative"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...backofficeTransition, delay: 0.08 }}
            >
              <div className="flex flex-col gap-7 rounded-[2rem] border border-line/60 bg-white px-6 py-6 shadow-soft sm:px-8 sm:py-8 lg:sticky lg:top-8 lg:min-h-[calc(100vh-4rem)]">

                {/* Top bar */}
                <div className="flex items-center gap-2.5">
                  <img
                    src="/favicon.svg"
                    alt="OperaPyme"
                    className="h-8 w-8 rounded-xl"
                  />
                  <span className="text-sm font-semibold text-ink">OperaPyme</span>
                </div>

                {/* Heading */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                    {t("auth.callback.recoveryEyebrow")}
                  </p>
                  <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
                    {t("auth.callback.recoveryTitle")}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {t("auth.callback.recoveryDescription")}
                  </p>
                </div>

                {/* Form */}
                <form className="flex flex-1 flex-col gap-5" onSubmit={handlePasswordSubmit}>

                  {/* New password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="recovery-password"
                      className="block text-sm font-medium text-ink"
                    >
                      {t("auth.callback.newPasswordLabel")}
                    </label>
                    <div className="relative">
                      <Input
                        id="recovery-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPasswordValue(event.target.value)}
                        placeholder={t("auth.callback.newPasswordPlaceholder")}
                        required
                        className="h-12 rounded-xl border-line/80 bg-white px-4 pr-12 text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? t("auth.form.hidePassword")
                            : t("auth.form.showPassword")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" aria-hidden="true" />
                        ) : (
                          <Eye className="size-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="recovery-confirm-password"
                      className="block text-sm font-medium text-ink"
                    >
                      {t("auth.callback.confirmPasswordLabel")}
                    </label>
                    <div className="relative">
                      <Input
                        id="recovery-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder={t("auth.callback.confirmPasswordPlaceholder")}
                        required
                        className="h-12 rounded-xl border-line/80 bg-white px-4 pr-12 text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                          showConfirmPassword
                            ? t("auth.form.hidePassword")
                            : t("auth.form.showPassword")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-5" aria-hidden="true" />
                        ) : (
                          <Eye className="size-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password validation checklist */}
                  <div className="grid grid-cols-2 gap-2">
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
                              ? "flex size-4 shrink-0 items-center justify-center rounded-full bg-brand"
                              : "size-4 shrink-0 rounded-full border-2 border-line"
                          }
                        >
                          {met ? (
                            <Check className="size-2.5 text-brand-contrast" strokeWidth={3} aria-hidden="true" />
                          ) : null}
                        </div>
                        <span
                          className={
                            met
                              ? "text-sm text-ink"
                              : "text-sm text-ink-muted"
                          }
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="flex w-full justify-center text-sm font-semibold"
                  >
                    {isSubmittingPassword
                      ? t("auth.callback.passwordSaving")
                      : t("auth.callback.passwordSubmit")}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="flex w-full justify-center"
                    onClick={() => {
                      window.location.assign(isBootstrapped ? "/" : "/setup");
                    }}
                  >
                    {t("auth.callback.continueToWorkspace")}
                  </Button>

                  {/* Footer links */}
                  <p className="mt-auto pt-2 text-center text-xs text-ink-muted">
                    <a href="#" className="transition hover:text-ink" tabIndex={-1}>
                      {t("auth.footer.privacy")}
                    </a>
                    {" · "}
                    <a href="#" className="transition hover:text-ink" tabIndex={-1}>
                      {t("auth.footer.terms")}
                    </a>
                  </p>
                </form>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>
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
