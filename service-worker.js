const CACHE_NAME = 'tangkap-game-v1';
const urlsToCache = [
  'index.html',
  'game.html',
  'css/style.css',
  'js/main.js',
  'js/game.js',
  'offline.html',
  'assets/images/logo.png',
  'assets/images/frame.png',
  'assets/images/objek.png',
  'assets/images/target-area.png',
  'assets/sounds/backsound.mp3',
  'assets/sounds/win.mp3',
  'assets/sounds/lose.mp3',
  'assets/sounds/tap.mp3'
];

// Install: cache semua resource
self.addEventListener('install', event => {
  self.skipWaiting(); // aktifkan langsung
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching semua file game');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch: ambil dari cache, fallback ke offline.html jika gagal
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request).catch(() => caches.match('offline.html')))
  );
});

// Activate: bersihkan cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim(); // ambil alih kontrol
});
