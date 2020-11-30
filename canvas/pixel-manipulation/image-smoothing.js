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

	var smoothedZoomCtx = document.getElementById('smoothed-zoom').getContext('2d');
	smoothedZoomCtx.imageSmoothingEnabled = true;
	smoothedZoomCtx.mozImageSmoothingEnabled = true;
	smoothedZoomCtx.webkitImageSmoothingEnabled = true;
	smoothedZoomCtx.msImageSmoothingEnabled = true;

	var pixelatedZoomCtx = document.getElementById('pixelated-zoom').getContext('2d');
	pixelatedZoomCtx.imageSmoothingEnabled = false;
	pixelatedZoomCtx.mozImageSmoothingEnabled = false;
	pixelatedZoomCtx.webkitImageSmoothingEnabled = false;
	pixelatedZoomCtx.msImageSmoothingEnabled = false;

  var zoom = function(ctx, x, y) {
    ctx.drawImage(canvas,
									Math.min(Math.max(0, x - 5), img.width - 10),
									Math.min(Math.max(0, y - 5), img.height - 10),
									10, 10,
									0, 0,
									200, 200);
  };

  canvas.addEventListener('mousemove', function(event) {
		const x = event.layerX;
		const y = event.layerY;
    zoom(smoothedZoomCtx, x, y);
    zoom(pixelatedZoomCtx, x, y);
	});
}
