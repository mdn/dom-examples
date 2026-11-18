const username = document.querySelector("#user").textContent;
const comment = document.querySelector("#comment");
const post = document.querySelector("#post");
const result = document.querySelector("#result");

if (window.SharedWorker) {
  const sharedWorker = new SharedWorker("sharedWorker.js");
  sharedWorker.port.start();

  post.onclick = function () {
    const message = comment.value;
    sharedWorker.port.postMessage({
      username,
      message,
    });
  };
  sharedWorker.port.onmessage = function (e) {
    console.log(e.data);
    result.textContent = e.data;
  };
}
