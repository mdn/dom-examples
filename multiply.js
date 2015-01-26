var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var result1 = document.querySelector('.result1');

if (!!window.SharedWorker) {
  var myWorker = new SharedWorker("worker.js");

  myWorker.port.onmessage = function(e) {
    result2.textContent = e.data;
    console.log('Message received from worker');
  }

  myWorker.port.start();

  first.onchange = function() {
	myWorker.port.postMessage([first.value,second.value,1]);
	console.log('Message posted to worker');
  }

  second.onchange = function() {
	myWorker.port.postMessage([first.value,second.value,1]);
	console.log('Message posted to worker');
  }

  myWorker.port.onmessage = function(e) {
	if(e.data[1] == 1) {
      result1.textContent = e.data[0];
      console.log('Message received from worker');
    } else if(e.data[1] == 2) {
      result2.textContent = e.data[0];
      console.log('Message received from worker');
    }
  }
}