let canvasB = null;
let ctxWorker = null;

// Waiting to receive the OffScreenCanvas
self.onmessage = function (e) {
  if (e.data === "slowDown") {
    // canvasB.style.border = "2px solid red";
    fibonacci(42);
  } else {
    canvasB = e.data.canvas;

    ctxWorker = canvasB.getContext("2d");
    // canvasB.style.border = "1px solid black";
    startCounting();
  }
};

// Fibonacci function to add some delay to the thread
function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

// Start the counter for Canvas B
let counter = 0;
function startCounting() {
  setInterval(function () {
    redrawCanvasB();
    counter++;
  }, 100);
}

// Redraw Canvas B text
function redrawCanvasB() {
  ctxWorker.clearRect(0, 0, canvasB.width, canvasB.height);
  ctxWorker.font = "24px Verdana";
  ctxWorker.textAlign = "center";
  ctxWorker.fillText(counter, canvasB.width / 2, canvasB.height / 2);
}
