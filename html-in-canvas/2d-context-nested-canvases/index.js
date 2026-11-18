function main() {
  const parentCanvas = document.querySelector("#parent-canvas");
  const childCanvas = document.querySelector("#child-canvas");
  const parentElement = document.querySelector("#parent-element");
  const childElement = document.querySelector("#child-element");
  const btn = document.querySelector("button");

  const pCtx = parentCanvas.getContext("2d");
  const cCtx = childCanvas.getContext("2d");

  if (!pCtx.drawElementImage) {
    alert(
      "CanvasRenderingContext2D.drawElementImage() is not available. HTML-in-Canvas is not supported.",
    );
    return;
  }

  const colors = ["orange", "pink", "cyan"];
  let count = 0;
  btn.addEventListener("click", () => {
    const color = colors[count];
    childElement.style.backgroundColor = color;
    count = (count + 1) % colors.length;
  });

  childCanvas.addEventListener("paint", () => {
    cCtx.clearRect(0, 0, childCanvas.width, childCanvas.height);
    cCtx.drawElementImage(childElement, 100, 100);
    console.log("Child canvas paint fired");
  });

  parentCanvas.addEventListener("paint", () => {
    pCtx.clearRect(0, 0, parentCanvas.width, parentCanvas.height);
    pCtx.drawElementImage(parentElement, 100, 100);
    console.log("Parent canvas paint fired");
  });
}

main();
