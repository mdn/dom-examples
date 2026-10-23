import { createPointerDistort } from "./pointer-distort.js";

function main() {
  const canvas = document.querySelector("canvas");
  const form = document.querySelector("canvas form");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx.drawElementImage) {
    alert(
      "CanvasRenderingContext2D.drawElementImage() is not available. HTML-in-Canvas is not supported.",
    );
    return;
  }

  const fx = createPointerDistort(canvas, { radius: 120 });

  function loop(t) {
    ctx.fillStyle = "#7D82B8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawElementImage(form, 100, 100);
    fx.apply(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

main();
