import { FormEvent, useState } from "react";

import { MailCheck, ShieldEllipsis } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { Navigate } from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

export function AuthPage() {
  const { t } = useTranslation("backoffice");
  const { isConfigured, isBootstrapped, signInWithOtp, status } =
    useBackofficeAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === "signed_in") {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setEmailSent(false);

    const nextError = await signInWithOtp(email.trim());

    setIsSubmitting(false);

    if (nextError) {
      setError(nextError);
      return;
    }

    setEmailSent(true);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6">
      <div className="grid w-full gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="overflow-hidden bg-linear-to-br from-paper via-paper to-sage-200/50">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
              {t("auth.hero.eyebrow")}
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("auth.hero.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
              {t("auth.hero.description")}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-line/70 bg-paper/85 p-4">
                <p className="text-sm font-semibold text-ink">
                  {t("auth.hero.cardRbacTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("auth.hero.cardRbacText")}
                </p>
              </div>
              <div className="rounded-[24px] border border-line/70 bg-paper/85 p-4">
                <p className="text-sm font-semibold text-ink">
                  {t("auth.hero.cardAuditTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("auth.hero.cardAuditText")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("auth.form.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-ink"
                  htmlFor="auth-email"
                >
                  {t("auth.form.emailLabel")}
                </label>
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("auth.form.emailPlaceholder")}
                  required
                />
              </div>

              {error ? (
                <p className="rounded-2xl border border-rose-300/80 bg-rose-100/80 px-4 py-3 text-sm text-rose-900">
                  {error}
                </p>
              ) : null}

              {emailSent ? (
                <div className="rounded-[24px] border border-line/70 bg-sage-200/45 p-4">
                  <div className="flex items-start gap-3">
                    <MailCheck className="mt-1 size-4 shrink-0 text-ink" />
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {t("auth.form.emailSentTitle")}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-soft">
                        {t("auth.form.emailSentText", { email })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("auth.form.submitting")
                  : t("auth.form.submit")}
              </Button>
            </form>

            <div className="rounded-[24px] border border-line/70 bg-paper/70 p-4">
              <div className="flex items-start gap-3">
                <ShieldEllipsis className="mt-1 size-4 shrink-0 text-ink" />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {t("auth.form.noteTitle")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {t("auth.form.noteText")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
