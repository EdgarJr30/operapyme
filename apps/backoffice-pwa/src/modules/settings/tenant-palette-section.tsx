import { Check, LayoutDashboard, Store, SwatchBook } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import {
  buildThemeHeroStyle,
  buildThemeScopeStyle,
  formatContrastRatio,
  getContrastRatio,
  meetsAaContrast,
  useTenantTheme
} from "@operapyme/ui";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

type PreviewMode = "backoffice" | "storefront";

export function TenantPaletteSection() {
  const { t } = useTranslation("backoffice");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <CardTitle>{t("settings.palette.title")}</CardTitle>
            <CardDescription>
              {t("settings.palette.description")}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="success">
              {t("settings.palette.sharedBadge")}
            </StatusPill>
            <StatusPill tone="info">
              {t("settings.palette.previewBadge")}
            </StatusPill>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <PalettePreview mode="backoffice" darkMode={isDarkMode} />
            <PalettePreview mode="storefront" darkMode={isDarkMode} />
          </div>

          <div className="rounded-[24px] border border-dashed border-line/70 bg-paper/72 p-4">
            <p className="text-sm font-semibold text-ink">
              {t("settings.palette.ruleTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t("settings.palette.ruleText")}
            </p>
          </div>

          <div className="rounded-[24px] border border-line/70 bg-paper/72 p-4">
            <p className="text-sm font-semibold text-ink">
              {t("settings.palette.storageTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t("settings.palette.storageText")}
            </p>
          </div>
        </CardContent>
      </Card>

      <PaletteSelectionGrid />
    </section>
  );
}

function PaletteSelectionGrid() {
  const { t } = useTranslation("backoffice");
  const { paletteId, palettes, setPaletteId } = useTenantTheme();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {palettes.map((palette) => {
        const contrastRatio = getContrastRatio(
          palette.colors.ink,
          palette.colors.primary400
        );
        const isSelected = palette.id === paletteId;

        return (
          <button
            key={palette.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => setPaletteId(palette.id)}
            className={cn(
              "rounded-[26px] border p-4 text-left transition",
              isSelected
                ? "border-brand bg-paper/92 shadow-panel"
                : "border-line/70 bg-paper/72 hover:border-brand/45 hover:bg-paper/88"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {t(`theme.palettes.${palette.id}.name`, { ns: "common" })}
                  </p>
                  {isSelected ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-brand text-brand-contrast">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                  ) : null}
                </div>
                <p className="text-sm leading-6 text-ink-soft">
                  {t(`theme.palettes.${palette.id}.description`, {
                    ns: "common"
                  })}
                </p>
              </div>

              <StatusPill tone={isSelected ? "success" : "neutral"}>
                {isSelected
                  ? t("settings.palette.active")
                  : t("settings.palette.apply")}
              </StatusPill>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <PaletteSwatch color={palette.colors.primary400} />
              <PaletteSwatch color={palette.colors.secondary400} />
              <PaletteSwatch color={palette.colors.tertiary400} />
              <PaletteSwatch color={palette.colors.paper} bordered />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
              <span className="rounded-full bg-sand-strong px-3 py-1 font-medium text-ink">
                {t("settings.palette.contrastLabel")}{" "}
                {formatContrastRatio(contrastRatio)}
              </span>
              <span className="rounded-full bg-paper px-3 py-1">
                {meetsAaContrast(contrastRatio)
                  ? t("theme.aaReady", { ns: "common" })
                  : t("settings.palette.reviewLabel")}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PaletteSwatch({
  color,
  bordered = false
}: {
  color: string;
  bordered?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-8 w-8 rounded-full",
        bordered ? "border border-line/70" : ""
      )}
      style={{ backgroundColor: color }}
    />
  );
}

function PalettePreview({
  mode,
  darkMode
}: {
  mode: PreviewMode;
  darkMode: boolean;
}) {
  const { t } = useTranslation("backoffice");
  const { paletteId } = useTenantTheme();
  const scopeStyle = buildThemeScopeStyle(paletteId, mode, darkMode);
  const heroStyle = buildThemeHeroStyle(paletteId, mode, darkMode);

  return (
    <div
      className="rounded-[28px] border p-4 shadow-panel"
      style={scopeStyle}
    >
      <div
        className="rounded-[24px] border border-white/30 p-4 shadow-panel"
        style={heroStyle}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-paper/80 text-ink">
            {mode === "backoffice" ? (
              <LayoutDashboard className="size-4" aria-hidden="true" />
            ) : (
              <Store className="size-4" aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              {t(
                mode === "backoffice"
                  ? "settings.palette.backofficeTitle"
                  : "settings.palette.storefrontTitle"
              )}
            </p>
            <p className="text-xs leading-5 text-ink-soft">
              {t(
                mode === "backoffice"
                  ? "settings.palette.backofficeDescription"
                  : "settings.palette.storefrontDescription"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between rounded-[20px] border border-line/70 bg-paper/82 px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-ink">
              {t("settings.palette.previewCardTitle")}
            </p>
            <p className="text-xs leading-5 text-ink-soft">
              {t("settings.palette.previewCardDescription")}
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full bg-sage-200/80 text-ink">
            <SwatchBook className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[20px] border border-line/70 bg-paper/82 px-4 py-3">
          <p className="text-sm font-medium text-ink">
            {t("settings.palette.previewCta")}
          </p>
          <span className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-contrast shadow-soft">
            {t("settings.palette.previewAction")}
          </span>
        </div>
      </div>
    </div>
  );
}
