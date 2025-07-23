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
  console.log("event fired");
}

reportPostureOutput();
navigator.devicePosture.addEventListener("change", reportPostureOutput);

// Output viewport segment details to each segment

const wrapperElem = document.querySelector(".wrapper");
const listViewElem = document.querySelector(".list-view");
const detailViewElem = document.querySelector(".detail-view");

function addSegmentOutput(segments, index, elem) {
  const segment = segments[index];
  elem.innerHTML += `
  <div class="segment-output">
  <h2>Viewport segment ${index + 1}</h2>
  <p>${segment.width}px x ${segment.height}px</p>
  </div>
  `;
}

function reportSegments() {
  // Remove all previous segment output elements before adding more
  document
    .querySelectorAll(".segment-output")
    .forEach((segment) => segment.remove());

  const segments = window.viewport.segments;

  if (segments.length === 1) {
    addSegmentOutput(segments, 0, wrapperElem);
  } else {
    addSegmentOutput(segments, 0, listViewElem);
    addSegmentOutput(segments, 1, listViewElem);
  }
}

reportSegments();
window.addEventListener("resize", reportSegments);
