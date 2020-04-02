#Web animations API demos

Some simple demos to show Web Animations API features.

## Implicit to/from keyframes
That is, when you write an animation, you can leave out the end state of the animation from the keyframes, and the browser will infer it, if it can. For example:

```
let rotate360 = [
  { transform: 'rotate(360deg)' }
];
``` 

[See the demo live](https://mdn.github.io/dom-examples/web-animations-api/implicit-keyframes.html). 


