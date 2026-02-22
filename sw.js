const CACHE_NAME = 'goapps-v2';
const OFFLINE_URL = 'index.html'; // Or a dedicated offline.html

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap'
];

// Install: Cache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch: Serve from cache, then network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // If both fail (no network and not in cache), return the home page
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});
