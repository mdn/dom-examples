# simple service worker

Service Worker test repository. This is a simple demo showing basic service worker features. The demo can be seen on [our GitHub pages](https://mdn.github.io/dom-examples/service-worker/simple-service-worker/).

You can learn more about how this works by reading [using service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
In particular, read ["Why is my service worker failing to register?"](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Why_is_my_service_worker_failing_to_register)
if you are having problems getting your code to do anything. You need to change the paths relative to where you are serving your files!

## Running locally

To get this code running locally on your computer as-is, you need to do the following:

1. Ensure that you have Nodejs installed. The best way to do this is either using [`nvm`](https://github.com/nvm-sh/nvm) or [`nvm-windows`](https://github.com/coreybutler/nvm-windows).
2. Clone the repo in a location on your machine.
3. Start a local server in the root of this directory using [`lite-server`](https://www.npmjs.com/package/lite-server). `npx lite-server .`
4. When the server starts, the `index.html`` page will open in your default browser.
