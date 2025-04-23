const CACHE_NAME = 'tangkap-game-v1';
const urlsToCache = [
  'index.html',
  'game.html',
  'css/style.css',
  'js/main.js',
  'js/game.js',
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching semua file game');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch: ambil dari cache jika offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
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
});