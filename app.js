import { Gallery } from './image-list.js';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/sw-test/sw.js',
        {
          scope: '/sw-test/',
        }
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

const imgSection = document.querySelector('section');

const getImageBlob = async (url) => {
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(
      "Image didn't load successfully; error code:" + imageResponse.statusText
    );
  }
  return imageResponse.blob();
};

const createGalleryFigure = async (galleryImage) => {
  const imageBlob = await getImageBlob(galleryImage.url);
  const myImage = document.createElement('img');
  const myCaption = document.createElement('caption');
  const myFigure = document.createElement('figure');
  myCaption.textContent = `${galleryImage.name}: Taken by ${galleryImage.credit}`;
  myImage.src = window.URL.createObjectURL(imageBlob);
  myImage.setAttribute('alt', galleryImage.alt);
  myFigure.append(myImage, myCaption);
  imgSection.append(myFigure);
};

registerServiceWorker();
Gallery.images.map(createGalleryFigure);
