import { Gallery } from "./image-list.js";

const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register(
    "/sw-test/sw.js",
    {
      scope: "/sw-test/",
    }
  );
  if (registration.installing) {
    console.log("Service worker installing");
  } else if (registration.waiting) {
    console.log("Service worker installed");
  } else if (registration.active) {
    console.log("Service worker active");
  }
};

const imgSection = document.querySelector("section");

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
  const myImage = document.createElement("img");
  const myCaption = document.createElement("caption");
  const myFigure = document.createElement("figure");
  myCaption.innerHTML =
    "<strong>" +
    galleryImage.name +
    "</strong>: Taken by " +
    galleryImage.credit;
  myImage.src = window.URL.createObjectURL(imageBlob);
  myImage.setAttribute("alt", galleryImage.alt);
  myFigure.append(myImage, myCaption);
  imgSection.append(myFigure);
};

window.onload = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await registerServiceWorker();
    } catch (error) {
      console.log("Registration failed with " + error);
      return;
    }
  }
  await Promise.allSettled(Gallery.images.map(createGalleryFigure));
};
