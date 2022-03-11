const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  // Next try to get the resource from the network
  let responseFromNetwork;
  try {
    responseFromNetwork = await fetch(request);
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  // response may be used only once
  // we need to save clone to put one copy in cache
  // and serve second one
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/sw-test/',
      '/sw-test/index.html',
      '/sw-test/style.css',
      '/sw-test/app.js',
      '/sw-test/image-list.js',
      '/sw-test/star-wars-logo.jpg',
      '/sw-test/gallery/bountyHunters.jpg',
      '/sw-test/gallery/myLittleVader.jpg',
      '/sw-test/gallery/snowTroopers.jpg',
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: '/sw-test/gallery/myLittleVader.jpg',
    })
  );
});
