# auxclick demo

The <code>onauxclick</code> property is an event handler called when an <code>auxclick</code> event is sent, indicating that a non-primary button has been pressed on an input device (e.g. a middle mouse button).

This property is implemented as part of a plan to improve compatibility between browsers with regards to button behaviours — event behaviour is being updated so that <code>click</code> only fires for primary button clicks (e.g. left mouse button). Developers can then use <code>auxclick</code> to provide explicit behaviour for non-primary button clicks.

Previous to this, <code>click</code> generally fired for clicks on all input device buttons, and browser behaviour was somewhat inconsistent.

[See the demo live](https://mdn.github.io/dom-examples/auxclick/). <code>auxclick</code> is currently supported in Firefox 53+, with Chrome soon to follow. 
