import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

function resolveOrigin(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const supabaseOrigin = resolveOrigin(env.VITE_SUPABASE_URL);

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "operapyme-resource-hints",
        transformIndexHtml(html) {
          if (!supabaseOrigin) {
            return html;
          }

          return {
            html,
            tags: [
              {
                tag: "link",
                attrs: {
                  rel: "dns-prefetch",
                  href: supabaseOrigin
                },
                injectTo: "head-prepend"
              },
              {
                tag: "link",
                attrs: {
                  rel: "preconnect",
                  href: supabaseOrigin,
                  crossorigin: ""
                },
                injectTo: "head-prepend"
              }
            ]
          };
        }
      }
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/packages/i18n/")) {
              return "i18n-core";
            }

            if (id.includes("/packages/ui/")) {
              return "design-system";
            }

            if (!id.includes("node_modules")) {
              return undefined;
            }

            if (
              id.includes("i18next") ||
              id.includes("react-i18next") ||
              id.includes("i18next-browser-languagedetector") ||
              id.includes("i18next-icu") ||
              id.includes("/@formatjs/") ||
              id.includes("intl-messageformat")
            ) {
              return "i18n-vendor";
            }

            if (id.includes("@supabase/")) {
              return "supabase-vendor";
            }

            if (id.includes("next-themes")) {
              return "theme-vendor";
            }

            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }

            if (
              id.includes("/clsx/") ||
              id.includes("/tailwind-merge/")
            ) {
              return "class-utils-vendor";
            }

            if (
              id.includes("react-hook-form") ||
              id.includes("@hookform/resolvers") ||
              id.includes("/zod/")
            ) {
              return "forms-vendor";
            }

            if (
              id.includes("/@react-pdf/") ||
              id.includes("/pdfkit/") ||
              id.includes("/fontkit/") ||
              id.includes("/restructure/") ||
              id.includes("/linebreak/") ||
              id.includes("/unicode-properties/") ||
              id.includes("/unicode-trie/") ||
              id.includes("/png-js/") ||
              id.includes("/jay-peg/") ||
              id.includes("/yoga-layout/")
            ) {
              return "pdf-vendor";
            }

            if (id.includes("/sonner/")) {
              return "feedback-vendor";
            }

            if (
              id.includes("/motion/") ||
              id.includes("/motion-dom/") ||
              id.includes("/framer-motion/")
            ) {
              return "motion-vendor";
            }

            if (
              id.includes("/@radix-ui/") ||
              id.includes("/@floating-ui/")
            ) {
              return "radix-vendor";
            }

            if (id.includes("react-router")) {
              return "router-vendor";
            }

            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }

            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("scheduler")
            ) {
              return "react-vendor";
            }

            return "vendor";
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@operapyme/i18n": fileURLToPath(
          new URL("../../packages/i18n/src/index.ts", import.meta.url)
        ),
        "@operapyme/domain": fileURLToPath(
          new URL("../../packages/domain/src/index.ts", import.meta.url)
        ),
        "@operapyme/ui": fileURLToPath(
          new URL("../../packages/ui/src/index.ts", import.meta.url)
        )
      }
    }
  };
});
