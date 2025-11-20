const wsUri = "ws://127.0.0.1:8080/";
let websocket = null;
let pingInterval;
let counter = 0;

const logElement = document.querySelector("#log");
function log(text) {
	logElement.innerText = `${logElement.innerText}${text}\n`;
	logElement.scrollTop = logElement.scrollHeight;
}

// Open the websocket when the page is shown
window.addEventListener("pageshow", () => {
	log("OPENING");

	websocket = new WebSocket(wsUri);

	websocket.addEventListener("open", () => {
		log("CONNECTED");
		pingInterval = setInterval(() => {
			log(`SENT: ping: ${counter}`);
			websocket.send("ping");
		}, 1000);
	});

	websocket.addEventListener("close", () => {
		log("DISCONNECTED");
		clearInterval(pingInterval);
	});

	websocket.addEventListener("message", (e) => {
		log(`RECEIVED: ${e.data}: ${counter}`);
		counter++;
	});

	websocket.addEventListener("error", (e) => {
		log(`ERROR: ${e.data}`);
	});
});

// Close the websocket when the user leaves.
window.addEventListener("pagehide", () => {
	if (websocket) {
		log("CLOSING");
		websocket.close();
		websocket = null;
		window.clearInterval(pingInterval);
	}
});
