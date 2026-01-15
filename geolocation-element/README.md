# MDN `<geolocation>` element examples

This set of examples demonstrates usage of the [`<geolocation>` element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/geolocation) (also see the [specification](https://wicg.github.io/PEPC/permission-elements.html#geolocation-element)).

- [Basic `<geolocation>` example](basic-example/): Basic usage of the element to return geo data, with Geolocation API fallback.
- [Basic `<geolocation>` watch example](basic-watch-example/): Basic usage of the element to return geo data, with Geolocation API fallback, which continuously returns data each time the user's position changes.
- [Embedded map example](embedded-map/): Uses `<geolocation>` to return geo data, which is then used to plot the user's location on a map generated using [Leaflet JS](https://leafletjs.com/).
- [Exploring invalid reasons](exploring-invalid-reasons/): Provides a control to apply different styles to a `<geolocation>` element that make it invalid, and reports the `invalidReason` for each one.
- [Initial permission status example](initial-permission-status/): Shows how to use the `initialPermissionStatus` property to provide appropriate instructions to the user based on the `geolocation` permission on page load.
