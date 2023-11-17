function displayContent(state) {
  const description = document.querySelector("#description");
  description.textContent = state.description;

  const photo = document.querySelector("#photo");
  photo.setAttribute("src", state.image.src);
  photo.setAttribute("alt", state.image.alt);
}

// handle click on link
document.addEventListener("click", async (event) => {
  const cat = event.target.getAttribute("data-cat");
  if (cat) {
    event.preventDefault();
    try {
      const response = await fetch(`${cat}.json`);
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
    displayContent(event.state, true);
  }
});

const image = document.querySelector("#photo");

// create state on page init and replace the current history with it
const initialState = {
  description: document.querySelector("#description").textContent,
  image: {
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt"),
  },
};
history.replaceState(initialState, "", document.location.href);
