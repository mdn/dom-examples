# Web animations API demos

Some simple demos to show Web Animations API features.

## Implicit to/from keyframes
That is, when you write an animation, you can leave out the end state of the animation from the keyframes, and the browser will infer it, if it can. For example:

```
let rotate360 = [
  { transform: 'rotate(360deg)' }
];
``` 

[See the demo live](https://mdn.github.io/dom-examples/web-animations-api/implicit-keyframes.html). 


## Automatically removing filling animations
It is possible to trigger a large number of animations on the same element. If they are indefinite (i.e., forwards-filling), this can result in a huge animations list, which could create a memory leak. For this reason, we’ve implemented the part of the Web Animations spec that automatically removes overriding forward filling animations, unless the developer explicitly specifies to keep them.

[See a live demo of this](https://mdn.github.io/dom-examples/web-animations-api/replace-indefinite-animations.html). 

The related JavaScript features are as follows:

* `animation.commitStyles()` — run this method to commit the end styling state of an animation to the element being animated, even after that animation has been removed. It will cause the end styling state to be written to the element being animated, in the form of properties inside a style attribute.
* `animation.onremove` — allows you to run an event handler that fires when the animation is removed (i.e., put into an active replace state).
* `animation.persist()` — when you explicitly want animations to be retained, then invoke persist().
* `animation.replaceState` — returns the replace state of the animation. This will be active if the animation has been removed, or persisted if persist() has been invoked.
