addEventListener("connect", function (e) {
  var port = e.ports[0];

  port.addEventListener("message", function (evt) {
    let { generation, str } = evt.data;

    let result;
    try {
      result = eval(str) + "";
    } catch (ex) {
      result = "Exception: " + ex;
    }

    port.postMessage({
      generation,
      result,
    });
  });

  port.start();
});
