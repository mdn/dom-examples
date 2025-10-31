// This is a SharedWorker script that demonstrates SharedWorkerGlobalScope

// The 'self' keyword refers to the SharedWorkerGlobalScope
console.log('SharedWorker started');
console.log('Worker name:', self.name); // Demonstrates 'name' property

// Keep track of connected ports
const connections = [];
let messageCount = 0;

// The onconnect event handler is part of SharedWorkerGlobalScope
// It's called whenever a new client connects to the SharedWorker
self.onconnect = function(event) {
  const port = event.ports[0];
  connections.push(port);
  
  console.log(`New connection established. Total connections: ${connections.length}`);
  
  // Send welcome message with SharedWorkerGlobalScope info
  port.postMessage({
    type: 'connected',
    workerName: self.name,
    connectionCount: connections.length,
    message: 'Connected to SharedWorker'
  });
  
  // Handle messages from this port
  port.onmessage = function(e) {
    messageCount++;
    console.log('Received message:', e.data);
    
    switch(e.data.type) {
      case 'getName':
        // Demonstrate accessing the 'name' property of SharedWorkerGlobalScope
        port.postMessage({
          type: 'name',
          name: self.name
        });
        break;
        
      case 'getConnections':
        // Show how many clients are connected
        port.postMessage({
          type: 'connections',
          count: connections.length
        });
        break;
        
      case 'sendMessage':
        // Broadcast message to all connected clients
        const broadcastMessage = {
          type: 'broadcast',
          message: e.data.message,
          from: connections.indexOf(port) + 1,
          totalMessages: messageCount
        };
        
        connections.forEach(p => {
          p.postMessage(broadcastMessage);
        });
        break;
        
      case 'close':
        // Demonstrate closing a connection
        const index = connections.indexOf(port);
        if (index > -1) {
          connections.splice(index, 1);
          console.log(`Connection closed. Remaining connections: ${connections.length}`);
        }
        
        port.postMessage({
          type: 'closed',
          message: 'Connection closed'
        });
        break;
        
      default:
        port.postMessage({
          type: 'error',
          message: 'Unknown command'
        });
    }
  };
  
  // Handle port close
  port.onclose = function() {
    const index = connections.indexOf(port);
    if (index > -1) {
      connections.splice(index, 1);
      console.log(`Port closed. Remaining connections: ${connections.length}`);
    }
  };
};

// Demonstrate that SharedWorkerGlobalScope has access to global functions
console.log('SharedWorkerGlobalScope has access to:');
console.log('- setTimeout:', typeof setTimeout);
console.log('- setInterval:', typeof setInterval);
console.log('- fetch:', typeof fetch);
console.log('- console:', typeof console);

// Note: SharedWorkerGlobalScope does NOT have access to:
// - window object
// - document object
// - DOM APIs
