const CACHE_NAME = 'djfly-v1.2.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
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
      await fetch('/api/sync-queue', {
        method: 'POST',
        body: JSON.stringify(queueData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await clearStoredQueueData();
    }
  } catch (error) {
    console.error('Queue sync failed:', error);
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
