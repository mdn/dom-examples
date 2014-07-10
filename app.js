if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/*'
  }).then(function(sw) {
    // registration worked!
    console.log('Success');
  }).catch(function() {
    // registration failed :(
    console.log('Failtastic');
  });
}
