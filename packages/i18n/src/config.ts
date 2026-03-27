export const defaultLanguage = "es" as const;

export const supportedLanguages = ["es", "en"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const translationNamespaces = [
  "common",
  "backoffice",
  "storefront"
] as const;

export type TranslationNamespace = (typeof translationNamespaces)[number];

export const appNamespaces = {
  backoffice: ["common", "backoffice"] as const,
  storefront: ["common", "storefront"] as const
};

export const languageLabels: Record<SupportedLanguage, string> = {
  es: "Español",
  en: "English"
};

export function isSupportedLanguage(
  language: string | undefined
): language is SupportedLanguage {
  return supportedLanguages.includes(language as SupportedLanguage);
}

export function isTranslationNamespace(
  namespace: string | undefined
): namespace is TranslationNamespace {
  return translationNamespaces.includes(namespace as TranslationNamespace);
}
