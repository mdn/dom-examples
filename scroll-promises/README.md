# MDN scroll promises examples

This set of examples demonstrates usage of the promise-returning versions of the `Window` and `Element` scroll methods. In each case, the promise can be used to respond to a scroll operation finishing, which is useful for smooth scrolling operations (for example, created using the [`scroll-behavior`](https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-behavior) CSS property).

## Examples

- [Element methods](element-methods/): Provides a scrolling container full of content, and a toolbar containing buttons that trigger various scrolling operations using [`Element.scroll()`](https://developer.mozilla.org/docs/Web/API/Element/scroll), [`Element.scrollBy()`](https://developer.mozilla.org/docs/Web/API/Element/scrollBy), [`Element.scrollIntoView()`](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView), and [`Element.scrollTo()`](https://developer.mozilla.org/docs/Web/API/Element/scrollTo). [See the element methods demo live](https://mdn.github.io/dom-examples/scroll-promises/element-methods/).
- [Window methods](window-methods/): Provides a window full of content, and a toolbar containing buttons that trigger various scrolling operations using [`Window.scroll()`](https://developer.mozilla.org/docs/Web/API/Window/scroll), [`Window.scrollBy()`](https://developer.mozilla.org/docs/Web/API/Window/scrollBy), and [`Window.scrollTo()`](https://developer.mozilla.org/docs/Web/API/Window/scrollTo). [See the window methods demo live](https://mdn.github.io/dom-examples/scroll-promises/window-methods/).

In both cases, `scroll-behavior: smooth` is set on the scrolling element to implement smooth scrolling operations. Each button event handler applies a fade-out animation to the toolbar, then scrolls the content, then applies a fade-in animation to the toolbar once the scroll operation promise resolves. The result is that toolbar fades out when a button is pressed, then fades in again once scrolling is finished.
