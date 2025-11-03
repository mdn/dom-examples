# IntersectionObserver API Demo

The **IntersectionObserver API** provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with the viewport. This is a powerful and performant alternative to scroll event listeners.

## What This Demo Shows

This example demonstrates two primary use cases of the IntersectionObserver API:

1. **Visibility Detection & Animations**: Target boxes that automatically animate when they scroll into view, with fade-in and slide-up effects.

2. **Lazy Loading Images**: Images that only load when the user scrolls them into the viewport, improving initial page load performance and saving bandwidth.

3. **Real-time Statistics**: A stats panel that tracks intersection events and displays the number of visible elements.

## Key Features

- **Performance**: Unlike scroll event listeners, IntersectionObserver is optimized by the browser and doesn't block the main thread
- **Flexible Thresholds**: Configure when callbacks trigger based on element visibility percentage
- **Root Margin**: Preload content before it enters the viewport
- **Clean API**: Simple observe/unobserve pattern for managing element tracking

## How It Works

The demo creates two separate IntersectionObserver instances:

1. **Box Observer**: Watches animated boxes with a 10% visibility threshold
2. **Image Observer**: Handles lazy loading with a 50% threshold and 50px root margin for preloading

Each observer uses a callback function that receives intersection entries, allowing you to respond to visibility changes efficiently.

## Browser Support

IntersectionObserver is supported in all modern browsers. For older browser support, consider using the [official polyfill](https://github.com/w3c/IntersectionObserver).

## Common Use Cases

- Lazy loading images and content
- Infinite scrolling implementations
- Tracking advertisement visibility
- Triggering animations on scroll
- Deferring video autoplay until visible
- Analytics and user engagement tracking

[See the demo live](https://mdn.github.io/dom-examples/intersection-observer-basic/).
