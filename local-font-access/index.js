const selectElem = document.querySelector("select");
const selectElemContainer = document.querySelector(".select-container");
const startButton = document.querySelector("button");
const startButtonContainer = document.querySelector(".start-button-container");

const sampleText = document.querySelector(".sample-text");

selectElemContainer.style.display = "none";

async function populatefonts() {
  startButton.textContent = "Fetching fonts...";
  startButton.disabled = true;

  try {
    const availableFonts = await window.queryLocalFonts();
    console.log(availableFonts);
    for (const fontData of availableFonts) {
      selectElem.innerHTML += `<option value="${fontData.family}">${fontData.fullName}</option>`;
    }

    selectElemContainer.style.display = "block";
    startButtonContainer.style.display = "none";
    selectElem.selectedIndex = 0;

    selectElem.addEventListener("change", applyFont);
    applyFont();
  } catch (err) {
    console.error(err.name, err.message);
    startButton.textContent = "Get your local fonts";
    startButton.disabled = false;
  }
}

function applyFont() {
  sampleText.style.fontFamily = selectElem.value;
}

startButton.addEventListener("click", populatefonts);
