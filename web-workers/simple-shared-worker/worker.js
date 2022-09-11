onconnect = function (event) {
  const port = event.ports[0];

  port.onmessage = function () {
    const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    port.postMessage(workerResult);
  };
};
