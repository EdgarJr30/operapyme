import { useTransition } from "react";

import {
  defaultLanguage,
  isSupportedLanguage,
  languageLabels,
  supportedLanguages,
  useTranslation
} from "@operapyme/i18n";

import { Select } from "@/components/ui/select";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation("common");
  const [isPending, startTransition] = useTransition();

  const activeLanguage = isSupportedLanguage(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : defaultLanguage;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="language-switcher"
        className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted"
      >
        {t("language.label")}
      </label>
      <Select
        id="language-switcher"
        value={activeLanguage}
        className="w-32"
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
