var img = new Image();
img.crossOrigin = 'anonymous';
img.src = './assets/rhino.jpg';
img.onload = function() {
  draw(this);
};

function draw(img) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var zoomctx = document.getElementById('zoom').getContext('2d');

  var smoothbtn = document.getElementById('smoothbtn');
  var toggleSmoothing = function(event) {
    zoomctx.imageSmoothingEnabled = this.checked;
    zoomctx.mozImageSmoothingEnabled = this.checked;
    zoomctx.webkitImageSmoothingEnabled = this.checked;
    zoomctx.msImageSmoothingEnabled = this.checked;
  };
  smoothbtn.addEventListener('change', toggleSmoothing);

  var zoom = function(event) {
    var x = event.layerX;
    var y = event.layerY;
    zoomctx.drawImage(canvas,
                      Math.min(Math.max(0, x - 5), img.width - 10),
                      Math.min(Math.max(0, y - 5), img.height - 10),
                      10, 10,
                      0, 0,
                      200, 200);
  };

  canvas.addEventListener('mousemove', zoom);
}
