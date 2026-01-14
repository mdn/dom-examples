const geo = document.querySelector("geolocation");
const fallback = document.querySelector("button");
const statusElem = document.querySelector("p");

// Test attributes:
console.log(`isValid: ${geo.isValid}`);
console.log(`invalidReason: ${geo.invalidReason}`);
console.log(`autolocate: ${geo.autolocate}`);
console.log(`watch: ${geo.watch}`);
console.log(`initialPermissionStatus: ${geo.initialPermissionStatus}`);
console.log(`permissionStatus: ${geo.permissionStatus}`);

geo.addEventListener("location", () => {
  if (geo.position) {
    console.log(
      `${geo.position.coords.latitude},${geo.position.coords.longitude}`
    );
    drawMap(geo.position.coords.latitude, geo.position.coords.longitude);
  } else if (geo.error) {
    console.log(geo.error.message);
  }
});

geo.addEventListener("promptdismiss", notifyUserRetrySelection);
geo.addEventListener("promptaction", notifyUserGrantPermission);
// geo.addEventListener("validationstatuschange", notifyUserGrantPermission);

function drawMap(lat, long) {
  const map = L.map("map").setView([lat, long], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const marker = L.marker([lat, long]).addTo(map);

  statusElem.textContent = "Map drawn successfully.";
  geo.style.display = "none";
}

function notifyUserRetrySelection() {
  statusElem.textContent =
    'Please press the "Use location" button again and allow location for this site.';
}

function notifyUserGrantPermission() {
  if (geo.permissionStatus === "denied" || geo.permissionStatus === "prompt")
    statusElem.textContent =
      'Please press the "Use location" button and allow location for this site.';
}

// Fallback code
fallback.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    drawMap(position.coords.latitude, position.coords.longitude);
  });
});
