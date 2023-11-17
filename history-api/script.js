// Update the page content based on the history entry
function displayContent(state) {
  const description = document.querySelector("#description");
  description.textContent = state.description;

  const photo = document.querySelector("#photo");
  photo.setAttribute("src", state.image.src);
  photo.setAttribute("alt", state.image.alt);
}

// Handle click on link
document.addEventListener("click", async (event) => {
  const creature = event.target.getAttribute("data-creature");
  if (creature) {
    event.preventDefault();
    try {
      const response = await fetch(`creatures/${creature}.json`);
      const json = await response.json();
      displayContent(json);
      history.pushState(json, "", creature);
    } catch (err) {
      console.error(err);
    }
  }
});

// Handle forward/back buttons
window.addEventListener("popstate", (event) => {
  if (event.state) {
    displayContent(event.state);
  }
});

// Create state on page load and replace the current history with it
const image = document.querySelector("#photo");
const initialState = {
  description: document.querySelector("#description").textContent,
  image: {
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt"),
  },
};
history.replaceState(initialState, "", document.location.href);
