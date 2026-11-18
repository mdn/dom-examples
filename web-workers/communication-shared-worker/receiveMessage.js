const comment = document.querySelector("#comments");

if (window.SharedWorker) {
  const sharedWorker = new SharedWorker("sharedWorker.js");
  sharedWorker.port.start();
  sharedWorker.port.onmessage = function (e) {
    const p = document.createElement("p");
    p.textContent = e.data;
    comment.appendChild(p);
  };
}
