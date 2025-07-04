function msghandler(evt) {
  if (evt.data === "throw") {
    throw new Error("Throw requested by postMessage()");
  }
}

onconnect = function (evt) {
  evt.ports[0].onmessage = msghandler;
  throw new Error("Throw initiated by connect!");
};
