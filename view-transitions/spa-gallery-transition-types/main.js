const displayedImage = document.querySelector(".displayed-img");
const thumbBar = document.querySelector(".thumb-bar");
const caption = document.querySelector("figcaption");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

// Initially disable previous button, as there is no image to go back to
prevBtn.disabled = true;

// Array of image data
const images = [
  { filename: "pic1.jpg", alt: "Closeup of a human eye" },
  { filename: "pic2.jpg", alt: "Rock that looks like a wave" },
  { filename: "pic3.jpg", alt: "Purple and white pansies" },
  { filename: "pic4.jpg", alt: "Section of wall from a pharoah's tomb" },
  { filename: "pic5.jpg", alt: "Large moth on a leaf" },
];

const baseURL =
  "https://mdn.github.io/shared-assets/images/examples/learn/gallery/";

// Create thumbnails for all the images in the array
images.forEach((image, index) => {
  const newImage = document.createElement("img");
  newImage.id = index;
  newImage.src = `${baseURL}${image.filename}`;
  newImage.alt = image.alt;
  newImage.tabIndex = "0";
  thumbBar.appendChild(newImage);
  // Add click and keydown listeners to change the displayed
  // image when a thumb is pressed via mouse or keyboard
  newImage.addEventListener("click", displayNewImage);
  newImage.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      displayNewImage(e);
    }
  });
});

// Create an array of references to the generated images
const thumbs = Array.from(document.querySelectorAll(".thumb-bar img"));
/* Highlight the first thumb with the highlight class, as it is displayed on load */
thumbs[0].classList.add("thumb-select-highlight");

// Add click listeners to the previous and next butons so they
// change the displayed image
prevBtn.addEventListener("click", displayNewImage);
nextBtn.addEventListener("click", displayNewImage);

function displayNewImage(e) {
  // Grab the id of the currently-displayed image
  let curId = Number(displayedImage.getAttribute("data-id"));
  // This will contain the id of the new image to display
  let newId;

  // Remove the blue highlight class
  thumbs.forEach((thumb) => thumb.classList.remove("thumb-select-highlight"));

  if (e.target === prevBtn) {
    // Code to display the new image if the prev button was pressed
    newId = curId - 1;
    document.startViewTransition({
      update: () => {
        displayedImage.src = `${baseURL}${images[newId].filename}`;
        displayedImage.alt = images[newId].alt;
        displayedImage.setAttribute("data-id", newId);
        caption.textContent = images[newId].alt;
      },
      types: ["backwards"],
    });
  } else if (e.target === nextBtn) {
    // Code to display the new image if the next button was pressed
    newId = curId + 1;
    document.startViewTransition({
      update: () => {
        displayedImage.src = `${baseURL}${images[newId].filename}`;
        displayedImage.alt = images[newId].alt;
        displayedImage.setAttribute("data-id", newId);
        caption.textContent = images[newId].alt;
      },
      types: ["forwards"],
    });
  } else {
    // Code to display new the new image if a thumbnail was pressed
    newId = Number(e.target.id);
    document.startViewTransition({
      update: () => {
        displayedImage.src = e.target.src;
        displayedImage.alt = e.target.alt;
        displayedImage.setAttribute("data-id", newId);
        caption.textContent = e.target.alt;
      },
      types: ["upwards"],
    });
  }

  // Find the thumbnail that has been displayed and add the blue highlight to it
  const result = thumbs.find((thumb) => Number(thumb.id) === newId);
  result.classList.add("thumb-select-highlight");

  // Check whether the first or the last image was selected,
  // and if so, disable the relevant control button. If not, enable them
  newId === 0 ? (prevBtn.disabled = true) : (prevBtn.disabled = false);
  newId === images.length - 1
    ? (nextBtn.disabled = true)
    : (nextBtn.disabled = false);
}
