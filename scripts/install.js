// define the manifest URL
var manifest_url = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";

function install(ev) {
  ev.preventDefault();
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

var installCheck = navigator.mozApps.checkInstalled(manifest_url);
installCheck.onsuccess = function() {
  if(installCheck.result) {
    button.style.display = "none";
  } else {
    button.addEventListener('click', install, false);
  };
};
