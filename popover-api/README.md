# MDN Popover API examples

This set of examples demonstrates usage of the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (also see the [specification](https://html.spec.whatwg.org/multipage/popover.html)).

- [Basic declarative popover example](basic-declarative/): Demonstrates a basic auto state popover.
- [Blur background popover example](blur-background/): Shows how you can add styling to the content behind the popover using the `::backdrop` pseudo-element.
- [Multiple auto popovers example](multiple-auto/): Demonstrates that, generally, only one auto popover can be displayed at once.
- [Multiple manual popovers example](multiple-manual/): Demonstrates that multiple manual popovers can be displayed at once, bt they can't be light-dismissed.
- [Nested popover menu example](nested-popovers/): Demonstrates the behavior of nested auto state popovers.
- [popover="hint" example](popover-hint/): This example shows how to use the `popover="hint"` value to create tooltip popovers that show on button mouseover and focus, without dismissing the `auto` popovers shown when the buttons are clicked on. The `hint` popovers are controlled via JavaScript.
- [Popover positioning example](popover-positioning/): An isolated example showing CSS overriding of the default popover positioning specified by the UA sylesheet.
- [Toggle help UI example](toggle-help-ui/): Shows the basics of using JavaScript to control popover showing and hiding.
- [Toast popovers example](toast-popovers/): Illustrates how to make a simple system of "toast" notifications with popovers, which automatically hide again after a certain time.
