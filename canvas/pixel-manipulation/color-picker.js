var img = new Image();
img.crossOrigin = 'anonymous';
img.src = './assets/rhino.jpg';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
img.onload = function () {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
};
var hoveredColor = document.getElementById('hovered-color');
var selectedColor = document.getElementById('selected-color');


function pick(event, destination) {
  const bounding = canvas.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;

  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
  destination.style.background = rgba;
  destination.textContent = rgba;

  return rgba;
}

canvas.addEventListener('mousemove', function (event) {
  pick(event, hoveredColor);
});
canvas.addEventListener('click', function (event) {
  pick(event, selectedColor);
});
