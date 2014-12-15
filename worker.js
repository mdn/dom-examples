self.onconnect = function(e) {
	var port = e.ports[0];

	port.onmessage = function(e) {
	  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
	  var resultType = e.data[2];
	  port.postMessage([workerResult,resultType]);
	}

	port.start();
}