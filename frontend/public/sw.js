const cacheEndpoints = [
  // '/login', 
  // '/register', 
  // '/dashboard',
  // '/history', 
  // '/manage/caretaker' 
];

const CACHE_NAME = 'app-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(cacheEndpoints))
      .then(() => console.log('Cache added'))
      .catch(err => console.log(err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key.startsWith('app-') && key !== CACHE_NAME)
            .map(key => caches.delete(key))
        );
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(event.request);
          const responseClone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, responseClone);
          return response;
        } catch(err) {
          console.log('Fetch failed, retrieving from cache');
          const cachedResponse = await caches.match(event.request);
          return cachedResponse || caches.match('/');
        }
      })()
    );
  }
});

self.addEventListener('message', event => {
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});