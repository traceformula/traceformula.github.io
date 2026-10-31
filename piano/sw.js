// Network-first service worker for /piano/.
// GitHub Pages caches files for 10 minutes and that can't be changed, so every
// request goes to the network with `cache: 'no-cache'` (a cheap 304 check when
// nothing changed). The last good copy is kept for offline use.
const CACHE = 'piano-tools';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // e.g. Google Fonts: browser default
  e.respondWith((async () => {
    try {
      const res = await fetch(url.href, { cache: 'no-cache', credentials: 'same-origin' });
      if (res.ok) {
        const c = await caches.open(CACHE);
        await c.put(url.href, res.clone());
      }
      return res;
    } catch (err) {
      const hit = await caches.match(url.href);
      if (hit) return hit;
      throw err;
    }
  })());
});
