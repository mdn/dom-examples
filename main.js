var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var result = document.querySelector('.result');

if (!!window.Worker) {
	var myWorker = new Worker("worker.js");

	first.onchange = function() {
	  myWorker.postMessage([first.value,second.value]);
	  console.log('Message posted to worker');
	};

	second.onchange = function() {
	  myWorker.postMessage([first.value,second.value]);
	  console.log('Message posted to worker');
	};

	myWorker.onmessage = function(e) {
		result.textContent = e.data;
		console.log('Message received from worker');
	};
}
