window.addEventListener("load", startup, false);

function startup() {
  // Get the reference to video
  const video = document.getElementById("video");

  // On pressing ENTER call toggleFullScreen method
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      toggleFullScreen(video);
    }
  });
}

function toggleFullScreen(video) {
  if (!document.fullscreenElement) {
    // If the document is not in full screen mode
    // make the video full screen
    video.requestFullscreen();
  } else {
    // Otherwise exit the full screen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
