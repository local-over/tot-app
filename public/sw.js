const CACHE_NAME = 'tot-cache-v1';
const API_CACHE = 'tot-api-cache-v1';

const PRECACHE_ASSETS = [
  '/',
  '/app',
  '/auth',
  '/setup',
  '/gate',
  '/manifest.json',
  '/logo_black.png',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Exclude Appwrite API and DodoPayments from Service Worker to avoid breaking auth and checkout
  if (url.origin.includes('appwrite.io') || url.origin.includes('dodopayments.com')) {
    return;
  }

  // Handle local API requests (like /api/topics/today)
  if (url.pathname.startsWith('/api/')) {
    // Exclude checkout API
    if (url.pathname === '/api/checkout') return;

    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          // Only cache successful GET responses
          if (networkResponse.ok && request.method === 'GET') {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // Fallback to cache if network fails (offline)
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          throw err;
        }
      })
    );
    return;
  }

  // Handle static assets and HTML pages
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const networkFetch = fetch(request).then(networkResponse => {
        if (networkResponse.ok && request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(err => {
        // If offline and no cache is found, returning cached response if exists
      });

      // Stale-while-revalidate pattern for fast loading
      return cachedResponse || networkFetch;
    })
  );
});
