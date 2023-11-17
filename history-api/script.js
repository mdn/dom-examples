function displayContent(state) {
  const description = document.querySelector("#description");
  description.textContent = state.description;

  const photo = document.querySelector("#photo");
  photo.setAttribute("src", state.image.src);
  photo.setAttribute("alt", state.image.alt);
}

// handle click on link
document.addEventListener("click", async (event) => {
  const creature = event.target.getAttribute("data-creature");
  if (creature) {
    event.preventDefault();
    try {
      const response = await fetch(`creatures/${creature}.json`);
      const json = await response.json();
      displayContent(json);
      history.pushState(json, "", "");
    } catch (err) {
      console.error(err);
    }
  }
});

// handle forward/back buttons
window.addEventListener("popstate", (event) => {
  // guard against popstate event on chrome init
  if (event.state) {
    // get the state and change the page content
    displayContent(event.state);
  }
});

// create state on page init and replace the current history with it
const image = document.querySelector("#photo");
const initialState = {
  description: document.querySelector("#description").textContent,
  image: {
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt"),
  },
};
history.replaceState(initialState, "", document.location.href);
