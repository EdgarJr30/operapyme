import { vi } from "vitest";

import { registerBackofficeServiceWorker } from "@/app/pwa";

describe("backoffice pwa registration", () => {
  it("skips the service worker outside production", () => {
    const register = vi.fn();

    expect(
      registerBackofficeServiceWorker({
        isProduction: false,
        navigatorObject: {
          serviceWorker: {
            register
          }
        }
      })
    ).toBe(false);
    expect(register).not.toHaveBeenCalled();
  });

  it("skips the service worker when the browser api is unavailable", () => {
    expect(
      registerBackofficeServiceWorker({
        isProduction: true,
        navigatorObject: {}
      })
    ).toBe(false);
  });

  it("registers the service worker in production browsers", () => {
    const register = vi.fn().mockResolvedValue(undefined);

    expect(
      registerBackofficeServiceWorker({
        isProduction: true,
        navigatorObject: {
          serviceWorker: {
            register
          }
        }
      })
    ).toBe(true);
    expect(register).toHaveBeenCalledWith("/sw.js");
  });
});
