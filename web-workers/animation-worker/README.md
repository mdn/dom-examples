# Worker Demo

This demo demonstrates how to use a `Worker` to run long-running tasks in a background thread, preventing the main thread from being blocked.

## showcase

[Open the home page](https://mdn.github.io/dom-examples/web-workers/index.html)

## description

1. Open the home page.
2. Click the `start` button to view the animation effect.
3. Wait for the animation effect to finish before switching to the `optimize` button and clicking the `block` button. Observe the difference between using a Worker and not using a Worker, such as the transition from the `doing` state to the `done` state and the animation effect.