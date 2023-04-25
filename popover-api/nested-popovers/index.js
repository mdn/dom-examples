const subcontainer = document.querySelector(".subcontainer");
const mainpopover = document.getElementById("mainpopover");
const subpopover = document.getElementById("subpopover");

// Events to show/hide the subpopover when the mouse moves over and out
subcontainer.addEventListener("mouseover", () => {
  subpopover.showPopover();
});

subcontainer.addEventListener("mouseout", () => {
  if (subpopover.matches(":popover-open")) {
    subpopover.hidePopover();
  }
});

// Event to make the subpopover keyboard-accessible
subcontainer.addEventListener("focusin", () => {
  subpopover.showPopover();
});

// Events to hide the popover menus when an option is selected in either of them
mainpopover.addEventListener("click", () => {
  if (subpopover.matches(":popover-open")) {
    subpopover.hidePopover();
  }

  if (mainpopover.matches(":popover-open")) {
    mainpopover.hidePopover();
  }
});

subpopover.addEventListener("click", () => {
  subpopover.hidePopover();
  mainpopover.hidePopover();
});
