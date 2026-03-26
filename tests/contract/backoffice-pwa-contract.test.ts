// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

describe("backoffice pwa contracts", () => {
  it("keeps the backoffice manifest installable and linked from the html entry", () => {
    const manifestPath = path.resolve(
      "apps/backoffice-pwa/public/manifest.webmanifest"
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      display: string;
      start_url: string;
      scope: string;
      icons: Array<{ purpose?: string; src: string }>;
    };
    const htmlEntry = fs.readFileSync(
      path.resolve("apps/backoffice-pwa/index.html"),
      "utf8"
    );

    expect(htmlEntry).toContain('rel="manifest"');
    expect(htmlEntry).toContain("/manifest.webmanifest");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(
      manifest.icons.some(
        (icon) => icon.src === "/pwa-icon.svg" && icon.purpose === "any"
      )
    ).toBe(true);
    expect(
      manifest.icons.some(
        (icon) =>
          icon.src === "/pwa-maskable.svg" && icon.purpose === "maskable"
      )
    ).toBe(true);
  });

  it("keeps the service worker precaching the app shell and manifest assets", () => {
    const serviceWorker = fs.readFileSync(
      path.resolve("apps/backoffice-pwa/public/sw.js"),
      "utf8"
    );

    expect(serviceWorker).toContain('"/manifest.webmanifest"');
    expect(serviceWorker).toContain('"/pwa-icon.svg"');
    expect(serviceWorker).toContain('"/pwa-maskable.svg"');
    expect(serviceWorker).toContain('self.addEventListener("fetch"');
    expect(serviceWorker).toContain('request.mode === "navigate"');
  });
});
