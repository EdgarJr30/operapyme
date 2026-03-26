import LanguageDetector from "i18next-browser-languagedetector";
import { createInstance } from "i18next";
import ICU from "i18next-icu";
import { initReactI18next } from "react-i18next";

import {
  defaultLanguage,
  isSupportedLanguage,
  supportedLanguages,
} from "./config";
import { bundledResources } from "./resources";
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

export function createAppI18n({
  namespaces,
  languageStorageKey = "operapyme.language"
}: CreateAppI18nOptions) {
  const instance = createInstance();

  instance.use(ICU);
  instance.use(LanguageDetector);
  instance.use(initReactI18next);

  void instance.init({
    fallbackLng: defaultLanguage,
    supportedLngs: [...supportedLanguages],
    ns: [...namespaces],
    defaultNS: "common",
    fallbackNS: "common",
    resources: bundledResources,
    load: "languageOnly",
    cleanCode: true,
    nonExplicitSupportedLngs: true,
    initImmediate: false,
    returnNull: false,
    interpolation: {
      escapeValue: false
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

  syncDocumentLanguage(instance.resolvedLanguage ?? defaultLanguage);

  instance.on("languageChanged", (language) => {
    syncDocumentLanguage(language);
  });

  return instance;
}
