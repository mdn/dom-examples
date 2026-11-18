const start = document.querySelector("#start");
const stop = document.querySelector("#stop");
const block = document.querySelector("#block");
const performance = document.querySelector("#performance");
const state = document.querySelector("#state");

let optimize = false;
let time = 0;
let animationId,
  worker,
  length = 2200;

if (window.Worker) {
  worker = new Worker("worker.js");
  worker.onmessage = function (e) {
    state.textContent = e.data;
  };
}

const animate = function () {
  time++;
  box.style.transform = `translateX(${time}px)`;
  if (time < 600) {
    animationId = requestAnimationFrame(animate);
  }
};

const newElement = function () {
  const span = document.createElement("span");
  span.style.display = "inline-block";
  span.style.width = "10px";
  span.style.height = "10px";
  span.style.backgroundColor = "red";
  span.style.margin = "2px";
  return span;
};

start.onclick = function () {
  animationId = requestAnimationFrame(animate);
};

stop.onclick = function () {
  cancelAnimationFrame(animationId);
};

block.onclick = function () {
  state.textContent = "doing";
  if (optimize && worker) {
    worker.postMessage({ length });
  } else {
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        for (let k = j + 1; k < length; k++) {}
      }
    }
    state.textContent = "done";
  }
};

performance.onclick = function () {
  optimize = !optimize;
  if (optimize) performance.textContent = "Un-Optimize";
  else performance.textContent = "Optimize";
};
