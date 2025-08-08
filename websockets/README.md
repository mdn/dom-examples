# README

This directory contains a minimal example [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) client and server.

When the page is loaded, it creates a WebSocket connection to the server, then then sends a ping every second. The server listens for the ping and and a response. The client listens for the responses and logs them.

The client starts the connection on the [`pageshow`](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event) event and closes it on [`pagehide`](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event): this allows browser to keep the page in the [bfcache](https://developer.mozilla.org/en-US/docs/Glossary/bfcache), which improves page load if the user navogates back to it.

## Running the example

The server-side is written in [Deno](https://deno.com/) so Deno needs to be installed first. Then, with Deno in your path, you can start the server with a command like:

```bash
deno run --allow-net=0.0.0.0:80 --allow-read=./index.html,./client.js,client.css main.js
```

You can then navigate to http://localhost:80/ and you should see the application running.
