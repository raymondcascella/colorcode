const CACHE = 'colorcode-v2';

const SHELL = [
  '/colorcode/',
  '/colorcode/src/main.js',
  '/colorcode/src/bag.js',
  '/colorcode/src/board.js',
  '/colorcode/src/game.js',
  '/colorcode/src/rules.js',
  '/colorcode/src/scoring.js',
  '/colorcode/src/ui.js',
  '/colorcode/manifest.json',
  '/colorcode/icons/icon-192.svg',
  '/colorcode/icons/icon-512.svg',
  '/colorcode/icons/icon-192.png',
  '/colorcode/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
