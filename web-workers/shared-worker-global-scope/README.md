# SharedWorkerGlobalScope Example

This example demonstrates the `SharedWorkerGlobalScope` interface, which represents the global execution context of a SharedWorker.

## What is SharedWorkerGlobalScope?

`SharedWorkerGlobalScope` is the global scope for SharedWorkers, similar to how `Window` is the global scope for web pages. It provides:

- **`name`** property - The name given to the SharedWorker
- **`onconnect`** event handler - Called when a new client connects
- **`close()`** method - Closes the worker
- **`self`** reference - Points to the global scope itself

## Features Demonstrated

1. **Worker Name**: Shows how to access `SharedWorkerGlobalScope.name`
2. **Connection Tracking**: Demonstrates handling multiple client connections
3. **Message Broadcasting**: Shows communication between multiple clients through the shared worker
4. **Connection Management**: Demonstrates closing connections

## How to Use

1. Open `index.html` in a web browser
2. Click "Connect to SharedWorker" on both Client 1 and Client 2
3. Try the different buttons to interact with the SharedWorker
4. Open the page in multiple browser tabs to see the shared state!

## Key Concepts

### SharedWorker vs Worker

- **Worker**: Each page gets its own dedicated worker instance
- **SharedWorker**: Multiple pages/tabs share the same worker instance

### SharedWorkerGlobalScope Properties

```javascript
// Inside worker.js
console.log(self.name);  // The worker's name
self.onconnect = function(e) {  // Connection handler
  // Handle new connections
};
```

## Browser Compatibility

SharedWorker is supported in:
- Chrome/Edge
- Firefox
- Safari (limited support)

**Note**: SharedWorkers require HTTPS or localhost for security reasons.

## Related MDN Documentation

- [SharedWorkerGlobalScope](https://developer.mozilla.org/docs/Web/API/SharedWorkerGlobalScope)
- [SharedWorker](https://developer.mozilla.org/docs/Web/API/SharedWorker)
- [Using Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers)
