if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/*'
  }).then(function(sw) {
    // registration worked
    console.log('Registration succeeded.');
  }).catch(function() {
    // registration failed
    console.log('Registration failed.');
  });
}
