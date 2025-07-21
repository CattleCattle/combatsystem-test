// Service Worker pour le cache offline du jeu

const CACHE_NAME = 'boar-dungeon-v1';
const STATIC_ASSETS = [
  '/',
  '/combat-sangliers',
  '/manifest.json',
  // Ajouter d'autres assets statiques
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache : Network First pour les API, Cache First pour les assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache First pour les assets statiques
  if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request);
        })
    );
    return;
  }

  // Network First pour les pages et API
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache la réponse si elle est réussie
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec, essayer de servir depuis le cache
        return caches.match(request);
      })
  );
});
