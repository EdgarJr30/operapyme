export {
  appNamespaces,
  defaultLanguage,
  isSupportedLanguage,
  languageLabels,
  supportedLanguages,
  translationNamespaces,
  type SupportedLanguage,
  type TranslationNamespace
} from "./config";
export { createAppI18n, type CreateAppI18nOptions } from "./create-app-i18n";

export { I18nextProvider, useTranslation } from "react-i18next";

export type { i18n as I18nInstance, TFunction } from "i18next";
