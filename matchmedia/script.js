/**
 * MATCHMEDIA DEMO - JAVASCRIPT
 * Demonstrates the Window.matchMedia() API for responsive JavaScript
 *
 * This example shows how to:
 * 1. Use matchMedia() to check viewport width
 * 2. Listen for media query changes with addEventListener
 * 3. Update UI dynamically based on screen size
 * 4. Handle multiple media queries simultaneously
 */

// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================

/**
 * Cache DOM element references for better performance
 * These elements will be updated when media queries match/unmatch
 */
const statusMessage = document.querySelector(".status-message");
const statusDetails = document.querySelector(".status-details");
const statusIcon = document.querySelector(".status-icon");

// Query status indicators
const narrowStatus = document.querySelector("#narrow-status");
const mediumStatus = document.querySelector("#medium-status");
const wideStatus = document.querySelector("#wide-status");
const portraitStatus = document.querySelector("#portrait-status");
const landscapeStatus = document.querySelector("#landscape-status");

// Query item containers (for highlighting active queries)
const narrowItem = document.querySelector("#narrow-item");
const mediumItem = document.querySelector("#medium-item");
const wideItem = document.querySelector("#wide-item");
const portraitItem = document.querySelector("#portrait-item");
const landscapeItem = document.querySelector("#landscape-item");

// ============================================================================
// MEDIA QUERY DEFINITIONS
// ============================================================================

/**
 * Create MediaQueryList objects for different viewport widths
 * MediaQueryList provides a way to programmatically check media queries
 * and listen for changes
 */

// Narrow screens (mobile devices)
const narrowScreenQuery = window.matchMedia("(max-width: 600px)");

// Medium screens (tablets and small laptops)
const mediumScreenQuery = window.matchMedia(
  "(min-width: 601px) and (max-width: 1399px)"
);

// Wide screens (large monitors)
const wideScreenQuery = window.matchMedia("(min-width: 1400px)");

// Orientation queries
const portraitQuery = window.matchMedia("(orientation: portrait)");
const landscapeQuery = window.matchMedia("(orientation: landscape)");

// ============================================================================
// MAIN SCREEN TEST FUNCTION
// ============================================================================

/**
 * Tests the current viewport width and updates the UI accordingly
 * This function checks which media query matches and updates:
 * - Background color
 * - Status message
 * - Icon display
 * - Width information
 *
 * @returns {void}
 */
function updateScreenStatus() {
  // Get current viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Check which width-based media query matches
  if (narrowScreenQuery.matches) {
    // Narrow screen: viewport is 600px wide or less
    statusMessage.textContent = "📱 Narrow Screen Detected";
    statusDetails.textContent = `Viewport: ${viewportWidth}px × ${viewportHeight}px`;
    statusIcon.textContent = "📱";
    document.body.style.backgroundColor = "#e74c3c"; // Red
  } else if (wideScreenQuery.matches) {
    // Wide screen: viewport is 1400px or wider
    statusMessage.textContent = "🖥️ Really Wide Screen!";
    statusDetails.textContent = `Viewport: ${viewportWidth}px × ${viewportHeight}px`;
    statusIcon.textContent = "🖥️";
    document.body.style.backgroundColor = "#2ecc71"; // Green
  } else {
    // Medium screen: viewport is between 601px and 1399px
    statusMessage.textContent = "💻 Medium Screen";
    statusDetails.textContent = `Viewport: ${viewportWidth}px × ${viewportHeight}px`;
    statusIcon.textContent = "💻";
    document.body.style.backgroundColor = "#3498db"; // Blue
  }

  // Update all media query status indicators
  updateQueryStatuses();
}

// ============================================================================
// MEDIA QUERY STATUS UPDATES
// ============================================================================

/**
 * Updates the visual indicators for all media queries
 * Shows which queries are currently matching
 *
 * @returns {void}
 */
function updateQueryStatuses() {
  // Update width-based queries
  updateQueryStatus(narrowScreenQuery, narrowStatus, narrowItem);
  updateQueryStatus(mediumScreenQuery, mediumStatus, mediumItem);
  updateQueryStatus(wideScreenQuery, wideStatus, wideItem);

  // Update orientation queries
  updateQueryStatus(portraitQuery, portraitStatus, portraitItem);
  updateQueryStatus(landscapeQuery, landscapeStatus, landscapeItem);
}

/**
 * Updates a single query status indicator
 *
 * @param {MediaQueryList} query - The MediaQueryList object to check
 * @param {HTMLElement} statusElement - The element displaying match/no-match
 * @param {HTMLElement} itemElement - The container element to highlight
 * @returns {void}
 */
function updateQueryStatus(query, statusElement, itemElement) {
  if (query.matches) {
    // Query matches - show as active
    statusElement.textContent = "MATCH";
    statusElement.className = "query-status match";
    itemElement.classList.add("active");
  } else {
    // Query doesn't match - show as inactive
    statusElement.textContent = "NO MATCH";
    statusElement.className = "query-status no-match";
    itemElement.classList.remove("active");
  }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Modern approach: Use addEventListener on MediaQueryList objects
 * This is the recommended way to listen for media query changes
 *
 * The 'change' event fires whenever the media query match status changes
 * (e.g., when resizing the window crosses a breakpoint)
 */

/**
 * Handler for narrow screen query changes
 * @param {MediaQueryListEvent} event - Contains information about the query change
 */
narrowScreenQuery.addEventListener("change", (event) => {
  console.log(`Narrow screen query changed: ${event.matches}`);
  updateScreenStatus();
});

/**
 * Handler for medium screen query changes
 * @param {MediaQueryListEvent} event - Contains information about the query change
 */
mediumScreenQuery.addEventListener("change", (event) => {
  console.log(`Medium screen query changed: ${event.matches}`);
  updateScreenStatus();
});

/**
 * Handler for wide screen query changes
 * @param {MediaQueryListEvent} event - Contains information about the query change
 */
wideScreenQuery.addEventListener("change", (event) => {
  console.log(`Wide screen query changed: ${event.matches}`);
  updateScreenStatus();
});

/**
 * Handler for orientation changes
 * Updates the status indicators when device orientation changes
 */
portraitQuery.addEventListener("change", () => {
  console.log("Orientation changed");
  updateQueryStatuses();
});

landscapeQuery.addEventListener("change", () => {
  console.log("Orientation changed");
  updateQueryStatuses();
});

/**
 * IMPORTANT: The old approach using document.body.onresize is DEPRECATED
 * and doesn't work correctly for this use case.
 *
 * ❌ DON'T DO THIS:
 * document.body.onresize = screenTest;
 *
 * ✅ DO THIS INSTEAD:
 * Use addEventListener on the MediaQueryList objects (as shown above)
 *
 * Benefits of the modern approach:
 * - More efficient (only fires when breakpoints are crossed)
 * - More reliable (doesn't depend on resize events)
 * - Better performance (no need to check on every resize)
 * - Follows web standards
 */

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Run the screen test on page load to set initial state
 * This ensures the UI reflects the current viewport size immediately
 */
updateScreenStatus();

// ============================================================================
// ADDITIONAL EXAMPLES AND NOTES
// ============================================================================

/**
 * EXAMPLE: Checking media queries programmatically
 *
 * You can check if a media query matches at any time:
 */
function checkMediaQueries() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    console.log("User prefers dark mode");
  }

  if (window.matchMedia("(hover: hover)").matches) {
    console.log("Device supports hover (likely a mouse/trackpad)");
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    console.log("Device has a coarse pointer (likely touch screen)");
  }
}

/**
 * EXAMPLE: One-time check without listening for changes
 *
 * If you only need to check once and don't need to listen for changes:
 */
function oneTimeCheck() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
    console.log("Loading mobile-specific features");
  }
}

/**
 * BROWSER SUPPORT:
 * - window.matchMedia() is supported in all modern browsers
 * - addEventListener('change') on MediaQueryList is supported in all modern browsers
 * - For older browsers, you may need to use the deprecated addListener() method
 *
 * COMMON USE CASES:
 * 1. Responsive JavaScript behavior (load different components based on screen size)
 * 2. Conditional resource loading (load high-res images only on large screens)
 * 3. Adaptive UI features (show/hide navigation based on viewport)
 * 4. Performance optimization (disable animations on low-end devices)
 * 5. Accessibility (detect user preferences like reduced motion)
 *
 * PERFORMANCE TIPS:
 * - matchMedia is very efficient - it's optimized by the browser
 * - Use it instead of window.innerWidth checks in resize handlers
 * - Media query listeners only fire when crossing breakpoints, not on every resize
 * - Cache MediaQueryList objects if you need to check them frequently
 */
