import { appNamespaces, createAppI18n } from "@operapyme/i18n";

export function setupBackofficeI18n() {
  return createAppI18n({
    namespaces: appNamespaces.backoffice,
    languageStorageKey: "operapyme.backoffice.language"
  });
}
