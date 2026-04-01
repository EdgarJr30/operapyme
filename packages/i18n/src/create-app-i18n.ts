import LanguageDetector from "i18next-browser-languagedetector";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import {
  defaultLanguage,
  isSupportedLanguage,
  supportedLanguages,
} from "./config";
import { buildBundledResources, loadLanguageResources } from "./resources";
import type { TranslationNamespace } from "./config";

export interface CreateAppI18nOptions {
  namespaces: readonly TranslationNamespace[];
  languageStorageKey?: string;
}

function syncDocumentLanguage(language: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = isSupportedLanguage(language)
    ? language
    : defaultLanguage;
}

function detectPreferredLanguage(languageStorageKey: string) {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const queryLanguage = new URLSearchParams(window.location.search).get("lang");

  if (isSupportedLanguage(queryLanguage ?? undefined)) {
    return queryLanguage;
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);

  if (isSupportedLanguage(storedLanguage ?? undefined)) {
    return storedLanguage;
  }

  return defaultLanguage;
}

export function createAppI18n({
  namespaces,
  languageStorageKey = "operapyme.language"
}: CreateAppI18nOptions) {
  const instance = createInstance();
  const resources = buildBundledResources(namespaces);
  const preferredLanguage = detectPreferredLanguage(languageStorageKey);
  const loadedLanguages = new Set<string>([defaultLanguage]);
  const originalChangeLanguage = instance.changeLanguage.bind(instance);

  async function ensureLanguageResources(language: string) {
    if (!isSupportedLanguage(language) || loadedLanguages.has(language)) {
      return;
    }

    const nextResources = await loadLanguageResources(language, namespaces);

    for (const [namespace, resource] of Object.entries(nextResources)) {
      if (!resource) {
        continue;
      }

      instance.addResourceBundle(
        language,
        namespace,
        resource,
        true,
        true
      );
    }

    loadedLanguages.add(language);
  }

  instance.use(LanguageDetector);
  instance.use(initReactI18next);

  void instance.init({
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: [...supportedLanguages],
    ns: [...namespaces],
    defaultNS: "common",
    fallbackNS: "common",
    resources,
    load: "languageOnly",
    cleanCode: true,
    nonExplicitSupportedLngs: true,
    initImmediate: false,
    returnNull: false,
    interpolation: {
      escapeValue: false,
      prefix: "{",
      suffix: "}"
    },
    detection: {
      order: ["querystring", "localStorage"],
      lookupQuerystring: "lang",
      lookupLocalStorage: languageStorageKey,
      caches: ["localStorage"]
    },
    react: {
      useSuspense: false
    }
  });

  instance.changeLanguage = async (language, ...args) => {
    if (language) {
      await ensureLanguageResources(language);
    }

    return originalChangeLanguage(language, ...args);
  };

  syncDocumentLanguage(instance.resolvedLanguage ?? defaultLanguage);

  instance.on("languageChanged", (language) => {
    syncDocumentLanguage(language);
  });

  if (
    preferredLanguage &&
    preferredLanguage !== defaultLanguage
  ) {
    void instance.changeLanguage(preferredLanguage);
  }

  return instance;
}
