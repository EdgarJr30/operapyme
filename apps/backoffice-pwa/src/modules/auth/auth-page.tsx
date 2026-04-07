import { FormEvent, useRef, useState } from "react";

import {
  Eye,
  EyeOff,
  Lock,
  Mail
} from "lucide-react";
import { motion } from "motion/react";

import { useTranslation } from "@operapyme/i18n";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backofficeTransition } from "@/lib/motion";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

type AuthMode = "signin" | "signup";
type SignInView = "password" | "magic_link" | "recovery";

function AuthVisualPanel() {
  return (
    <div className="relative hidden w-0 flex-1 lg:block">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1908&q=80"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.52))]" />
      <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-white/92 p-6 shadow-2xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          OperaPyme
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
          Gestion operativa clara para pymes
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          CRM, cotizaciones, clientes y acceso seguro por tenant en una sola experiencia.
        </p>
      </div>
    </div>
  );
}

export function AuthPage() {
  const { t } = useTranslation("backoffice");
  const {
    isConfigured,
    isBootstrapped,
    requestPasswordReset,
    signInWithOtp,
    signInWithPassword,
    status
  } = useBackofficeAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [signInView, setSignInView] = useState<SignInView>("password");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === "signed_in") {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  const isFirstAccess = mode === "signup";
  const isPasswordView = !isFirstAccess && signInView === "password";
  const isRecoveryView = !isFirstAccess && signInView === "recovery";

  const entryContent =
    mode === "signin"
      ? {
          title: t("auth.entry.signinPanelTitle"),
          switchLead: t("auth.entry.signinSwitchLead"),
          switchAction: t("auth.entry.signinSwitchAction"),
          description: t("auth.entry.signinDescription"),
          submitLabel: isRecoveryView
            ? t("auth.form.recoverySubmit")
            : isPasswordView
              ? t("auth.form.passwordSubmit")
              : t("auth.form.submit")
        }
      : {
          title: t("auth.entry.signupPanelTitle"),
          switchLead: t("auth.entry.signupSwitchLead"),
          switchAction: t("auth.entry.signupSwitchAction"),
          description: t("auth.entry.signupDescription"),
          submitLabel: t("auth.form.submitFirstTime")
        };

  function focusEmailField() {
    requestAnimationFrame(() => {
      emailInputRef.current?.focus();
    });
  }

  function setAuthMode(nextMode: AuthMode) {
    setMode(nextMode);
    setSignInView(nextMode === "signin" ? "password" : "magic_link");
    setPassword("");
    setShowPassword(false);
    focusEmailField();
  }

  function handleSignInViewChange(nextView: SignInView) {
    setSignInView(nextView);
    if (nextView !== "password") {
      setPassword("");
      setShowPassword(false);
    }
    focusEmailField();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const trimmedEmail = email.trim();
    let nextError: string | null = null;

    if (isPasswordView) {
      nextError = await signInWithPassword(trimmedEmail, password);
    } else if (isRecoveryView) {
      nextError = await requestPasswordReset(trimmedEmail);
    } else {
      nextError = await signInWithOtp(trimmedEmail);
    }

    setIsSubmitting(false);

    if (nextError) {
      const errorKey = isRecoveryView
        ? "auth.form.recoveryError"
        : isPasswordView
          ? "auth.form.passwordError"
          : "auth.form.emailSendError";

      toast.error(t(errorKey, { message: nextError }));
      return;
    }

    if (isRecoveryView) {
      toast.success(t("auth.form.recoverySentTitle"), {
        description: t("auth.form.recoverySentText", { email: trimmedEmail })
      });
      handleSignInViewChange("password");
      return;
    }

    if (isPasswordView) {
      toast.success(t("auth.form.passwordSuccessTitle"), {
        description: t("auth.form.passwordSuccessText")
      });
      return;
    }

    toast.success(t("auth.form.emailSentTitle"), {
      description: t("auth.form.emailSentText", { email: trimmedEmail })
    });
  }

  const helperText = isRecoveryView
    ? t("auth.form.recoveryHelper")
    : isPasswordView
      ? t("auth.form.passwordHelper")
      : isFirstAccess
        ? t("auth.form.firstAccessHelper")
        : t("auth.form.magicLinkHelper");

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={backofficeTransition}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div>
            <Link
              to="/"
              className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Ir al inicio
            </Link>
            <img alt="OperaPyme" src="/favicon.svg" className="h-10 w-auto rounded-xl" />
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              {entryContent.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {entryContent.switchLead}{" "}
              <button
                type="button"
                onClick={() => setAuthMode(mode === "signin" ? "signup" : "signin")}
                className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
              >
                {entryContent.switchAction}
              </button>
            </p>
          </div>

          <div className="mt-10">
            {!isFirstAccess ? (
              <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1">
                {(
                  [
                    { view: "password" as SignInView, label: t("auth.form.passwordTab") },
                    { view: "magic_link" as SignInView, label: t("auth.form.magicLinkTab") },
                    { view: "recovery" as SignInView, label: t("auth.form.recoveryTab") }
                  ] as const
                ).map(({ view, label }) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => handleSignInViewChange(view)}
                    className={
                      signInView === view
                        ? "cursor-pointer rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm"
                        : "cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-500"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete={isPasswordView ? "on" : "off"}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  {t("auth.form.emailLabel")}
                </label>
                <div className="mt-2">
                  <Input
                    ref={emailInputRef}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t("auth.form.emailPlaceholder")}
                    className="block h-11 w-full rounded-md border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900"
                  />
                </div>
              </div>

              {isPasswordView ? (
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                      {t("auth.form.passwordLabel")}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSignInViewChange("recovery")}
                      className="cursor-pointer text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      {t("auth.form.forgotPassword")}
                    </button>
                  </div>
                  <div className="mt-2 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={t("auth.form.passwordPlaceholder")}
                      className="block h-11 w-full rounded-md border-gray-300 bg-white px-3 py-1.5 pr-11 text-base text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? t("auth.form.hidePassword") : t("auth.form.showPassword")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" aria-hidden="true" />
                      ) : (
                        <Eye className="size-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    {isPasswordView ? (
                      <Lock className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-sm leading-6 text-gray-600">{helperText}</p>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  {isSubmitting ? t("auth.form.submitting") : entryContent.submitLabel}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <AuthVisualPanel />
    </div>
  );
}
