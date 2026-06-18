// KINDRED service worker
// Strategy: network-first for pages/API (so product/order/journal data is
// always fresh after the admin makes changes), cache-first for static
// assets and images (so the app feels instant and works offline once visited).

const CACHE_NAME = "kindred-cache-v1";
const STATIC_CACHE_PATTERNS = [/\/_next\/static\//, /\/icons\//, /\/images\//];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

function isStaticAsset(url) {
  return STATIC_CACHE_PATTERNS.some((pattern) => pattern.test(url));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache admin or API routes — always hit the network so the admin
  // portal and live data (products/orders/journal) are never stale.
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/")) {
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // Network-first for everything else (pages), falling back to cache when offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match(request)))
  );
});
