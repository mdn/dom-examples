# MDN responsive iframe sizing examples

This set of examples demonstrates usage of the responsive iframe sizing features:

- The CSS [`frame-sizing`](https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/frame-sizing) property
- The [`Window.requestResize()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestResize) method
- The [`<meta name="responsive-embedded-sizing">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/responsive-embedded-sizing) meta tag

## Examples

- [Basic example](basic/): Provides a basic example showing how the `frame-sizing` CSS property and `responsive-embedded-sizing` meta tag can be used to size an `<iframe>` to neatly contain its embedded content. [See the basic demo live](https://mdn.github.io/dom-examples/responsive-iframe-sizing/basic/).
- [`requestResize()` example](js-request-resize/): Builds on the previous example, showing how the `requestResize()` method can be used to dynamically resize an `<iframe>` element to continue to neatly contain its embedded content, when the content size changes. [See the `requestResize()` demo live](https://mdn.github.io/dom-examples/responsive-iframe-sizing/js-request-resize/).
