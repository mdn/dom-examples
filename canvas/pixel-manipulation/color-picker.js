const img = new Image();
img.crossOrigin = 'anonymous';
img.src = '/assets/rhino.jpg';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
img.addEventListener('load', () => {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
});
const hoveredColor = document.getElementById('hovered-color');
const selectedColor = document.getElementById('selected-color');


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

canvas.addEventListener('mousemove', event => pick(event, hoveredColor));
canvas.addEventListener('click', event => pick(event, selectedColor));
