var KEY = {
  D: 68,
  W: 87,
  A: 65,
  S:83,
  RIGHT:39,
  UP:38,
  LEFT:37,
  DOWN:40,
  Q:81
};

var input = {
  right: false,
  up: false,
  left: false,
  down: false,
  quit: false
};

function press(evt) {
  evt.preventDefault();
  var code = evt.keyCode;
  switch(code) {
    case KEY.RIGHT:
    case KEY.D: input.right = true; break;

    case KEY.UP:
    case KEY.W: input.up = true; break;

    case KEY.LEFT:
    case KEY.A: input.left = true; break;
 
    case KEY.DOWN:
    case KEY.S: input.down = true; break;
 
    case KEY.Q: input.quit = true; break;
  }
}

function release(evt) {
  var code = evt.keyCode;
  switch(code) {
    case KEY.RIGHT:
    case KEY.D: input.right = false; break;

    case KEY.UP:
    case KEY.W: input.up = false; break;

    case KEY.LEFT:
    case KEY.A: input.left = false; break;

    case KEY.DOWN:
    case KEY.S: input.down = false; break;

    case KEY.Q: break;

    default: trace('unrecognized key code: ' +code); break;
  }
}
