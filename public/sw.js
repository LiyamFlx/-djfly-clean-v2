const CACHE_NAME = 'djfly-v1.3.0';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/vite.svg',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }

      return fetch(event.request).catch((error) => {
        console.warn('SW: Fetch failed for', event.request.url, error);
        // Return a fallback for failed requests
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
        // For other resources, just let it fail gracefully
        return new Response('', { status: 404 });
      });
    })
  );
});

// Activate event
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

// Background sync for offline queue management
self.addEventListener('sync', (event) => {
  if (event.tag === 'djfly-queue-sync') {
    event.waitUntil(
      // Sync queue data when connection is restored
      syncQueueData()
    );
  }
});

async function syncQueueData() {
  try {
    const queueData = await getStoredQueueData();
    if (queueData) {
      // Only sync if we have a backend API configured
      const apiUrl = self.location.origin + '/api/sync-queue';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(queueData),
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        console.info('SW: No backend API available for queue sync');
        return null;
      });

      if (response && response.ok) {
        await clearStoredQueueData();
      }
    }
  } catch (error) {
    console.warn(
      'SW: Queue sync failed (this is normal in development):',
      error
    );
  }
}

async function getStoredQueueData() {
  return new Promise((resolve) => {
    const request = indexedDB.open('djfly-offline', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['queue'], 'readonly');
      const store = transaction.objectStore('queue');
      const getRequest = store.get('current');
      getRequest.onsuccess = () => resolve(getRequest.result);
    };
  });
}

async function clearStoredQueueData() {
  return new Promise((resolve) => {
    const request = indexedDB.open('djfly-offline', 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['queue'], 'readwrite');
      const store = transaction.objectStore('queue');
      const deleteRequest = store.delete('current');
      deleteRequest.onsuccess = () => resolve();
    };
  });
}
