const tooltips = document.querySelectorAll(".tooltip");
const btns = document.querySelectorAll("#button-bar button");

function addEventListeners(i) {
  btns[i].addEventListener("mouseover", () => {
    tooltips[i].showPopover();
  });

  btns[i].addEventListener("mouseout", () => {
    tooltips[i].hidePopover();
  });

  btns[i].addEventListener("focus", () => {
    tooltips[i].showPopover();
  });

  btns[i].addEventListener("blur", () => {
    tooltips[i].showPopover();
  });
}

for (let i = 0; i < btns.length; i++) {
  addEventListeners(i);
}
