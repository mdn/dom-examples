# Window.matchMedia() Demo

A comprehensive demonstration of the **`window.matchMedia()`** API, which provides a way to programmatically test CSS media queries in JavaScript and respond to changes in real-time.

## What This Demo Shows

This example demonstrates how to use `window.matchMedia()` to:

1. **Check Media Queries**: Programmatically test if media queries match the current viewport
2. **Listen for Changes**: Respond to viewport changes using event listeners on `MediaQueryList` objects
3. **Multiple Breakpoints**: Handle multiple media queries simultaneously (narrow, medium, wide screens)
4. **Orientation Detection**: Detect and respond to device orientation changes
5. **Dynamic UI Updates**: Change background colors, text, and status indicators based on viewport size

## Key Features

- **Real-time Updates**: The page responds instantly when you resize the browser window
- **Visual Feedback**: Background color changes based on viewport width (red for narrow, blue for medium, green for wide)
- **Status Dashboard**: Shows which media queries are currently matching
- **Modern JavaScript**: Uses `addEventListener` instead of deprecated methods
- **Comprehensive Comments**: Detailed inline documentation explaining every concept

## How It Works

### Media Query Breakpoints

The demo uses three viewport width breakpoints:

- **Narrow (≤ 600px)**: Mobile devices - Red background 📱
- **Medium (601px - 1399px)**: Tablets and laptops - Blue background 💻
- **Wide (≥ 1400px)**: Large monitors - Green background 🖥️

### MediaQueryList Objects

The code creates `MediaQueryList` objects using `window.matchMedia()`:

```javascript
const narrowScreenQuery = window.matchMedia("(max-width: 600px)");
const wideScreenQuery = window.matchMedia("(min-width: 1400px)");
```

These objects have:
- `.matches` property - Boolean indicating if the query currently matches
- `.media` property - The media query string
- `addEventListener('change')` - Fires when the match status changes

### Event Listeners

Instead of using deprecated `document.body.onresize`, the demo uses modern event listeners on `MediaQueryList` objects:

```javascript
narrowScreenQuery.addEventListener("change", (event) => {
  console.log(`Narrow screen query changed: ${event.matches}`);
  updateScreenStatus();
});
```

This approach is:
- ✅ More efficient (only fires when crossing breakpoints)
- ✅ More reliable (doesn't depend on resize events)
- ✅ Better performance (no need to check on every resize)
- ✅ Standards-compliant

## Improvements Over Original

This updated version fixes several issues from the original example:

### Bug Fixes
- ❌ **Removed**: `document.body.onresize` (deprecated and doesn't work on body element)
- ✅ **Added**: Proper `addEventListener('change')` on `MediaQueryList` objects
- ❌ **Removed**: `var` declarations
- ✅ **Added**: Modern `const` declarations

### Enhancements
- Separated CSS, JavaScript, and HTML into individual files
- Added comprehensive JSDoc-style comments
- Improved UI with modern styling and animations
- Added visual indicators for all active media queries
- Added orientation detection examples
- Included viewport dimensions in the display
- Added smooth transitions between states

### Code Quality
- Modern ES6+ JavaScript syntax
- Detailed inline documentation
- Performance best practices
- Accessibility considerations
- Responsive design principles

## Browser Support

`window.matchMedia()` is supported in all modern browsers:
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Opera: Full support

The `addEventListener('change')` method on `MediaQueryList` is also widely supported. For older browsers that only support the deprecated `addListener()` method, consider using a polyfill.

## Common Use Cases

1. **Responsive JavaScript**: Load different components based on screen size
2. **Conditional Loading**: Load high-resolution images only on large screens
3. **Adaptive Features**: Show/hide navigation elements based on viewport
4. **Performance**: Disable animations on small/low-power devices
5. **Accessibility**: Detect user preferences like `prefers-reduced-motion`
6. **Device Detection**: Identify touch devices vs. mouse/keyboard devices

## Additional Media Query Examples

The API can test many types of media queries:

```javascript
// Color scheme preference
window.matchMedia("(prefers-color-scheme: dark)").matches

// Reduced motion preference (accessibility)
window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Hover capability
window.matchMedia("(hover: hover)").matches

// Pointer type
window.matchMedia("(pointer: coarse)").matches

// Print media
window.matchMedia("print").matches
```

## Try It Yourself

1. Open the demo in your browser
2. Resize the browser window to see the background color change
3. Watch the status indicators update in real-time
4. Check the browser console for event logs
5. Try rotating your device (on mobile) to see orientation changes

[Run the demo live](https://mdn.github.io/dom-examples/matchmedia/).

## Related Documentation

- [Window.matchMedia() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
- [MediaQueryList - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList)
- [Using media queries - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
