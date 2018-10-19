self.onmessage = function(e) {
  let userNum = Number(e.data);
  fibonacci(userNum);
}


function fibonacci(num){
let a = 1, b = 0, temp;
  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  self.postMessage(b);
}
