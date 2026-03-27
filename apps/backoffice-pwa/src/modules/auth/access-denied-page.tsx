import { ShieldOff } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AccessDeniedPage() {
  const { t } = useTranslation("backoffice");
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center px-4 py-8">
      <Card className="w-full">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
            <ShieldOff className="size-5 text-ink" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
              {t("accessDenied.eyebrow")}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t("accessDenied.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-ink-soft">
              {t("accessDenied.description")}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              navigate("/");
            }}
          >
            {t("accessDenied.backHome")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
