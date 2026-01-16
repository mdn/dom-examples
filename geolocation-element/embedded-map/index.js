const statusElem = document.querySelector("#status");

if (typeof HTMLGeolocationElement === "function") {
  const geo = document.querySelector("geolocation");

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
      drawMap(geo.position.coords.latitude, geo.position.coords.longitude, geo);
    } else if (geo.error) {
      console.log(geo.error.message);
    }
  });

  geo.addEventListener("promptdismiss", notifyUserRetrySelection);
  geo.addEventListener("promptaction", notifyUserGrantPermission);

  function notifyUserRetrySelection() {
    statusElem.textContent =
      'Please press the "Use location" button again and allow location for this site.';
  }

  function notifyUserGrantPermission() {
    if (
      geo.permissionStatus === "denied" ||
      geo.permissionStatus === "prompt"
    ) {
      statusElem.textContent =
        'Please press the "Use location" button again and allow location for this site.';
    }
  }
} else {
  const fallback = document.querySelector("#fallback");

  // Fallback code
  fallback.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        drawMap(position.coords.latitude, position.coords.longitude, fallback);
      },
      (error) => {
        statusElem.textContent += `${error.message}, `;
      }
    );
  });
}

function drawMap(lat, long, btn) {
  const map = L.map("map").setView([lat, long], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const marker = L.marker([lat, long]).addTo(map);

  statusElem.textContent = "Map drawn successfully.";
  btn.style.display = "none";
}
