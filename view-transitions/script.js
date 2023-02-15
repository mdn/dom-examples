const imageData = [
    {
        'name': 'Jungle coast',
        'file': 'jungle-coast',
    },
    {
        'name': 'Bird in the tree',
        'file': 'tree-bird',
    },
    {
        'name': 'A view from the sky',
        'file': 'view-from-the-sky',
    },
    {
        'name': 'The view across the water',
        'file': 'watery-view',
    }
]

const thumbs = document.querySelector('.thumbs');
const galleryImg = document.querySelector('.gallery-view img');
const galleryCaption = document.querySelector('.gallery-view figcaption');

function init() {
  imageData.forEach(data => {
    const img = document.createElement('img');
    img.alt = data.name;
    img.src = `images/${ data.file }_th.jpg`;
    thumbs.appendChild(img);
    
    img.addEventListener('click', updateView);
  }) 
  
  galleryImg.src = `images/${ imageData[0].file }.jpg`;
  galleryCaption.textContent = imageData[0].name;
}

function updateView(e) {
  // Fallback for browsers that don't support View Transitions:
  if (!document.startViewTransition) {
    displayNewImage();
    return;
  }

  // With View Transitions:
  document.startViewTransition(() => displayNewImage());
  
  function displayNewImage() {
    const mainSrc = `${e.target.src.split('_th.jpg')[0]}.jpg`;
    galleryImg.src = mainSrc;
    galleryCaption.textContent = e.target.alt;
  }
}

init();