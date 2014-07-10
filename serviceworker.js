// scope defaults to "/*"
navigator.serviceWorker.register("worker.js").then(
  function(worker) {
    console.log("success!");
    serviceWorker.postMessage("Howdy from your installing page.");
    // To use the serviceWorker immediately, you might call window.location.reload()
  }).catch(function(e) {
    console.error("Installing the worker failed");
  });