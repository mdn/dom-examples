# ManagedMediaSource demo

This example demonstrates how to use the [`ManagedMediaSource`](https://developer.mozilla.org/en-US/docs/Web/API/ManagedMediaSource) interface to set up a managed media source, attach it to a `<video>` element, and respond to `startstreaming` and `endstreaming` events to control when media data is fetched. It also listens for `bufferedchange` events on the `ManagedSourceBuffer` and logs the added time ranges.

[See the example live](https://mdn.github.io/dom-examples/media-source-extensions/managed-media-source/).
