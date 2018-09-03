self.onmessage = function(e) {
  var userNum = Number(e.data);
  fibonacci(userNum);
}


function fibonacci(num){
var a = 1, b = 0, temp;
  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  self.postMessage(b);
}
