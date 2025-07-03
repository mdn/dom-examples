import "https://unpkg.com/media-chrome@0.4.0/dist/index.js";

const audio = document.querySelector("audio");
const title = document.querySelector("media-text-display");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registration = await navigator.serviceWorker.register("./sw.js");
    console.log("Service worker registered for scope", registration.scope);
  });
}

document.querySelector("span").textContent = location.origin;

if (!matchMedia("(display-mode: standalone)").matches) {
  document.querySelector("ol").style.display = "block";
}

if ("launchQueue" in window && "targetURL" in window.LaunchParams.prototype) {
  window.launchQueue.setConsumer((launchParams) => {
    if (launchParams.targetURL) {
      const params = new URL(launchParams.targetURL).searchParams;
      const track = params.get("track");
      if (track) {
        audio.src = track;
        title.textContent = new URL(track).pathname.substr(1);
        audio.play();
      }
    }
  });
} else {
  document.querySelector(".not-supported").hidden = false;
}
