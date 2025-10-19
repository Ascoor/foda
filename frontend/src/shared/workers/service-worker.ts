/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const STATIC_CACHE = "foda-static-v1";
const API_CACHE = "foda-api-v1";
const ASSET_CACHE = "foda-assets-v1";
const DEFAULT_ICON = "/favicon.ico";
const DEFAULT_BADGE = "/favicon.ico";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, API_CACHE, ASSET_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  if (url.pathname.startsWith("/api")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (["style", "script", "font"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});

const networkFirst = async (request: Request, cacheName: string) => {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request: Request, cacheName: string) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached ?? networkFetch;
};

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const payload = event.data.json();

  const title = payload.notification?.title ?? payload.title ?? "Field Update";
  const options: NotificationOptions = {
    body: payload.notification?.body ?? payload.body ?? "تحديث جديد من الحملة.",
    icon: payload.notification?.icon ?? payload.icon ?? DEFAULT_ICON,
    data: payload,
    badge: payload.notification?.badge ?? payload.badge ?? DEFAULT_BADGE,
  };

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, options);
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      clients.forEach((client) =>
        client.postMessage({ type: "PUSH_NOTIFICATION", payload }),
      );
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url ?? "/volunteer/mobile";
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window" });
      for (const client of allClients) {
        const clientWindow = client as WindowClient;
        if (clientWindow.url.includes(target)) {
          return clientWindow.focus();
        }
      }
      return self.clients.openWindow(target);
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
