import { useEffect, useRef, useState } from "react";

import { Check, LayoutDashboard, RotateCcw, Store, SwatchBook } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import {
  buildThemeHeroStyle,
  buildThemeScopeStyle,
  defaultCustomThemePaletteSeeds,
  formatContrastRatio,
  getContrastRatio,
  meetsAaContrast,
  pickBestContrastColor,
  useTenantTheme,
  type ThemePaletteDefinition,
  type ThemePaletteSeedColors,
  type ThemePaletteSelectionId
} from "@operapyme/ui";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

          <div className="rounded-3xl border border-dashed border-line/70 bg-paper/72 p-4">
            <p className="text-sm font-semibold text-ink">
              {t("settings.palette.ruleTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t("settings.palette.ruleText")}
            </p>
          </div>

          <div className="rounded-3xl border border-line/70 bg-paper/72 p-4">
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

export function CompactTenantPaletteSelector() {
  const { t } = useTranslation("backoffice");
  const { paletteId, palettes, customPalette, setPaletteId } = useTenantTheme();

  const items: Array<{
    id: ThemePaletteSelectionId;
    palette: ThemePaletteDefinition;
    contrastRatio: number;
  }> = [
    {
      id: "custom",
      palette: customPalette,
      contrastRatio: getContrastRatio(
        pickBestContrastColor(customPalette.colors.primary400),
        customPalette.colors.primary400
      )
    },
    ...palettes.map((palette) => ({
      id: palette.id,
      palette,
      contrastRatio: getContrastRatio(
        pickBestContrastColor(palette.colors.primary400),
        palette.colors.primary400
      )
    }))
  ];

  const activeItem =
    items.find((item) => item.id === paletteId) ?? items[0];

  function showPaletteToast(nextPaletteId: ThemePaletteSelectionId) {
    toast.success(t("settings.palette.toastTitle"), {
      description: t("settings.palette.toastDescription", {
        palette: t(`theme.palettes.${nextPaletteId}.name`, { ns: "common" })
      })
    });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-line/70 bg-paper p-5">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink">
          {t("setup.paletteTitle")}
        </p>
        <p className="text-sm leading-6 text-ink-soft">
          {t("setup.paletteDescription")}
        </p>
      </div>

      <div className="rounded-2xl border border-line/70 bg-sand/35 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              {t("setup.review.paletteLabel")}
            </p>
            <p className="text-base font-semibold text-ink">
              {t(`theme.palettes.${activeItem.id}.name`, { ns: "common" })}
            </p>
            <p className="text-sm leading-6 text-ink-soft">
              {t(`theme.palettes.${activeItem.id}.description`, {
                ns: "common"
              })}
            </p>
          </div>
          <StatusPill tone="success">{t("settings.palette.active")}</StatusPill>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <PaletteSwatch color={activeItem.palette.colors.primary400} />
          <PaletteSwatch color={activeItem.palette.colors.secondary400} />
          <PaletteSwatch color={activeItem.palette.colors.tertiary400} />
          <PaletteSwatch color={activeItem.palette.colors.paper} bordered />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map(({ id, palette, contrastRatio }) => {
          const isSelected = id === paletteId;

          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                if (id !== paletteId) {
                  setPaletteId(id);
                  showPaletteToast(id);
                }
              }}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                isSelected
                  ? "border-brand bg-brand-soft/12 shadow-sm"
                  : "border-line/70 bg-paper hover:border-brand/30 hover:bg-sand/28"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink">
                    {t(`theme.palettes.${id}.name`, { ns: "common" })}
                  </p>
                  <p className="text-sm leading-6 text-ink-soft">
                    {t(`theme.palettes.${id}.description`, { ns: "common" })}
                  </p>
                </div>
                {isSelected ? (
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand text-brand-contrast">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <PaletteSwatch color={palette.colors.primary400} />
                <PaletteSwatch color={palette.colors.secondary400} />
                <PaletteSwatch color={palette.colors.tertiary400} />
                <PaletteSwatch color={palette.colors.paper} bordered />
              </div>

              <p className="mt-4 text-xs font-medium text-ink-soft">
                {t("settings.palette.contrastLabel")} {formatContrastRatio(contrastRatio)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PaletteSelectionGrid({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation("backoffice");
  const {
    paletteId,
    palettes,
    customPalette,
    setPaletteId,
    setCustomPalette,
    resetCustomPalette
  } = useTenantTheme();
  const [customDraft, setCustomDraft] = useState<ThemePaletteSeedColors>(
    customPalette.seeds
  );
  const customToastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setCustomDraft(customPalette.seeds);
  }, [customPalette.seeds]);

  useEffect(() => {
    return () => {
      if (customToastTimeoutRef.current) {
        window.clearTimeout(customToastTimeoutRef.current);
      }
    };
  }, []);

  const customContrastRatio = getContrastRatio(
    pickBestContrastColor(customPalette.colors.primary400),
    customPalette.colors.primary400
  );

  const items: Array<{
    id: ThemePaletteSelectionId;
    palette: ThemePaletteDefinition;
    contrastRatio: number;
  }> = [
    {
      id: "custom",
      palette: customPalette,
      contrastRatio: customContrastRatio
    },
    ...palettes.map((palette) => ({
      id: palette.id,
      palette,
      contrastRatio: getContrastRatio(
        pickBestContrastColor(palette.colors.primary400),
        palette.colors.primary400
      )
    }))
  ];

  function showPaletteToast(nextPaletteId: ThemePaletteSelectionId) {
    toast.success(t("settings.palette.toastTitle"), {
      description: t("settings.palette.toastDescription", {
        palette: t(`theme.palettes.${nextPaletteId}.name`, { ns: "common" })
      })
    });
  }

  function scheduleCustomPaletteToast(nextDraft: ThemePaletteSeedColors) {
    if (customToastTimeoutRef.current) {
      window.clearTimeout(customToastTimeoutRef.current);
    }

    customToastTimeoutRef.current = window.setTimeout(() => {
      setCustomPalette(nextDraft);
      showPaletteToast("custom");
      customToastTimeoutRef.current = null;
    }, 320);
  }

  return (
    <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-1")}>
      {items.map(({ id, palette, contrastRatio }) => {
        const isSelected = id === paletteId;
        const isCustom = id === "custom";

        return (
          <div
            key={id}
            className={cn(
              "rounded-3xl border p-4 transition",
              isSelected
                ? "border-brand bg-paper/92 shadow-panel"
                : "border-line/70 bg-paper/72"
            )}
          >
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                if (id !== paletteId) {
                  setPaletteId(id);
                  showPaletteToast(id);
                }
              }}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {t(`theme.palettes.${id}.name`, { ns: "common" })}
                    </p>
                    {isSelected ? (
                      <span className="flex size-5 items-center justify-center rounded-full bg-brand text-brand-contrast">
                        <Check className="size-3" aria-hidden="true" />
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-6 text-ink-soft">
                    {t(`theme.palettes.${id}.description`, {
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
                {isCustom ? (
                  <span className="rounded-full bg-paper px-3 py-1">
                    {t("settings.palette.customBadge")}
                  </span>
                ) : null}
              </div>
            </button>

            {isCustom && isSelected ? (
              <div className="mt-4 space-y-4 border-t border-line/70 pt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ColorSeedField
                    label={t("settings.palette.custom.paperLabel")}
                    value={customDraft.paper}
                    onChange={(value) => {
                      const nextDraft = { ...customDraft, paper: value };
                      setCustomDraft(nextDraft);
                      scheduleCustomPaletteToast(nextDraft);
                    }}
                  />
                  <ColorSeedField
                    label={t("settings.palette.custom.primaryLabel")}
                    value={customDraft.primary}
                    onChange={(value) => {
                      const nextDraft = { ...customDraft, primary: value };
                      setCustomDraft(nextDraft);
                      scheduleCustomPaletteToast(nextDraft);
                    }}
                  />
                  <ColorSeedField
                    label={t("settings.palette.custom.secondaryLabel")}
                    value={customDraft.secondary}
                    onChange={(value) => {
                      const nextDraft = { ...customDraft, secondary: value };
                      setCustomDraft(nextDraft);
                      scheduleCustomPaletteToast(nextDraft);
                    }}
                  />
                  <ColorSeedField
                    label={t("settings.palette.custom.tertiaryLabel")}
                    value={customDraft.tertiary}
                    onChange={(value) => {
                      const nextDraft = { ...customDraft, tertiary: value };
                      setCustomDraft(nextDraft);
                      scheduleCustomPaletteToast(nextDraft);
                    }}
                  />
                </div>

                <div className="rounded-3xl border border-line/70 bg-sand/70 p-4">
                  <p className="text-sm font-semibold text-ink">
                    {t("settings.palette.custom.helperTitle")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {t("settings.palette.custom.helperText")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (customToastTimeoutRef.current) {
                        window.clearTimeout(customToastTimeoutRef.current);
                        customToastTimeoutRef.current = null;
                      }
                      setCustomDraft(defaultCustomThemePaletteSeeds);
                      resetCustomPalette();
                      showPaletteToast("custom");
                    }}
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    {t("settings.palette.custom.reset")}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ColorSeedField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-line/70 bg-paper/82 px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-12 cursor-pointer rounded-xl border border-line/70 bg-transparent p-1"
        />
        <code className="text-sm font-semibold uppercase text-ink">{value}</code>
      </div>
    </label>
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
  const { activePalette } = useTenantTheme();
  const scopeStyle = buildThemeScopeStyle(activePalette, mode, darkMode);
  const heroStyle = buildThemeHeroStyle(activePalette, mode, darkMode);

  return (
    <div className="rounded-[28px] border p-4 shadow-panel" style={scopeStyle}>
      <div
        className="rounded-3xl border border-white/30 p-4 shadow-panel"
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
