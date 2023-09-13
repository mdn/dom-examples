self.onmessage = function (event) {
  const userNum = Number(event.data);
  self.postMessage(fibonacci(userNum));
};

function fibonacci(n) {
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
