# MDN View Transition API examples

This set of examples demonstrates usage of the [View Transition API](https://developer.mozilla.org/docs/Web/API/View_Transition_API) (also see the [specification](https://drafts.csswg.org/css-view-transitions-2/)).

## Basic examples

- [SPA example](spa/): Demonstrates basic view transition usage in a SPA image gallery.
- [MPA example](mpa/): Demonstrates basic view transition usage in MPA.
- [MPA homepage example](mpa-homepage/): Another MPA view transitions example.
- [MPA homepage example](match-element/): Demonstrates usage of the `match-element` value of the `view-transition-name` property

## View transition types examples

- [SPA transition types gallery](spa-gallery-transition-types/): SPA image gallery that uses transition types to apply different transition animations when the images are moved between using the prev button, next button, and by clicking directly on an image.
- [MPA transition types example](mpa-chapter-nav-transition-types/): Story app with a chapter on each page. Demonstrates how to apply view transition animations across pages selectively with a transition type applied using the `@view-transition` at-rule.
- [MPA multiple transition types example](mpa-chapter-nav-multiple-transition-types/): Story app with a chapter on each page. Demonstrates how to apply different view transition animations across pages selectively with different transition types. The transition type is determined on the fly with JavaScript during the navigation.
