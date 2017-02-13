// Check for support and send results to main thread
function check_support(obj, name) {
  if (obj === undefined) 
    postMessage(name + " = No");
  else
    postMessage(name + " = Yes");
}

// Worker's onmessage handler
onmessage = function(e) {
  check_support(WorkerNavigator, "WorkerNavigator");
  check_support(self.navigator, "self.navigator");
  check_support(self.navigator.sendBeacon, "self.navigator.sendBeacon");
}
