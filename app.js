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

const createGalleryFigure = (galleryImage) => {
  const myImage = document.createElement("img");
  const myCaption = document.createElement("caption");
  const myFigure = document.createElement("figure");
  myCaption.innerHTML =
    "<strong>" +
    galleryImage.name +
    "</strong>: Taken by " +
    galleryImage.credit;
  myImage.src = galleryImage.url;
  myImage.setAttribute("alt", galleryImage.alt);
  myImage.onerror = (error) => console.log("image failed to load", error);
  myFigure.append(myImage, myCaption);
  return myFigure;
};

window.onload = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await registerServiceWorker();
    } catch (error) {
      // registration failed
      console.log("Registration failed with " + error);
      return;
    }
  }
  imgSection.append(...Gallery.images.map(createGalleryFigure));
};
