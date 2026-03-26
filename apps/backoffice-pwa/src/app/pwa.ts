interface ServiceWorkerContainerLike {
  register: (scriptUrl: string) => Promise<unknown> | unknown;
}

interface NavigatorLike {
  serviceWorker?: ServiceWorkerContainerLike;
}

interface RegisterBackofficeServiceWorkerOptions {
  isProduction?: boolean;
  navigatorObject?: NavigatorLike;
}

export function registerBackofficeServiceWorker({
  isProduction = import.meta.env.PROD,
  navigatorObject =
    typeof navigator === "undefined" ? undefined : (navigator as NavigatorLike)
}: RegisterBackofficeServiceWorkerOptions = {}) {
  if (!isProduction || !navigatorObject?.serviceWorker) {
    return false;
  }

  void navigatorObject.serviceWorker.register("/sw.js");
  return true;
}
