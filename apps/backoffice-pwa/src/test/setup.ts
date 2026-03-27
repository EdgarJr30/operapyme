import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn()
  },
  Toaster: () => null
}));

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });

  if (typeof window.AbortController !== "undefined") {
    globalThis.AbortController = window.AbortController;
  }

  if (typeof window.AbortSignal !== "undefined") {
    globalThis.AbortSignal = window.AbortSignal;
  }

  if (typeof window.Headers !== "undefined") {
    globalThis.Headers = window.Headers;
  }

  if (typeof window.Request !== "undefined") {
    globalThis.Request = window.Request;
  }

  if (typeof window.Response !== "undefined") {
    globalThis.Response = window.Response;
  }

  if (typeof window.fetch !== "undefined") {
    globalThis.fetch = window.fetch.bind(window);
  }
}
