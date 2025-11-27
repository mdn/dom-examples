# MDN WebGL examples

This folder is home to examples for the MDN Web Docs content about
the [WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API),
which is used for 2D and 3D graphics on the web.

Specifically, each of these examples pairs with an article in the MDN
[WebGL tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial).

## The examples

- [Sample 1](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample1/)
- [Sample 2](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample2/)
- [Sample 3](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample3/)
- [Sample 4](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample4/)
- [Sample 5](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample5/)
- [Sample 6](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample6/)
- [Sample 7](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample7/)
- [Sample 8](https://mdn.github.io/dom-examples/webgl-examples/tutorial/sample8/)

### Additional example

- [Tetrahedron](https://mdn.github.io/dom-examples/webgl-examples/tutorial/tetrahedron/)

## Installing and testing

If you choose to fork or clone these examples to experiment with them, be aware that you can't just use these samples from a file:/// URL. If you try, you receive a warning in your developer tools, which in Microsoft Edge reads as
> index.html:1 Access to script at 'file:///...sample1/webgl-demo.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome-extension, chrome-untrusted, data, edge, http, https, isolated-app.
> 
> webgl-demo.js:1 Failed to load resource: net::ERR_FAILED.

The other browsers issue a similar warning, hinting at a blocking by CORS policy.

To remedy this trouble, you can use your development Web server (if you have one), or even publish the samples to a secure server online (always use only secure servers when working online). Alternatively, if you have Nodejs installed, you can also look at https-localhost.

Any way, these samples can be successfully tested with a local http server, and you do not even need an https server to run these examples. See our article <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server#the_problem_with_testing_local_files">How do you set up a local testing server</a>. The relevant item (**They [samples] include other files**) can be found in the section **The problem with testing local files**. One more piece of advice is to bind your server to localhost, and your firewall will be happy without explicitly allowed access with inbound rules.

You may also receive a warning
> :8000/favicon.ico:1 Failed to load resource: the server responded with a status of 404 (File not found)

which in the days of yore resulted in the head-of-line blocking. You can ignore this warning or you can add a favicon.ico file to the folder.

Only sample 8 may behave not up to expectations: it would not show any texture on the cube surface. The reason can be gleaned from the console of browser's developer tools, which in Microsoft Edge reads in this case:
> webgl-demo.js:276 Uncaught (in promise) NotAllowedError: play() can only be initiated by a user gesture.

The other browsers can issue a similar warning.

When using the Microsoft Edge, you can solve this problem by navigating to edge://settings/privacy/sitePermissions/allPermissions/mediaAutoplay and allowing Media Autoplay for the site 127.0.0.1, if you are using http server with localhost binding. For the other browsers and web servers, see relevant documentation.
