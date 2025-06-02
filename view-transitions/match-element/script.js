const mainElem = document.querySelector("main");
let prevElem;
let checkboxElem = document.querySelector("input");

// View transition code

function updateActiveItem(event) {
  const clickedElem = event.target.parentElement.parentElement;

  clickedElem.className = "active-item";

  if (prevElem === clickedElem) {
    prevElem.className = "";
    prevElem = undefined;
  } else if (prevElem) {
    prevElem.className = "";
    prevElem = clickedElem;
  } else {
    prevElem = clickedElem;
  }
}

mainElem.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") {
    return;
  }

  if (!document.startViewTransition) {
    updateActiveItem(event);
  } else {
    const transition = document.startViewTransition(() =>
      updateActiveItem(event)
    );
  }
});

// Update class on main to control whether match-element is applied

checkboxElem.addEventListener("change", () => {
  mainElem.classList.toggle("match-element-applied");
});
