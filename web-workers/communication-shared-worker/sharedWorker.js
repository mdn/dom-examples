const ports = [];
onconnect = function (e) {
  const port = e.ports[0];
  ports.push(port);
  port.onmessage = function (e) {
    ports.forEach((p) => {
      if (p !== port)
        p.postMessage(e.data.username + " posted a message: " + e.data.message);
      else
        p.postMessage(
          "You have successfully posted a message: " + e.data.message
        );
    });
  };
};
