const articleElem = document.querySelector("article");

function setContainerWidth() {
  const clientRect = articleElem.getBoundingClientRect();
  articleElem.style.setProperty(
    "--container-width",
    Math.floor(clientRect.width)
  );
}

window.addEventListener("resize", setContainerWidth);

setContainerWidth();
