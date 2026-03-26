import backofficeEn from "./resources/en/backoffice";
import commonEn from "./resources/en/common";
import storefrontEn from "./resources/en/storefront";
import backofficeEs from "./resources/es/backoffice";
import commonEs from "./resources/es/common";
import storefrontEs from "./resources/es/storefront";

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
