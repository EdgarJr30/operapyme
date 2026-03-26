import backofficeEn from "./resources/en/backoffice";
import commonEn from "./resources/en/common";
import storefrontEn from "./resources/en/storefront";
import backofficeEs from "./resources/es/backoffice";
import commonEs from "./resources/es/common";
import storefrontEs from "./resources/es/storefront";
import type {
  SupportedLanguage,
  TranslationNamespace
} from "./config";

export const bundledResources = {
  es: {
    common: commonEs,
    backoffice: backofficeEs,
    storefront: storefrontEs
  },
  en: {
    common: commonEn,
    backoffice: backofficeEn,
    storefront: storefrontEn
  }
} as const;

export function buildBundledResources(
  namespaces: readonly TranslationNamespace[]
) {
  const selectedNamespaces = new Set<TranslationNamespace>(namespaces);

  return Object.fromEntries(
    Object.entries(bundledResources).map(([language, resources]) => [
      language,
      Object.fromEntries(
        Object.entries(resources).filter(([namespace]) =>
          selectedNamespaces.has(namespace as TranslationNamespace)
        )
      )
    ])
  ) as Record<
    SupportedLanguage,
    Partial<Record<TranslationNamespace, (typeof bundledResources)["es"]["common"]>>
  >;
}
