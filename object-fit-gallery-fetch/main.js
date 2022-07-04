const thumbs = document.querySelectorAll(".thumb");
const mainImg = document.querySelector(".main");

thumbs.forEach((thumb, index) => {
  const requestObj = `images/pic${index}.jpg`;

  fetch(requestObj)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => displayImage(thumb, blob))
    .catch((error) => {
      thumb.title = `Image load failed: ${error.message}`;
    });
});

function displayImage(currentThumb, blob) {
  const objectURL = URL.createObjectURL(blob);
  currentThumb.setAttribute("src", objectURL);
  currentThumb.onclick = () => {
    mainImg.setAttribute("src", objectURL);
    mainImg.className = "blowup";
    for (const thumb of thumbs) {
      thumbs.className = "thumb darken";
    }
  };
}

mainImg.onclick = () => {
  mainImg.className = "main";
  for (const thumb of thumbs) {
    thumb.className = "thumb";
  }
};
