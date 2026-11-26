const x = 100;
const y = 100;
let ctx;

self.addEventListener("message", ({ data }) => {
  if (data.canvas) {
    ctx = data.canvas.getContext("2d");
    if (!ctx.drawElementImage) self.postMessage({ unsupported: true });
    return;
  }

  if (data.formImage) {
    const img = data.formImage;
    const offscreen = ctx.canvas;

    ctx.fillStyle = "#7D82B8";
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    ctx.drawElementImage(img, x, y, {
      preserveElementGeometry: true,
    });

    offscreen.updateElementGeometry(img, {
      canvasTransform: new DOMMatrix().translate(x, y),
    });

    console.log(offscreen.getElementImageDefaultSize(img));

    img.close(); // release the snapshot
  }
});
