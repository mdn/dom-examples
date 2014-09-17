this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.create('v1').then(function(cache) {
      return cache.add(
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      );
    })
  );
});

// You could also do

// this.addEventListener('install', function(event) {
//   var starWarsAssets = new Cache();

//   event.waitUntil(
//     starWarsAssets.add(
//       '/sw-test/index.html',
//       '/sw-test/style.css',
//       '/sw-test/app.js',
//       '/sw-test/image-list.js',
//       '/sw-test/star-wars-logo.jpg',
//       '/sw-test/gallery/',
//       '/sw-test/gallery/bountyHunters.jpg',
//       '/sw-test/gallery/myLittleVader.jpg',
//       '/sw-test/gallery/snowTroopers.jpg'
//     )
//   )

//   caches.set('v1', starWarsResources);

// )};

this.addEventListener('fetch', function(event) {
  var cachedResponse = caches.match(event.request).catch(function() {
    return event.default().then(function(response) {
      caches.get('v1').then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      });  
    });
  }).catch(function() {
    return caches.match('/sw-test/gallery/myLittleVader.jpg');
  });
    
  event.respondWith(cachedResponse);
});
