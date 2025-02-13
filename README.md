# dom-examples

Code examples that accompany various MDN DOM and Web API documentation pages.

> [!NOTE]
> You can include an example directly in MDN pages using [`{{EmbedLiveSample()}}` macros](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Macros/Commonly_used_macros#code_samples) or regular Markdown code blocks.
> These methods are simpler to maintain as the code lives beside the rest of the content.
> Only add examples to this repository if your example doesn't easily run on MDN pages for technical or security reasons.

## Repository contents

- The "abort-api" directory contains an example of how to use the "Abort API" (aka [AbortSignal](https://dom.spec.whatwg.org/#interface-AbortSignal) and [AbortController](https://dom.spec.whatwg.org/#interface-abortcontroller)). [Run the example live](https://mdn.github.io/dom-examples/abort-api/).

- The "audiocontext-setsinkid" directory contains an example of how to use the [`AudioContext.setSinkId()`](https://developer.mozilla.org/docs/Web/API/AudioContext/setSinkId) method and related features. [Run the example live](https://mdn.github.io/dom-examples/audiocontext-setsinkid/).

- The "auxclick" directory contains a basic example demonstrating the new <code>auxclick</code> event type. See [GlobalEventHandlers.auxclick](https://developer.mozilla.org/docs/Web/API/GlobalEventHandlers/onauxclick) for more details, or [run the example live](https://mdn.github.io/dom-examples/auxclick/).

- The "canvas" directory contains an example "chroma-keying" demonstrating how to use the Canvas API to manipulate videos: see [Manipulating video using canvas](https://developer.mozilla.org/docs/Web/API/Canvas_API/Manipulating_video_using_canvas) or [run the example live](https://mdn.github.io/dom-examples/canvas/chroma-keying/).

- The "channel-messaging-basic" directory contains a basic example demonstrating the basics of channel messaging; see [Channel Messaging API](https://developer.mozilla.org/docs/Web/API/Channel_Messaging_API) or [run the example live](https://mdn.github.io/dom-examples/channel-messaging-basic/).

- The "channel-messaging-multimessage" directory contains another channel messaging demo, showing how multiple messages can be sent between browsing contexts. See [Channel Messaging API](https://developer.mozilla.org/docs/Web/API/Channel_Messaging_API) for more details. [Run the demo live](https://mdn.github.io/dom-examples/channel-messaging-multimessage/).

- The "css-painting" directory contains examples demonstrating the [CSS Painting API](https://developer.mozilla.org/docs/Web/API/CSS_Painting_API). See the [examples live](https://mdn.github.io/dom-examples/css-painting).

- The "device-posture-api" directory contains an example demonstrating how to use the [Device Posture API](https://developer.mozilla.org/docs/Web/API/Device_Posture_API). [Run the example live](https://mdn.github.io/dom-examples/device-posture-api/).

- The "drag-and-drop" directory is for examples and demos of the [HTML Drag and Drop](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API) standard.

- The "document-picture-in-picture" directory contains an example showing usage of the [Document Picture-in-Picture API](http://developer.mozilla.org/docs/Web/API/Document_Picture-in-Picture_API/). [See the example live](https://mdn.github.io/dom-examples/document-picture-in-picture/).

- The "edit-context" directory contains examples demonstrating the [EditContext API](https://developer.mozilla.org/docs/Web/API/EditContext_API). See the [list of examples](https://github.com/mdn/dom-examples/tree/main/edit-context/).

- The "fullscreen-api" directory is for examples and demos of the [Fullscreen API](https://wiki.developer.mozilla.org/docs/Web/API/Fullscreen_API). Run the [example live](https://mdn.github.io/dom-examples/fullscreen-api/).

- The "history-api" directory contains an example that demonstrates the [History API](https://developer.mozilla.org/docs/Web/API/History_API). [View the demo live](https://mdn.github.io/dom-examples/history-api/).

- The "indexeddb-api" directory contains a demo for the [IndexedDB API](https://mdn.github.io/dom-examples/indexeddb-api/index.html).

- The "insert-adjacent" directory contains basic demos for [insertAdjacentElement](https://mdn.github.io/dom-examples/insert-adjacent/insertAdjacentElement.html) and [insertAdjacentText](https://mdn.github.io/dom-examples/insert-adjacent/insertAdjacentText.html).

- The "matchmedia" directory contains a basic demo to test matchMedia functionality. See [Window.matchMedia](https://developer.mozilla.org/docs/Web/API/Window/matchMedia) for more details. [Run the demo live](https://mdn.github.io/dom-examples/matchmedia/).

- The "mediaquerylist" directory contains a basic demo to test more advanced matchMedia/mediaquerylist functionality. See [MediaQueryList](https://developer.mozilla.org/docs/Web/API/MediaQueryList) for more details. [Run the demo live](https://mdn.github.io/dom-examples/mediaquerylist/index.html).

- The "media" directory contains examples and demos showing how to use HTML and DOM [media elements and APIs](https://developer.mozilla.org/docs/Web/Media).

- The "payment-request" directory contains examples of the [Payment Request API](https://developer.mozilla.org/docs/Web/API/Payment_Request_API).

- The "pointerevents" directory is for examples and demos of the [Pointer Events](https://developer.mozilla.org/docs/Web/API/Pointer_events) standard.

- The "pointer-lock" directory contains a basic demo to show usage of the Pointer Lock API. You can find more explanation of how the demo works at the main MDN [Pointer Lock API](https://developer.mozilla.org/docs/Web/API/Pointer_Lock_API) page. [Run the demo live](https://mdn.github.io/dom-examples/pointer-lock/).

- The "popover-api" directory is for examples and demos of the [Popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) standard. Go to the [Popover API demo index](https://mdn.github.io/dom-examples/popover-api/) to see what's available.

- The "reporting-api" directory contains a couple of basic demos to show usage of the Reporting API. You can find more explanation of how the API works in the main MDN [Reporting API](https://developer.mozilla.org/docs/Web/API/Reporting_API) docs. [Run the deprecation report demo live](https://mdn.github.io/dom-examples/reporting-api/deprecation_report.html).

- The "resize-event" directory contains a basic demo to show how you can use the [resize event](https://developer.mozilla.org/docs/Web/API/Window/resize_event). Resize the browser window either by height or width to see the size of your current window. [Run the demo live](https://mdn.github.io/dom-examples/resize-event).

- The "screen-capture-api" directory contains demos to show typical usage of the [Screen Capture API](https://developer.mozilla.org/docs/Web/API/Screen_Capture_API) and [Screen Capture Extensions](https://developer.mozilla.org/docs/Web/API/Screen_Capture_extensions).

- The "screenleft-screentop" directory contains a demo to show how you could use the [Window.screenLeft](https://developer.mozilla.org/docs/Web/API/Window/screenLeft) and [Window.screenTop](https://developer.mozilla.org/docs/Web/API/Window/screenTop) properties to draw a circle on a canvas that always stays in the same physical place on the screen when you move your browser window. [Run the demo live](https://mdn.github.io/dom-examples/screenleft-screentop/).

- The "scrolltooptions" directory contains a demo to show how you could use the [ScrollToOptions](https://developer.mozilla.org/docs/Web/API/ScrollToOptions) dictionary along with the [Window.ScrollTo()](https://developer.mozilla.org/docs/Web/API/Window/scrollTo) method to programmatically scroll a web page. [Run the demo live](https://mdn.github.io/dom-examples/scrolltooptions/).

- The "server-sent-events" directory contains a very basic SSE demo that uses PHP to create the server. You can find more information in our [Using server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events) article. To run the demo you'll need to serve the files from a server that supports PHP; [MAMP](https://www.mamp.info/en/) is a good PHP test server environment.

- The "service-worker/simple-service-worker" directory contains a simple demo showing how to use the [`Service Worker API`](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) to manage your page's cache. [Run the demo live](https://mdn.github.io/dom-examples/service-worker/simple-service-worker/).

- The "sourcebuffer" directory contains a basic demo to show usage of the [`SourceBuffer`](https://developer.mozilla.org/docs/Web/API/SourceBuffer) interface. [Run the demo live](https://mdn.github.io/dom-examples/sourcebuffer/).

- The "streams" directory contains demos of the Streams API for using low-level I/O processing.

- The "touchevents" directory is for examples and demos of the [Touch Events](https://developer.mozilla.org/docs/Web/API/Touch_events) standard.

- The "visual-viewport-api" directory contains a basic demo to show usage of the Visual Viewport API. For more details on how it works, read [Visual Viewport API](https://developer.mozilla.org/docs/Web/API/Visual_Viewport_API). [View the demo live](https://mdn.github.io/dom-examples/visual-viewport-api/).

- The "web-animations-api" directory contains [Web Animation API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API) demos. See the [web animations README](web-animations-api/README.md) for more information.

- The "web-storage" directory contains a basic demo to show usage of the Web Storage API. For more detail on how it works, read [Using the Web Storage API](https://developer.mozilla.org/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API). [View the demo live](https://mdn.github.io/dom-examples/web-storage/).

- The "view-transitions" directory contains demos to show usage of the [View Transitions API](https://developer.mozilla.org/docs/Web/API/View_Transitions_API), both for single-page app [View the SPA demo live](https://mdn.github.io/dom-examples/view-transitions/spa/) and multiple-page app [View the MPA demo live](https://mdn.github.io/dom-examples/view-transitions/mpa/) view transitions.

- The "web-share" directory contains a basic demo to show usage of the [Web Share API](https://developer.mozilla.org/docs/Web/API/Navigator/share). [View the demo live](https://mdn.github.io/dom-examples/web-share/).

- The "web-workers" directory contains a basic web worker to demonstrate how [Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) work. [View the demo live](https://mdn.github.io/dom-examples/web-workers/simple-web-worker/).

- The ["webgl-examples"](webgl-examples/README.md) directory contains a number of WebGL examples that demonstrate the [WebGL API](https://developer.mozilla.org/docs/Web/API/WebGL_API), which is used for 2D and 3D graphics on the web.

- The "webgpu-compute-demo" directory contains an example that demonstrates basic usage of the [WebGPU API](https://developer.mozilla.org/docs/Web/API/WebGPU_API) compute pipeline, which is used for performing general computation on the GPU. [View the demo live](https://mdn.github.io/dom-examples/webgpu-compute-demo/).

- The "webgpu-render-demo" directory contains an example that demonstrates basic usage of the [WebGPU API](https://developer.mozilla.org/docs/Web/API/WebGPU_API) render pipeline, which is used for rendering high-performance graphics via the GPU. [View the demo live](https://mdn.github.io/dom-examples/webgpu-render-demo/).

- The "window-management-api" directory contains a basic demo to show usage of the [Window Management API](https://developer.mozilla.org/docs/Web/API/Window_Management_API). [View the demo live](https://mdn.github.io/dom-examples/window-management-api/).

## Contribute to MDN Web Docs

You can contribute to MDN Web Docs and be a part of our community through content contributions, engineering, or translation work.
The MDN Web Docs project welcomes contributions from everyone who shares our goals and wants to contribute constructively and respectfully within our community.

To find out how to get started, see the [CONTRIBUTING.md](CONTRIBUTING.md) document in this repository.
By participating in and contributing to our projects and discussions, you acknowledge that you have read and agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Get in touch

You can communicate with the MDN Web Docs team and community using the [communication channels][].

[communication channels]: https://developer.mozilla.org/en-US/docs/MDN/Community/Communication_channels
