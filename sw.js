const cacheName = 'site-v1';
const cacheAsset = [
  './index.html',
  './about.html',
  './index.js'
];

// install
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(cacheAsset);
  return self.skipWaiting();
})

//  activate
self.addEventListener('activate', async (e) => {
  self.clients.claim();
  const oldCache = await caches.keys();
  oldCache.map(cache => {
    if (cache !== cacheName){
      caches.delete(cache);
      console.log('clearing old cache')
    }
  })
});

//  fetch
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin){
    e.respondWith(cacheFirst(req));
  }else {
    e.respondWith(networkAndCache(req));
  };
  console.log(url)
  console.log(req)
  console.log(location)
});

async function cacheFirst(req){
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req)
}

async function networkAndCache(req){
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (error) {
    const cached = await cache.match(req);
    return cached
  }
}