var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var result1 = document.querySelector('.result1');

myWorker.port.start();

first.onchange = function() {
	myWorker.port.postMessage([first.value,second.value,1]);
	console.log('Message posted to worker');
}

second.onchange = function() {
	myWorker.port.postMessage([first.value,second.value,1]);
	console.log('Message posted to worker');
}