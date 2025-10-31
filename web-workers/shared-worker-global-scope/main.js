// Create two separate client instances to demonstrate SharedWorker sharing

class WorkerClient {
  constructor(clientId) {
    this.clientId = clientId;
    this.worker = null;
    this.port = null;
    this.output = document.getElementById(`output${clientId}`);
    
    this.setupButtons();
  }
  
  setupButtons() {
    document.getElementById(`connect${this.clientId}`).addEventListener('click', () => this.connect());
    document.getElementById(`getName${this.clientId}`).addEventListener('click', () => this.getName());
    document.getElementById(`getConnections${this.clientId}`).addEventListener('click', () => this.getConnections());
    document.getElementById(`sendMessage${this.clientId}`).addEventListener('click', () => this.sendMessage());
    document.getElementById(`close${this.clientId}`).addEventListener('click', () => this.close());
  }
  
  connect() {
    try {
      // Create SharedWorker with a name (demonstrates SharedWorkerGlobalScope.name)
      this.worker = new SharedWorker('worker.js', 'DemoSharedWorker');
      this.port = this.worker.port;
      
      this.port.onmessage = (e) => this.handleMessage(e.data);
      
      this.port.start();
      
      this.log('Connecting to SharedWorker...', 'info');
      this.enableButtons(true);
      document.getElementById(`connect${this.clientId}`).disabled = true;
    } catch (error) {
      this.log(`Error: ${error.message}`, 'error');
    }
  }
  
  getName() {
    this.port.postMessage({ type: 'getName' });
  }
  
  getConnections() {
    this.port.postMessage({ type: 'getConnections' });
  }
  
  sendMessage() {
    const message = `Hello from Client ${this.clientId} at ${new Date().toLocaleTimeString()}`;
    this.port.postMessage({ 
      type: 'sendMessage',
      message: message
    });
  }
  
  close() {
    this.port.postMessage({ type: 'close' });
    this.enableButtons(false);
    document.getElementById(`connect${this.clientId}`).disabled = false;
  }
  
  handleMessage(data) {
    switch(data.type) {
      case 'connected':
        this.log(`✓ ${data.message}`, 'success');
        this.log(`Worker Name: ${data.workerName}`, 'info');
        this.log(`Active Connections: ${data.connectionCount}`, 'info');
        break;
        
      case 'name':
        this.log(`SharedWorkerGlobalScope.name = "${data.name}"`, 'success');
        break;
        
      case 'connections':
        this.log(`Active connections: ${data.count}`, 'info');
        break;
        
      case 'broadcast':
        this.log(`📢 Message from Client ${data.from}: ${data.message}`, 'broadcast');
        this.log(`Total messages processed: ${data.totalMessages}`, 'info');
        break;
        
      case 'closed':
        this.log(data.message, 'info');
        break;
        
      case 'error':
        this.log(data.message, 'error');
        break;
    }
  }
  
  log(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    this.output.appendChild(entry);
    this.output.scrollTop = this.output.scrollHeight;
  }
  
  enableButtons(enabled) {
    document.getElementById(`getName${this.clientId}`).disabled = !enabled;
    document.getElementById(`getConnections${this.clientId}`).disabled = !enabled;
    document.getElementById(`sendMessage${this.clientId}`).disabled = !enabled;
    document.getElementById(`close${this.clientId}`).disabled = !enabled;
  }
}

// Initialize two clients
const client1 = new WorkerClient(1);
const client2 = new WorkerClient(2);

// Log instructions
console.log('SharedWorkerGlobalScope Example');
console.log('================================');
console.log('1. Click "Connect to SharedWorker" on both clients');
console.log('2. Try the different buttons to see SharedWorkerGlobalScope in action');
console.log('3. Open this page in another tab to see the shared state!');
