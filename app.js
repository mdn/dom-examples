// helper function

function degToRad(degrees) {
  var result = Math.PI/180 * degrees;
  return result;
}

// setup of the canvas

window.addEventListener('load', eventWindowLoaded, false);
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

function eventWindowLoaded() {
  var spaceship = new Image();
  spaceship.src = "spaceship.png"
  canvasDraw();
}

var x = 50;
var y = 50;

function canvasDraw() {
  if(x > canvas.clientWidth+20) {
    x = 0;  
  }

  if(y > canvas.clientHeight+20) {
    y = 0;  
  }  

  if(x < -20) {
    x = canvas.clientWidth;  
  }

  if(y < -20) {
    y = canvas.clientHeight;  
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
  ctx.fillStyle = "#f00";
  
  ctx.beginPath();
  ctx.arc(x,y,20,0,degToRad(360), true);
  ctx.fill();
}

// pointer lock object forking for cross browser

canvas.requestPointerLock = canvas.requestPointerLock ||
           canvas.mozRequestPointerLock ||
           canvas.webkitRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
         document.mozExitPointerLock ||
         document.webkitExitPointerLock;
//document.exitPointerLock();



canvas.onclick = function() {
  canvas.requestPointerLock();
}

// pointer lock event listeners

// Hook pointer lock state change events for different browsers
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if(document.pointerLockElement === canvas ||
  document.mozPointerLockElement === canvas ||
  document.webkitPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", canvasLoop, false);
  } else {
    console.log('The pointer lock status is now unlocked');  
    document.removeEventListener("mousemove", canvasLoop, false);
  }
}

  var tracker = document.createElement('p');
  var body = document.querySelector('body');
  body.appendChild(tracker);
  tracker.style.position = 'absolute';
  tracker.style.top = '0';
  tracker.style.right = '10px';
  tracker.style.backgroundColor = 'white';

function canvasLoop(e) {
  var movementX = e.movementX ||
      e.mozMovementX          ||
      e.webkitMovementX       ||
      0;

  var movementY = e.movementY ||
      e.mozMovementY      ||
      e.webkitMovementY   ||
      0;

  x += movementX;
  y += movementY; 

  canvasDraw();

  var animation = requestAnimationFrame(canvasLoop);

  tracker.innerHTML = "X position: " + x + ', Y position: ' + y;
}