var canvasB = null;
var ctxWorker = null;

// Waiting to receive the OffScreenCanvas
self.onmessage = function (e) {
  if (typeof e.data == "string") {
    for (let i = 0; i < 2000000000; i++) {}
  } else {
    canvasB = e.data.canvas;
    ctxWorker = canvasB.getContext("2d");

    startCounting();
  }
};

// Start the counter for Canvas B
var counter = 0;
function startCounting() {
  setInterval(function () {
    redrawCanvasB();
    counter++;
  }, 100);
}

// Redraw Canvas A text
function redrawCanvasB() {
  ctxWorker.clearRect(0, 0, canvasB.width, canvasB.height);
  ctxWorker.font = "16px Verdana";
  ctxWorker.textAlign = "center";
  ctxWorker.fillText(
    "Counting: " + counter,
    canvasB.width / 2,
    canvasB.height / 2
  );
}
