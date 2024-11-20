const first = document.querySelector("#number1");
const second = document.querySelector("#number2");

const result1 = document.querySelector(".result1");

if (!!window.SharedWorker) {
  const myWorker = new SharedWorker("worker.js");

  [first, second].forEach(input => {
    input.onchange = function() {
      myWorker.postMessage([first.value, second.value]);
      console.log('Message posted to worker');
    }
  })

  myWorker.port.onmessage = function (e) {
    result1.textContent = e.data;
    console.log("Message received from worker");
    console.log(e.lastEventId);
  };
}
