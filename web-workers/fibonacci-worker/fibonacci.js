self.onmessage =  function(event) {
  const userNum = Number(event.data);
  self.postMessage(fibonacci(userNum));
};

function fibonacci(num) {
  let a = 1;
  let b = 0;
  while (num > 0) {
	a = a+b;
    b = a-b; // Current a is previous a+ previous b
			 // In modern JS: [a,b] = [a+b,a]
    num--;
  }

  return b;
}
