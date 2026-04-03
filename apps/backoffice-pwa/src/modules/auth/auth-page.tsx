import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { motion } from "motion/react";

import { useTranslation } from "@operapyme/i18n";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backofficeTransition, pageTransitionVariants } from "@/lib/motion";
import { AuthHeroPanel } from "@/modules/auth/auth-hero-panel";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

type AuthMode = "signin" | "signup";
type SignInView = "password" | "magic_link" | "recovery";

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
          badge: t("auth.entry.signinEyebrow"),
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
          badge: t("auth.entry.signupEyebrow"),
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
            <div className="flex flex-col gap-7 rounded-4xl border border-line/60 bg-white px-6 py-6 shadow-soft sm:px-8 sm:py-8 lg:sticky lg:top-8 lg:min-h-[calc(100vh-4rem)]">

              {/* Top bar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/favicon.svg"
                    alt="OperaPyme"
                    className="h-8 w-8 rounded-xl"
                  />
                  <span className="text-sm font-semibold text-ink">
                    {t("auth.entry.brandLabel")}
                  </span>
                </div>
                <p className="flex flex-wrap items-center justify-end gap-x-1.5 text-sm text-ink-soft">
                  <span>{entryContent.switchLead}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode(mode === "signin" ? "signup" : "signin")
                    }
                    className="font-semibold text-brand transition hover:text-brand-hover"
                  >
                    {entryContent.switchAction}
                  </button>
                </p>
              </div>

              {/* Heading */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  {entryContent.badge}
                </p>
                <h2 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
                  {entryContent.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {entryContent.description}
                </p>
              </div>

              {/* Sign-in view tabs */}
              {!isFirstAccess ? (
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-line/70 bg-paper p-1">
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
                          ? "min-h-10 rounded-lg bg-white px-3 text-sm font-semibold text-ink shadow-panel"
                          : "min-h-10 rounded-lg px-3 text-sm font-medium text-ink-muted transition hover:text-ink"
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Form */}
              <form
                className="flex flex-1 flex-col gap-5"
                onSubmit={handleSubmit}
                autoComplete={isPasswordView ? "on" : "off"}
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-email"
                    className="block text-sm font-medium text-ink"
                  >
                    {t("auth.form.emailLabel")}
                  </label>
                  <Input
                    ref={emailInputRef}
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t("auth.form.emailPlaceholder")}
                    required
                    className="h-12 rounded-xl border-line/80 bg-white px-4 text-base"
                  />
                </div>

                {/* Password with eye toggle */}
                {isPasswordView ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor="auth-password"
                        className="block text-sm font-medium text-ink"
                      >
                        {t("auth.form.passwordLabel")}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSignInViewChange("recovery")}
                        className="text-sm font-semibold text-brand transition hover:text-brand-hover"
                      >
                        {t("auth.form.forgotPassword")}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={t("auth.form.passwordPlaceholder")}
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
                ) : null}

                {/* Helper text */}
                <p className="text-sm leading-6 text-ink-soft">{helperText}</p>

                {/* Submit */}
                <Button
                  className="flex w-full justify-center text-sm font-semibold"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("auth.form.submitting")
                    : entryContent.submitLabel}
                </Button>

                {/* Footer links */}
                <p className="mt-auto pt-4 text-center text-xs text-ink-muted">
                  <a
                    href="#"
                    className="transition hover:text-ink"
                    tabIndex={-1}
                  >
                    {t("auth.footer.privacy")}
                  </a>
                  {" · "}
                  <a
                    href="#"
                    className="transition hover:text-ink"
                    tabIndex={-1}
                  >
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
