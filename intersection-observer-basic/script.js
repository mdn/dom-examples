// ============================================================================
// INTERSECTION OBSERVER DEMO - JAVASCRIPT
// ============================================================================

// ============================================================================
// INTERSECTION OBSERVER SETUP
// ============================================================================

/**
 * Track statistics for the demo
 */
let visibleElements = new Set();
let totalObservedElements = 0;

/**
 * Update the stats panel with current intersection data
 * @param {string} eventDescription - Description of the last intersection event
 */
function updateStats(eventDescription) {
  document.getElementById("visible-count").textContent = visibleElements.size;
  document.getElementById("total-count").textContent = totalObservedElements;
  document.getElementById("last-event").textContent = eventDescription;
}

// ============================================================================
// OBSERVER 1: ANIMATED BOXES
// ============================================================================

/**
 * Callback function for the IntersectionObserver
 * This is called whenever an observed element's intersection status changes
 *
 * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
 * @param {IntersectionObserver} observer - The observer instance
 */
function handleBoxIntersection(entries, observer) {
  entries.forEach((entry) => {
    // entry.isIntersecting is true when the element is visible in viewport
    if (entry.isIntersecting) {
      // Add the 'visible' class to trigger CSS animations
      entry.target.classList.add("visible");

      // Track this element as visible
      const boxNumber = entry.target.dataset.box;
      visibleElements.add(boxNumber);

      // Update stats panel
      updateStats(`Box ${boxNumber} entered viewport`);

      // Optional: Stop observing this element after it becomes visible once
      // This is useful for one-time animations to improve performance
      observer.unobserve(entry.target);
    } else {
      // Element is not visible
      const boxNumber = entry.target.dataset.box;
      visibleElements.delete(boxNumber);
      updateStats(`Box ${boxNumber} left viewport`);
    }
  });
}

/**
 * Create an IntersectionObserver instance
 *
 * Options:
 * - root: The element used as viewport (null = browser viewport)
 * - rootMargin: Margin around root (similar to CSS margin)
 * - threshold: Percentage of target visibility that triggers callback
 */
const boxObserver = new IntersectionObserver(handleBoxIntersection, {
  root: null, // Use the browser viewport as the root
  rootMargin: "0px", // No margin adjustment
  threshold: 0.1, // Trigger when 10% of the element is visible
});

// Select all target boxes and observe them
const targetBoxes = document.querySelectorAll(".target-box");
totalObservedElements += targetBoxes.length;

targetBoxes.forEach((box) => {
  // Start observing each box
  boxObserver.observe(box);
});

// ============================================================================
// OBSERVER 2: LAZY LOADING IMAGES
// ============================================================================

/**
 * Callback for lazy loading images
 * Loads the image source when it enters the viewport
 *
 * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
 * @param {IntersectionObserver} observer - The observer instance
 */
function handleImageIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const imageElement = entry.target;
      const imageSrc = imageElement.dataset.src;

      // Load the image by setting background-image
      imageElement.style.backgroundImage = `url(${imageSrc})`;
      imageElement.classList.add("loaded");
      imageElement.textContent = ""; // Clear loading text

      // Update stats
      updateStats("Image loaded via lazy loading");

      // Stop observing this image
      observer.unobserve(imageElement);
    }
  });
}

/**
 * Create a separate observer for images with different threshold
 * Using a higher threshold (0.5) means the image loads when 50% visible
 */
const imageObserver = new IntersectionObserver(handleImageIntersection, {
  root: null,
  rootMargin: "50px", // Start loading 50px before image enters viewport
  threshold: 0.5, // Trigger when 50% of the image is visible
});

// Select all lazy images and observe them
const lazyImages = document.querySelectorAll(".lazy-image");
totalObservedElements += lazyImages.length;

lazyImages.forEach((image) => {
  imageObserver.observe(image);
});

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize stats display
updateStats("Page loaded - scroll to trigger intersections");

/**
 * CLEANUP (Important for single-page applications)
 * When you're done with an observer, disconnect it to free up resources
 *
 * Example:
 * window.addEventListener('beforeunload', () => {
 *   boxObserver.disconnect();
 *   imageObserver.disconnect();
 * });
 */

// ============================================================================
// ADDITIONAL NOTES
// ============================================================================

/**
 * Browser Support:
 * - IntersectionObserver is supported in all modern browsers
 * - For older browsers, use a polyfill: https://github.com/w3c/IntersectionObserver
 *
 * Common Use Cases:
 * 1. Lazy loading images and content
 * 2. Infinite scrolling
 * 3. Tracking ad visibility
 * 4. Triggering animations on scroll
 * 5. Deferring video autoplay until visible
 *
 * Performance Tips:
 * - Use unobserve() for one-time events to reduce overhead
 * - Avoid heavy computations in the callback
 * - Use appropriate thresholds to avoid excessive callbacks
 * - Consider using rootMargin to preload content before it's visible
 */
