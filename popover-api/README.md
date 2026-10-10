# MDN Popover API examples

This set of examples demonstrates usage of the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) (also see the [specification](https://html.spec.whatwg.org/multipage/popover.html)).

- [Basic declarative popover example](basic-declarative/): Demonstrates a basic auto state popover.
- [Blur background popover example](blur-background/): Shows how you can add styling to the content behind the popover using the `::backdrop` pseudo-element.
- [Multiple auto popovers example](multiple-auto/): Demonstrates that, generally, only one auto popover can be displayed at once.
- [Multiple manual popovers example](multiple-manual/): Demonstrates that multiple manual popovers can be displayed at once, but they can't be light-dismissed.
- [Nested popover menu example](nested-popovers/): Demonstrates the behavior of nested auto state popovers.
- [popover="hint" example](popover-hint/): This example shows how to use the `popover="hint"` value to create tooltip popovers that show on button mouseover and focus, without dismissing the `auto` popovers shown when the buttons are clicked on. The `hint` popovers are controlled via JavaScript.
- [Popover positioning example](popover-positioning/): An isolated example showing CSS overriding of the default popover positioning specified by the UA sylesheet.
- [Toggle help UI example](toggle-help-ui/): Shows the basics of using JavaScript to control popover showing and hiding.
- [Toast popovers example](toast-popovers/): Illustrates how to make a simple system of "toast" notifications with popovers, which automatically hide again after a certain time.

## Accessibility notes

These examples show how the Popover API behaves; they are not complete accessible components. In particular:

- The [blur background example](blur-background/) only adds a visual effect with `::backdrop`. The popover is still non-modal, so the content behind it is not made inert and remains focusable and available to assistive technology. If the rest of the page should be inert, use a modal [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) opened with `showModal()` instead.
- The [nested popover menu example](nested-popovers/) is a set of nested lists of links, not an ARIA [`menu`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menu_role); it does not provide menu roles or menu keyboard handling.
- The [toast popovers example](toast-popovers/) does not use an [ARIA live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions), so screen readers are not guaranteed to announce new toasts.

See [Popover accessibility features](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#popover_accessibility_features) for what the API does provide.
