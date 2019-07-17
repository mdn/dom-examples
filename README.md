# sw-test

Service Worker test repository. This is a very simple demo to show basic service worker features in action. The demo can be seen on [our GitHub pages](https://mdn.github.io/sw-test/).

You can find a lot more out about how this works by reading [Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
In particular, read [Why is my service worker failing to register?](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Why_is_my_service_worker_failing_to_register)
if you are having problems getting your code to do anything. You need to change the paths relative to where you are serving your files from!

# Running locally

To get this code. running locally on your computer as-is, you need to do the following:

1. Clone the repo in a location on your machine.
2. Start a local server running in the parent directory of the sw-test directory. For example, if you have Python on your machine you could start a server running on port 8001 using `python -m SimpleHTTPServer 8001` for Python 2.x, or `python3 -m http.server 8001` for Python 3.x.
3. Navigate to the sw-test directory on the local server, e.g. [http://localhost:8001/sw-test/](http://localhost:8001/sw-test/)

Note: The example has to be located under the sw-test directory (e.g. http://localhost:8001/sw-test/) and not at the root of the server (e.g. http://localhost:8001/) or anywhere else, for the service worker to work. It expects the document and associated assets it is controlling to be at this location.
