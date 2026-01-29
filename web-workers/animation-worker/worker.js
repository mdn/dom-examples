self.onmessage = function (e) {
  let length = e.data.length;
  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      for (let k = j + 1; k < length; k++) {}
    }
  }
  self.postMessage("done");
};
