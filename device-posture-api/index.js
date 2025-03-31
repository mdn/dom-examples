const list = document.querySelector("ul");
const detailHeading = document.querySelector(".detail-view h1");
const postureOutput = document.querySelector(".posture-output");

list.addEventListener("click", (event) => {
  detailHeading.textContent = event.target.textContent;
});

function reportPostureOutput() {
  postureOutput.textContent = `Device posture: ${navigator.devicePosture.type}`;
  console.log("event fired");
}

reportPostureOutput();
navigator.devicePosture.addEventListener("change", reportPostureOutput);
