// Data for the sites to open
const sites = [
  {
    "name": "MDN code playground",
    "url": "https://developer.mozilla.org/en-US/play"
  },
  {
    "name": "MDN HTML reference",
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTML"
  },
  {
    "name": "MDN CSS reference",
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS"
  },
  {
    "name": "MDN JavaScript reference",
    "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  }
]

const outputElem = document.querySelector("section");

// Array to hold references to the currently open windows
let windowRefs = [];

// Constants to represent the width and height of the Chrome UI when calculating the window size to open 
const WINDOW_CHROME_Y = 51;
const WINDOW_CHROME_X = 1;

// Feature detection: we'll open windows in sites that support the API
// and create links in sites that do not
if ("getScreenDetails" in window) {
  // The Window Management API is supported
  createButton();
} else {
  // The Window Management API is not supported
  createLinks(sites);
}

// Functions for creating the links or the button

function createLinks(sites) {
  const list = document.createElement("ul");

  sites.forEach(site => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    link.textContent = site.name;
    link.href = site.url;

    listItem.appendChild(link);
    list.appendChild(listItem);
  });

  outputElem.appendChild(list);
}

function createButton() {
  const btn = document.createElement("button");
  btn.textContent = "Open learning environment"
  outputElem.appendChild(btn);

  btn.addEventListener("click", openWindows);
}

// Functions for creating the windows

function openWindow(left, top, width, height, url) {
  const windowFeatures = `left=${left},top=${top},width=${width},height=${height}`;
  const windowRef = window.open(
    url,
    "_blank", // needed for it to open in a new window
    windowFeatures,
  );

  // Store a reference to the window in the windowRefs array
  windowRefs.push(windowRef);

}

function closeAllWindows() {
  // Loop through all window refs and close each one 
  windowRefs.forEach(windowRef => {
    windowRef.close();
  });
  windowRefs = [];
}

async function openWindows() {
  const screenDetails = await window.getScreenDetails();

  // Return the number of screens
  const noOfScreens = screenDetails.screens.length;

  if (noOfScreens === 1) {
    // Only one screen
    const screen1 = screenDetails.screens[0];
    // Windows will be half the width and half the height of the screen
    // The available width of screen1, minus 2 times the horizontal browser chrome width, divided by 2 
    const windowWidth = Math.floor((screen1.availWidth - 2 * WINDOW_CHROME_X) / 2);
    // The available height of screen1, minus 2 times the horizontal browser chrome height, divided by 2 
    const windowHeight = Math.floor((screen1.availHeight - 2 * WINDOW_CHROME_Y) / 2);

    openWindow(screen1.availLeft,
      screen1.availTop,
      windowWidth,
      windowHeight,
      sites[0].url);
    openWindow(windowWidth + screen1.availLeft + WINDOW_CHROME_X,
      screen1.availTop,
      windowWidth,
      windowHeight,
      sites[1].url);
    openWindow(screen1.availLeft,
      windowHeight + screen1.availHeight + WINDOW_CHROME_Y,
      windowWidth,
      windowHeight,
      sites[2].url);
    openWindow(windowWidth + screen1.availLeft + WINDOW_CHROME_X,
      windowHeight + screen1.availHeight + WINDOW_CHROME_Y,
      windowWidth,
      windowHeight,
      sites[3].url);

  } else {
    // Two screens or more
    const screen1 = screenDetails.screens[0];
    const screen2 = screenDetails.screens[1];
    // Windows will be a third the width and the full height of the screen
    // The available width of screen1, minus 3 times the horizontal browser chrome width, divided by 3 
    const windowWidth = Math.floor((screen1.availWidth - 3 * WINDOW_CHROME_X) / 3);
    // The available height of screen1, minus the vertical browser chrome width
    const windowHeight = Math.floor(screen1.availHeight - WINDOW_CHROME_Y);

    // Open the reference windows in thirds across the entire height of the primary screen
    openWindow(screen1.availLeft,
      screen1.availTop,
      windowWidth,
      windowHeight,
      sites[1].url);
    openWindow(screen1.availLeft + windowWidth + WINDOW_CHROME_X,
      screen1.availTop,
      windowWidth,
      windowHeight,
      sites[2].url);
    openWindow(screen1.availLeft + ((windowWidth + WINDOW_CHROME_X) * 2),
      screen1.availTop,
      windowWidth,
      windowHeight,
      sites[3].url);

    // Open the code editor the full size of the secondary screen
    openWindow(screen2.availLeft,
      screen2.availTop,
      screen2.availWidth,
      screen2.availHeight,
      sites[0].url);
  }

  // Check whether one of our popup windows has been closed
  // If so, close them all

  closeMonitor = setInterval(checkWindowClose, 250);

  function checkWindowClose() {
    if (windowRefs.some(windowRef => windowRef.closed)) {
      closeAllWindows();
      clearInterval(closeMonitor);
    }
  }

  // Also close our popup windows if the main app window is closed

  window.addEventListener("beforeunload", () => {
    closeAllWindows();
  });

  screenDetails.addEventListener("screenschange", () => {
    // If the new number of screens is different to the old number of screens, report the difference
    if (screenDetails.screens.length !== noOfScreens) {
      console.log(
        `The screen count changed from ${noOfScreens} to ${screenDetails.screens.length}`,
      );
    }

    // If the windows are open, close them and then open them again
    // So that they fit with the new screen configuration
    if (windowRefs.length > 0) {
      closeAllWindows();
      openWindows();
    }
  });
}
