# MDN HTML-in-canvas examples

This set of examples demonstrates usage of the [HTML-in-canvas API](https://github.com/WICG/html-in-canvas):

- [Canvas 2D context example](2d-context-example/): Demonstrates how an HTML form can be rendered on a 2D canvas with a pixel distortion effect that follows the pointer, while the form remains accessible, interactive, and submittable ([run example live](https://mdn.github.io/dom-examples/html-in-canvas/2d-context-example/)).
- [WebGL example](webgl-example/): Demonstrates how to render an HTML form as a texture on all six faces of a rotating 3D cube. The rotation pauses when the form is hovered or focused, so you can interact with the form on the front-most face as expected (clicking into it, and so on). As in the 2D example, the form remains accessible, interactive, and submittable ([run example live](https://mdn.github.io/dom-examples/html-in-canvas/webgl-example/)).
- [WebGPU example](webgpu-example/): Demonstrates the same rotating cube as the WebGL example, only using WebGPU ([run example live](https://mdn.github.io/dom-examples/html-in-canvas/webgpu-example/)).
- [Canvas 2D context nested canvases example](2d-context-nested-canvases/): Demonstrates how `paint` events fire in nested canvases. Click the button to change the color of the inner element, and watch the console to see which canvases repaint ([run example live](https://mdn.github.io/dom-examples/html-in-canvas/2d-context-nested-canvases/)).
