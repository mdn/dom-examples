this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.create('v1').then(function(cache) {
      return cache.add(
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/*',
      );
    }, function(Error) {
      console.log('Failed to populate cache.');
    });
  );
});