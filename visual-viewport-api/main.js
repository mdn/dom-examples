const total = document.getElementById("total");
const visibleBoxes = [];

const scrollUpdater = () => {
  total.style.top = `${visualViewport.offsetTop + 10}px`;
  total.style.left = `${visualViewport.offsetLeft + 10}px`;
  total.style.background = "yellow";
};

const scrollendUpdater = () => {
  total.style.background = "lime";
  updateVisibleBoxes();
  updateSum();
};

function isVisible(box) {
  const x = box.offsetLeft;
  const y = box.offsetTop;
  const right = x + box.offsetWidth;
  const bottom = y + box.offsetHeight;

  const horLowerBound = window.scrollX + visualViewport.offsetLeft;
  const horUpperBound = window.scrollX + visualViewport.offsetLeft + visualViewport.width;
  const horizontal = (x > horLowerBound && x < horUpperBound) ||
    (right > horLowerBound && right < horUpperBound);

  const verLowerBound = window.scrollY + visualViewport.offsetTop;
  const verUpperBound = window.scrollY + visualViewport.offsetTop + visualViewport.height;
  const vertical = (y > verLowerBound && y < verUpperBound) ||
    (bottom > verLowerBound && bottom < verUpperBound);

  return horizontal && vertical;
}

function updateVisibleBoxes() {
  const boxes = document.querySelectorAll(".gridbox");
  visibleBoxes.length = 0;

  for (const box of boxes) {
    if (isVisible(box)) {
      visibleBoxes.push(box);
    }
  }
}

function updateSum() {
  let sumTotal = 0;
  const summands = [];

  for (const box of visibleBoxes) {
    console.log(`${box.id} is visible`);

    const n = parseInt(box.innerText);

    sumTotal += n;
    summands.push(n);
  }

  total.innerText = `Total: ${summands.join(" + ")} = ${sumTotal}`;
}

visualViewport.onresize = scrollUpdater;
visualViewport.onscroll = scrollUpdater;
visualViewport.onscrollend = scrollendUpdater;
window.onresize = scrollUpdater;
window.onscroll = scrollUpdater;
window.onscrollend = scrollendUpdater;

updateVisibleBoxes();
updateSum();
