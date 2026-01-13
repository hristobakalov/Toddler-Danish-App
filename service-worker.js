const CACHE_NAME = 'dansk-alfabet-v17';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/js/main.js',
  '/js/game-manager.js',
  '/js/games/alphabet-game.js',
  '/js/games/colors-game.js',
  '/js/games/numbers-game.js',
  '/js/games/sentences-game.js',
  '/js/games/actions-game.js',
  '/js/games/box-game.js',
  '/js/data/alphabet-data.js',
  '/js/data/colors-data.js',
  '/js/data/numbers-data.js',
  '/js/data/sentences-data.js',
  '/js/data/actions-data.js',
  '/js/data/animals-data.js',
  '/js/utils/speech.js',
  '/js/utils/animations.js',
  '/records/morning.mp3',
  '/records/dance.mp3',
  '/records/hungry.mp3',
  '/records/pee.mp3',
  '/records/help.mp3',
  '/records/love.mp3',
  '/records/tired.mp3',
  '/records/hurt.mp3',
  '/records/brushing.mp3',
  '/records/drinking.mp3',
  '/records/eating.mp3',
  '/records/heavy.mp3',
  '/records/playing.mp3',
  '/records/running.mp3',
  '/records/sad.mp3',
  '/records/sleeping.mp3',
  '/records/training.mp3',
  '/records/drums.mp3',
  '/records/what-doing.mp3',
  '/records/rigtigt.mp3'
];

// Install service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
