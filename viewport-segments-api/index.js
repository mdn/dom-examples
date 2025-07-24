const list = document.querySelector("ul");
const detailHeading = document.querySelector(".detail-view h1");
const postureOutput = document.querySelector(".posture-output");

// Update detail view when list item is clicked on

list.addEventListener("click", (event) => {
  detailHeading.textContent = event.target.textContent;
});

// Output device posture when the posture changes

function reportPostureOutput() {
  postureOutput.textContent = `Device posture: ${navigator.devicePosture.type}`;
}

reportPostureOutput();
navigator.devicePosture.addEventListener("change", reportPostureOutput);

// Output viewport segment details to each segment

const wrapperElem = document.querySelector(".wrapper");
const listViewElem = document.querySelector(".list-view");
const detailViewElem = document.querySelector(".detail-view");

function addSegmentOutput(segments, i, elem) {
  const segment = segments[i];

  const divElem = document.createElement("div");
  divElem.className = "segment-output";

  elem.appendChild(divElem);

  divElem.innerHTML = `<h2>Viewport segment ${i + 1}</h2>
  <p>${segment.width}px x ${segment.height}px</p>`;
}

function reportSegments() {
  // Remove all previous segment output elements before adding more
  document.querySelectorAll(".segment-output").forEach((elem) => elem.remove());

  const segments = window.viewport.segments;

  if (segments.length === 1) {
    addSegmentOutput(segments, 0, wrapperElem);
  } else {
    addSegmentOutput(segments, 0, listViewElem);
    addSegmentOutput(segments, 1, detailViewElem);
  }
}

reportSegments();
window.addEventListener("resize", reportSegments);
navigator.devicePosture.addEventListener("change", reportSegments);
window.screen.orientation.addEventListener("change", reportSegments);
