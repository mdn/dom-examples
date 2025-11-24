const wsUri = "ws://127.0.0.1/";
let websocket = null;
let pingInterval;
let counter = 0;

const logElement = document.querySelector("#log");
function log(text) {
	logElement.innerText = `${logElement.innerText}${text}\n`;
	logElement.scrollTop = logElement.scrollHeight;
}

function initializeWebSocketListeners(ws) {
	ws.addEventListener("open", () => {
		log("CONNECTED");
		pingInterval = setInterval(() => {
			log(`SENT: ping: ${counter}`);
			ws.send("ping");
		}, 1000);
	});

	ws.addEventListener("close", () => {
		log("DISCONNECTED");
		clearInterval(pingInterval);
	});

	ws.addEventListener("message", (e) => {
		log(`RECEIVED: ${e.data}: ${counter}`);
		counter++;
	});

	ws.addEventListener("error", (e) => {
		log(`ERROR`);
	});
}

window.addEventListener("pageshow", (event) => {
	if (event.persisted) {
		websocket = new WebSocket(wsUri);
		initializeWebSocketListeners(websocket);
	}
});

log("OPENING");
websocket = new WebSocket(wsUri);
initializeWebSocketListeners(websocket);

// Close the websocket when the user leaves.
window.addEventListener("pagehide", () => {
	if (websocket) {
		log("CLOSING");
		websocket.close();
		websocket = null;
		window.clearInterval(pingInterval);
	}
});
