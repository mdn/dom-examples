function Player(s) {
  this.health = 100;
  this.speed = {
    forward : s,
    backward: .8 * s,
    turn : 2 * s
  };
}