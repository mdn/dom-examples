function isInvalidNumbers(e) {
  const { data } = e;
  return data[0].trim() === ''
    || isNaN(data[0])
    || data[1].trim() === ''
    || isNaN(data[1]);
}

onmessage = function(e) {
  console.log('Worker: Message received from main script');
  if (isInvalidNumbers(e)) {
    postMessage('Please write two numbers');
    return;
  }
  var workerResult = 'Result: ' + (parseInt(e.data[0]) * parseInt(e.data[1]));
  console.log('Worker: Posting message back to main script');
  postMessage(workerResult);
}
