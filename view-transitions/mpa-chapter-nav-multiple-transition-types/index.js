const determineTransitionType = (oldNavigationEntry, newNavigationEntry) => {
  // Grab the current and destination URLs from the provided navigation entries
  const currentURL = oldNavigationEntry.url;
  const destinationURL = newNavigationEntry.url;

  // Find the index number of a page
  function determinePageIndex(url) {
    // Split the URL at the "/" character
    const array = url.split("/");
    // Grab the last array item, which should contain the end slug
    const slug = array[array.length - 1];
    // If the URL doesn't include the HTML file name, return index 0
    if (slug.indexOf("html") === -1) {
      return 0;
    } else {
      // Extract the number from the file name, e.g. index1.html -> 1
      const pageIndex = slug.replace("index", "").replace(".html", "");
      // If it doesn't contain a number (i.e. index.html), return 0
      if (pageIndex === "") {
        return 0;
      } else {
        // Return the number
        return parseInt(pageIndex);
      }
    }
  }

  // Get the page index of the current and destination URLs
  const currentPageIndex = determinePageIndex(currentURL);
  const destinationPageIndex = determinePageIndex(destinationURL);

  // Return "forwards" or "backwards" depending on whether currentPageIndex
  // is bigger or smaller than destinationPageIndex
  if (currentPageIndex > destinationPageIndex) {
    return "backwards";
  } else if (currentPageIndex < destinationPageIndex) {
    return "forwards";
  }
};

window.addEventListener("pageswap", async (e) => {
  // Grab the old and new navigation entries on the outgoing page from the pageswap event object's
  // activation property, pass these to the determineTransitionType() function to determine the type
  const transitionType = determineTransitionType(
    e.activation.from,
    e.activation.entry
  );
  console.log(`pageSwap: ${transitionType}`);
  // Add the type to the active ViewTransition via its types property
  e.viewTransition.types.add(transitionType);
});

window.addEventListener("pagereveal", async (e) => {
  // Grab the old and new navigation entries on the incoming page from the Navigation.activation
  // object, pass these to the determineTransitionType() function to determine the type
  const transitionType = determineTransitionType(
    navigation.activation.from,
    navigation.activation.entry
  );

  console.log(`pageReveal: ${transitionType}`);
  // If the type is undefined, don't add anything to the transition types
  if (transitionType !== undefined) {
    // Add the type to the active ViewTransition via its types property
    e.viewTransition.types.add(transitionType);
  }
});
