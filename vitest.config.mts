import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "apps/backoffice-pwa/src"),
      "@operapyme/domain": path.resolve(
        rootDir,
        "packages/domain/src/index.ts"
      ),
      "@operapyme/i18n": path.resolve(rootDir, "packages/i18n/src/index.ts"),
      "@operapyme/ui": path.resolve(rootDir, "packages/ui/src/index.ts")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./apps/backoffice-pwa/src/test/setup.ts"]
  }
});
