const determineTransitionType = (oldNavigationEntry, newNavigationEntry) => {
  const currentURL = oldNavigationEntry.url;
  const destinationURL = newNavigationEntry.url;

  function determinePageIndex(url) {
    const array = url.split("/");
    const slug = array[array.length - 1];
    if (slug.indexOf("html") === -1) {
      return 0;
    } else {
      const pageIndex = slug.replace("index", "").replace(".html", "");
      if (pageIndex === "") {
        return 0;
      } else {
        return parseInt(pageIndex);
      }
    }
  }

  const currentPageIndex = determinePageIndex(currentURL);
  const destinationPageIndex = determinePageIndex(destinationURL);

  if (currentPageIndex > destinationPageIndex) {
    return "backwards";
  }
  if (currentPageIndex < destinationPageIndex) {
    return "forwards";
  }
};

window.addEventListener("pageswap", async (e) => {
  const transitionType = determineTransitionType(
    e.activation.from,
    e.activation.entry
  );
  console.log(`pageSwap: ${transitionType}`);
  e.viewTransition.types.add(transitionType);
});

window.addEventListener("pagereveal", async (e) => {
  const transitionType = determineTransitionType(
    navigation.activation.from,
    navigation.activation.entry
  );

  console.log(`pageReveal: ${transitionType}`);
  e.viewTransition.types.add(transitionType);
});
