const CACHE = 'lanaeclat-v1';
const STATIC = [
  '/',
  '/index.html',
  '/services',
  '/about',
  '/gallery',
  '/contact',
];

// Install — cache static shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', (e) => {
  // Skip non-GET, admin routes and Supabase API calls
  if (
    e.request.method !== 'GET' ||
    e.request.url.includes('/admin') ||
    e.request.url.includes('supabase.co')
  ) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful page navigations
        if (res.ok && e.request.mode === 'navigate') {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/')))
  );
});
