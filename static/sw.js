const CACHE_NAME = 'wlan0tto-cyber-hub-v2.2';
const ASSETS_TO_CACHE = [
    '/',
    '/privacy/',
    '/static/css/styles.css',
    '/static/js/app.js',
    '/static/js/components/ServiceManager.js',
    '/static/js/components/UIManager.js',
    '/static/js/components/ProfileManager.js',
    '/static/js/utils/AnalyticsManager.js',
    '/static/js/visuals.js',
    '/static/manifest.json',
    '/favicon.ico',
    '/static/icons/favicon-16.ico',
    '/static/icons/favicon-64.ico'
];

// Paths that must never be served from cache (dynamic/authenticated)
const NEVER_CACHE = ['/admin/', '/api/', '/dashboard/', '/accounts/', '/static/admin/'];

function shouldBypassCache(url) {
    return NEVER_CACHE.some(prefix => url.pathname.startsWith(prefix));
}

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
    // Take over from any previous service worker immediately
    self.skipWaiting();
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
    // Serve cached pages from the new worker right away
    self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip caching for non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip caching for external resources and dynamic app paths
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin || shouldBypassCache(url)) {
        return;
    }

    // Network-first: always try the network so updates are picked up
    // immediately, falling back to cache when offline.
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, responseToCache))
                        .catch(error => console.warn('Failed to cache response:', error));
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    // Offline fallback for page navigations
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                    if (event.request.url.endsWith('.css')) {
                        return new Response('/* Fallback CSS */', {
                            headers: { 'Content-Type': 'text/css' }
                        });
                    }
                    return Response.error();
                });
            })
    );
});
