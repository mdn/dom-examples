var img = new Image();
img.crossOrigin = 'anonymous';
img.src = './assets/rhino.jpg';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

img.onload = function() {
	ctx.drawImage(img, 0, 0);
};

var original = function() {
	ctx.drawImage(img, 0, 0);
};

var sepia = function() {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		let red = data[i], green = data[i + 1], blue = data[i + 2];

		data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
		data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
		data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
	}
	ctx.putImageData(imageData, 0, 0);
}

var invert = function() {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		data[i]     = 255 - data[i];     // red
		data[i + 1] = 255 - data[i + 1]; // green
		data[i + 2] = 255 - data[i + 2]; // blue
	}
	ctx.putImageData(imageData, 0, 0);
};

var grayscale = function() {
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
		data[i]     = avg; // red
		data[i + 1] = avg; // green
		data[i + 2] = avg; // blue
	}
	ctx.putImageData(imageData, 0, 0);
};

const inputs = document.querySelectorAll('[name=color]');
for (const input of inputs) {
	input.addEventListener("change", function(evt) {
		switch (evt.target.value) {
			case "inverted":
				return invert();
			case "grayscale":
				return grayscale();
			case "sepia":
				return sepia();
			default:
				return original();
		}
	});
}
