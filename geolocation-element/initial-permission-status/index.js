const statusElem = document.querySelector("#status");
const outputElem = document.querySelector("#output");
const geo = document.querySelector("geolocation");

if (geo.initialPermissionStatus === "prompt") {
  statusElem.textContent =
    "Please press the button to allow access to your location data and start requesting data.";
} else if (geo.initialPermissionStatus === "denied") {
  statusElem.textContent =
    "Permission previously denied. Please press the button to allow access to your location data and start requesting data.";
} else if (geo.initialPermissionStatus === "granted") {
  statusElem.textContent =
    "Permission previously granted. Please press the button to start requesting location data.";
}

geo.addEventListener("location", () => {
  statusElem.textContent = "Data requested";
  if (geo.position) {
    outputElem.textContent += `(${geo.position.coords.latitude},${geo.position.coords.longitude}), `;
  } else if (geo.error) {
    outputElem.textContent += `${geo.error.message}, `;
  }
});
