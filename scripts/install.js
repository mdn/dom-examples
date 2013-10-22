// get a reference to the install button
var button = document.getElementById('install');

// if browser has support for installable apps, run the install code; it not, hide the install button
if('mozApps' in navigator) {
    
    // define the manifest URL
    var manifest_url = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
    
    function install(ev) {
      ev.preventDefault();
      // install the app
      var installLocFind = navigator.mozApps.install(manifest_url);
      installLocFind.onsuccess = function(data) {
        // App is installed, do something if you like
      };
      installLocFind.onerror = function() {
        // App wasn't installed, info is in
        // installapp.error.name
        alert(installLocFind.error.name);
      };
    };
    
    // if app is already installed, hide button. If not, add event listener to call install() on click
    var installCheck = navigator.mozApps.checkInstalled(manifest_url);
    installCheck.onsuccess = function() {
      
      if(installCheck.result) {
        button.style.display = "none";
      } else {
        button.addEventListener('click', install, false);
      };
    };
} else {
  button.style.display = "none";
}