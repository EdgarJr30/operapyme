import { useTransition } from "react";

import {
  defaultLanguage,
  isSupportedLanguage,
  languageLabels,
  supportedLanguages,
  useTranslation
} from "@operapyme/i18n";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation("common");
  const [isPending, startTransition] = useTransition();

  const activeLanguage = isSupportedLanguage(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : defaultLanguage;

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor="language-switcher"
        className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted"
      >
        {t("language.label")}
      </label>
      <Select
        id="language-switcher"
        value={activeLanguage}
        className="w-full min-w-0 rounded-2xl border-line-strong bg-paper px-4 shadow-none"
        disabled={isPending}
        onChange={(event) => {
          const nextLanguage = event.target.value;

          if (
            !isSupportedLanguage(nextLanguage) ||
            nextLanguage === activeLanguage
          ) {
            return;
          }

          startTransition(() => {
            void i18n.changeLanguage(nextLanguage);
          });
        }}
      >
        {supportedLanguages.map((language) => (
          <option key={language} value={language}>
            {languageLabels[language]}
          </option>
        ))}
      </Select>
    </div>
  );
}
