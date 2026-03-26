import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
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
            id.includes("i18next-browser-languagedetector")
          ) {
            return "i18n-vendor";
          }

          if (
            id.includes("@supabase/") ||
            id.includes("@tanstack/react-query")
          ) {
            return "data-vendor";
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
});
