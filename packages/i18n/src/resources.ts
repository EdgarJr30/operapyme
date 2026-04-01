import commonEs from "./resources/es/common";
import storefrontEs from "./resources/es/storefront";
import backofficeEs from "./resources/es/backoffice";
import type {
  SupportedLanguage,
  TranslationNamespace
} from "./config";

type ResourceDictionary = Record<string, unknown>;

const defaultLanguageResources = {
  common: commonEs,
  backoffice: backofficeEs,
  storefront: storefrontEs
} as const satisfies Record<TranslationNamespace, ResourceDictionary>;

const resourceLoaders: Record<
  SupportedLanguage,
  Record<TranslationNamespace, () => Promise<ResourceDictionary>>
> = {
  es: {
    common: async () => commonEs,
    backoffice: async () => backofficeEs,
    storefront: async () => storefrontEs
  },
  en: {
    common: async () => (await import("./resources/en/common")).default,
    backoffice: async () => (await import("./resources/en/backoffice")).default,
    storefront: async () => (await import("./resources/en/storefront")).default
  }
};

export function buildBundledResources(
  namespaces: readonly TranslationNamespace[]
) {
  const selectedNamespaces = new Set<TranslationNamespace>(namespaces);

  return {
    es: Object.fromEntries(
      Object.entries(defaultLanguageResources).filter(([namespace]) =>
        selectedNamespaces.has(namespace as TranslationNamespace)
      )
    )
  } as Record<"es", Partial<Record<TranslationNamespace, ResourceDictionary>>>;
}

export async function loadLanguageResources(
  language: SupportedLanguage,
  namespaces: readonly TranslationNamespace[]
) {
  const selectedNamespaces = [...new Set(namespaces)];
  const resources = await Promise.all(
    selectedNamespaces.map(async (namespace) => [
      namespace,
      await resourceLoaders[language][namespace]()
    ] as const)
  );

  return Object.fromEntries(resources) as Partial<
    Record<TranslationNamespace, ResourceDictionary>
  >;
}
