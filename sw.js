const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  let responseFromNetwork;
  try {
    responseFromNetwork = await fetch(request);
  } catch (error) {
    const fallBackResponse = await caches.match(
      "/sw-test/gallery/myLittleVader.jpg"
    );
    return fallBackResponse;
  }
  // response may be used only once
  // we need to save clone to put one copy in cache
  // and serve second one
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/sw-test/",
      "/sw-test/index.html",
      "/sw-test/style.css",
      "/sw-test/app.js",
      "/sw-test/image-list.js",
      "/sw-test/star-wars-logo.jpg",
      "/sw-test/gallery/bountyHunters.jpg",
      "/sw-test/gallery/myLittleVader.jpg",
      "/sw-test/gallery/snowTroopers.jpg",
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});
