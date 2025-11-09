const first = document.querySelector("#number0");
if (window.Worker) {
  const myWorker = new Worker("worker.js");

  [first, second].forEach((input) => {
    input.onchange = () => {
      myWorker.postMessage([first.value, second.value]);
      console.log("Message posted to worker");
    };
  });

  myWorker.onmessage = (e) => {
    result.textContent = e.data;
    console.log("Message received from worker");
  };
} else {
  console.log("Your browser doesn't support web workers.");
}


