
window.addEventListener("load", startup, false);

function displayErrorMessage(msg) {
  document.getElementById("log").innerHTML += msg;
}

function startup() {
  let audioElement = document.getElementById("audio");
  
  document.getElementById("buttonMissingFile").addEventListener("click", function() {
    audioElement.src = "assets/nosuchfile.mp3";
  }, false);
  
  document.getElementById("buttonGoodFile").addEventListener("click", function() {
    audioElement.src = "assets/good.mp3";
  }, false);

  // Create the event handler

  audioElement.onerror = function() {
    let s = "";
    let err = audioElement.error;
    
    switch(err.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        s += "The user canceled the audio";
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        s+= "A network error occurred while fetching the audio.";
        break;
      case MediaError.MEDIA_ERR_DECODE:
        s+= "An error occurred while decoding the audio.";
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        s+= "The audio is missing or is in a format not supported by your browser.";
        break;
      default:
        s += "An unknown error occurred.";
        break;
    }
    
    let message = err.message;
    
    if (message && message.length) {
      s += " " + message;
    }
    
    displayErrorMessage("<strong>Error " + err.code + ":</strong> " + s + "<br>");
  };  
}
