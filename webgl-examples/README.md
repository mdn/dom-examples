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

If you choose to fork or clone these examples to experiment with them,
be aware that WebGL requires that any textures or other binary data
be loaded from a secure context, which means you can't just use most
of these samples from a `file:///` URL. Instead, you need to run a
local web server, or post them to a secure server online.

See our article [How do you set up a local testing server?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) if you need help getting one set up. Alternatively, if you have [Nodejs](https://github.com/nvm-sh/nvm) installed, you can also look at [`https-localhost`](https://www.npmjs.com/package/https-localhost).
