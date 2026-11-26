const canvas = document.querySelector("canvas");
const form = document.querySelector("canvas form");

function main() {
  if (!("captureElementImage" in canvas)) {
    alert("HTML-in-Canvas is not supported.");
    return;
  }

  const worker = new Worker("worker.js");
  const offscreen = canvas.transferControlToOffscreen();
  // Transfer the offscreen canvas to the worker
  worker.postMessage({ canvas: offscreen }, [offscreen]);

  worker.addEventListener("message", (e) => {
    if (e.data.unsupported) {
      alert("drawElementImage() is not available in the worker.");
    }
  });

  // Geometry updates from a worker are reported here
  canvas.addEventListener("elementgeometryupdate", (e) => {
    console.log("Geometry update:", e.elements);
    // getElementTransform() is only available on HTMLCanvasElement,
    // so it has to be read on the main thread.
    console.log(canvas.getElementTransform(e.elements[0]));
  });

  canvas.addEventListener("paint", () => {
    // ElementImage objects are transferrable
    const formImage = canvas.captureElementImage(form);
    // Transfer form image to the worker
    worker.postMessage({ formImage }, [formImage]);
  });
}

main();
