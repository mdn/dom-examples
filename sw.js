const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const networkOnly = async (request) => {
  return fetch(request);
};

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  console.log(responseFromNetwork);
  if (!responseFromNetwork.ok) {
    return responseFromNetwork;
  }
  // response may be used only once
  // we need to save clone to put one copy in cache
  // and serve second one
  await putInCache(responseFromNetwork.clone());
  return responseFromNetwork;
};

const fallback = (request) => {
  return caches.match("./sw-test/gallery/myLittleVader.jpg");
};

const cacheFirstWithFallback = async (request) => {
  try {
    return await cacheFirst(request);
  } catch (error) {
    console.log(`failed to load ${request.url}`, error);
    try {
      return await fallback(request);
    } catch (error) {
      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
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
  event.respondWith(cacheFirstWithFallback(event.request));
});
