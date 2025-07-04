addEventListener("message", function (evt) {
  let { generation, str } = evt.data;

  let result;
  try {
    result = eval(str) + "";
  } catch (ex) {
    result = "Exception: " + ex;
  }

  postMessage({
    generation,
    result,
  });
});
