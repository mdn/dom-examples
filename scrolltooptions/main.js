let scrollOptions;

const form = document.querySelector('form');
const leftInput = document.getElementById('left');
const topInput = document.getElementById('top');
const scrollInput = document.getElementById('scroll');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  scrollOptions = {
    left: leftInput.value,
    top: topInput.value,
    behavior: scrollInput.checked ? 'smooth' : 'auto'
  }

  window.scrollTo(scrollOptions);
});
