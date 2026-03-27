import { FormEvent, useRef, useState } from "react";

import { ShieldCheck } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === "signed_in") {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  const isFirstAccess = mode === "signup";
  const isPasswordView = !isFirstAccess && signInView === "password";
  const isRecoveryView = !isFirstAccess && signInView === "recovery";
  const isMagicLinkView = isFirstAccess || signInView === "magic_link";

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
    focusEmailField();
  }

  function handleSignInViewChange(nextView: SignInView) {
    setSignInView(nextView);
    if (nextView !== "password") {
      setPassword("");
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

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:flex-none lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                src="/favicon.svg"
                alt="OperaPyme"
                className="h-10 w-auto rounded-xl"
              />
              <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {entryContent.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {entryContent.switchLead}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setAuthMode(mode === "signin" ? "signup" : "signin")
                  }
                  className="font-semibold text-[#1f2c38] transition hover:text-[#17212b]"
                >
                  {entryContent.switchAction}
                </button>
              </p>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {entryContent.description}
              </p>
            </div>

            {!isFirstAccess ? (
              <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-line/70 bg-sand/35 p-1">
                <button
                  type="button"
                  onClick={() => handleSignInViewChange("password")}
                  className={
                    signInView === "password"
                      ? "min-h-11 rounded-xl bg-paper px-3 text-sm font-semibold text-ink shadow-panel"
                      : "min-h-11 rounded-xl px-3 text-sm font-medium text-ink-soft transition hover:bg-paper/70 hover:text-ink"
                  }
                >
                  {t("auth.form.passwordTab")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSignInViewChange("magic_link")}
                  className={
                    signInView === "magic_link"
                      ? "min-h-11 rounded-xl bg-paper px-3 text-sm font-semibold text-ink shadow-panel"
                      : "min-h-11 rounded-xl px-3 text-sm font-medium text-ink-soft transition hover:bg-paper/70 hover:text-ink"
                  }
                >
                  {t("auth.form.magicLinkTab")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSignInViewChange("recovery")}
                  className={
                    signInView === "recovery"
                      ? "min-h-11 rounded-xl bg-paper px-3 text-sm font-semibold text-ink shadow-panel"
                      : "min-h-11 rounded-xl px-3 text-sm font-medium text-ink-soft transition hover:bg-paper/70 hover:text-ink"
                  }
                >
                  {t("auth.form.recoveryTab")}
                </button>
              </div>
            ) : null}

            <div className="mt-8">
              <form
                className="space-y-5"
                onSubmit={handleSubmit}
                autoComplete={isPasswordView ? "on" : "off"}
              >
                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-sm font-medium text-ink"
                  >
                    {t("auth.form.emailLabel")}
                  </label>
                  <div className="mt-2">
                    <Input
                      ref={emailInputRef}
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t("auth.form.emailPlaceholder")}
                      required
                      className="rounded-xl border-line/80 bg-white"
                    />
                  </div>
                </div>

                {isPasswordView ? (
                  <div>
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
                        className="text-xs font-semibold text-[#1f2c38] transition hover:text-[#17212b]"
                      >
                        {t("auth.form.forgotPassword")}
                      </button>
                    </div>
                    <div className="mt-2">
                      <Input
                        id="auth-password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={t("auth.form.passwordPlaceholder")}
                        required
                        className="rounded-xl border-line/80 bg-white"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-line/70 bg-sand/35 px-4 py-3">
                  <p className="text-sm leading-6 text-ink-soft">
                    {isRecoveryView
                      ? t("auth.form.recoveryHelper")
                      : isPasswordView
                        ? t("auth.form.passwordHelper")
                        : isFirstAccess
                          ? t("auth.form.firstAccessHelper")
                          : t("auth.form.magicLinkHelper")}
                  </p>
                </div>

                <div>
                  <Button
                    className="flex w-full justify-center rounded-xl bg-[#1f2c38] text-sm font-semibold text-white shadow-none hover:bg-[#17212b]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("auth.form.submitting")
                      : entryContent.submitLabel}
                  </Button>
                </div>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-line/70" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium">
                    <span className="bg-white px-6 text-ink">
                      {t("auth.form.noteTitle")}
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-line/70 bg-white px-4 py-3">
                  <p className="text-sm leading-6 text-ink-soft">
                    {isPasswordView
                      ? t("auth.form.noteTextPassword")
                      : t("auth.form.noteText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 overflow-hidden lg:block">
          <div className="absolute inset-0 bg-paper" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(234,199,74,0.22)_1px,transparent_1.5px)] bg-size-[18px_18px] opacity-65" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
            <div className="relative w-full max-w-lg">
              <div className="rounded-[22px] border border-paper/60 bg-paper/95 p-4 shadow-soft">
                <div className="flex items-center gap-2 border-b border-line/60 pb-3">
                  <span className="size-2.5 rounded-full bg-peach-300" />
                  <span className="size-2.5 rounded-full bg-butter-200" />
                  <span className="size-2.5 rounded-full bg-sage-300" />
                  <div className="ml-3 h-2.5 flex-1 rounded-full bg-sand-strong/75" />
                </div>

                <div className="grid gap-3 pt-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-12 rounded-xl bg-sand-strong/75" />
                    <div className="h-12 rounded-xl bg-sage-200/70" />
                    <div className="h-12 rounded-xl bg-sky-200/70" />
                    <div className="h-12 rounded-xl bg-peach-200/70" />
                  </div>

                  <div className="rounded-[18px] border border-line/60 bg-white p-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`auth-visual-row-${index}`}
                        className="grid grid-cols-[1.1fr_0.8fr_0.5fr] gap-2 border-b border-line/35 px-1 py-2 last:border-b-0"
                      >
                        <div className="h-2.5 rounded-full bg-line/80" />
                        <div className="h-2.5 rounded-full bg-line/55" />
                        <div className="h-2.5 rounded-full bg-butter-200/90" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -left-5 bottom-5 w-24 rounded-3xl border border-line/70 bg-paper/95 p-3 shadow-panel">
                <div className="rounded-xl bg-butter-200 px-3 py-3" />
                <div className="mt-3 space-y-2">
                  <div className="h-7 rounded-xl bg-sand-strong/75" />
                  <div className="h-2 rounded-full bg-line/80" />
                  <div className="h-2 w-4/5 rounded-full bg-line/60" />
                </div>
              </div>

              <div className="absolute -right-5 bottom-3 flex size-20 items-center justify-center rounded-[28px] border border-line/70 bg-paper/95 shadow-panel">
                <ShieldCheck className="size-8 text-ink" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-10 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-ink xl:text-5xl">
                {t("auth.hero.title")}
              </h2>
              <p className="mt-4 text-lg text-ink-soft">
                {t("auth.hero.description")}
              </p>
              <div className="mt-10 flex items-center justify-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-[#ab8500]" />
                <span className="h-1.5 w-3 rounded-full bg-butter-200" />
                <span className="h-1.5 w-3 rounded-full bg-butter-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
