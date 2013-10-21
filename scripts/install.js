function install(ev) {
  ev.preventDefault();
  // define the manifest URL
  var manifest_url = "http://people.opera.com/~cmills/to-do-list/manifest.webapp";
  // install the app
  var installLocFind = navigator.mozApps.install(manifest_url);
  installLocFind.onsuccess = function(data) {
    // App is installed, do something 
  };
  installLocFind.onerror = function() {
    // App wasn't installed, info is in
    // installapp.error.name
    alert(installapp.error.name);
  };
};

// get a reference to the button and call install() on click
var button = document.getElementById('install');

var installCheck = navigator.mozApps.checkInstalled("http://people.opera.com/~cmills/to-do-list/manifest.webapp");
installCheck.onsuccess = function() {
  if(installCheck.result) {
    button.style.display = "none";
  } else {
    button.addEventListener('click', install, false);
  };
};
