const CACHE_NAME = 'wlan0tto-cyber-hub-v1.3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',

    '/js/app.js',
    '/js/components/ServiceManager.js',
    '/js/components/UIManager.js',
    '/data/services.json',
    '/manifest.json',
    '/pages/privacy.html',
    '/favicon.ico',
    '/icons/favicon-16.ico',
    '/icons/favicon-64.ico'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return Promise.allSettled(
                    ASSETS_TO_CACHE.map(url =>
                        fetch(url, { cache: 'no-store' })
                            .then(response => {
                                if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                                return cache.put(url, response);
                            })
                            .catch(error => {
                                console.warn(`Failed to cache ${url}:`, error);
                                return null;
                            })
                    )
                );
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
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

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip caching for non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip caching for external resources
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the new response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            })
                            .catch(error => {
                                console.warn('Failed to cache response:', error);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('Fetch failed:', error);
                        // Return a fallback response for CSS files
                        if (event.request.url.endsWith('.css')) {
                            return new Response('/* Fallback CSS */', {
                                headers: { 'Content-Type': 'text/css' }
                            });
                        }
                        throw error;
                    });
            })
    );
}); 