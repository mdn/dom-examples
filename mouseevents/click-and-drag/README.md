# Click N Drag
This example illustrates how to do interactive click-and-drag of objects in HTML.
WITHOUT having to use the drag&drop API.

<iframe src=Click_N_Drag.html
	style='width: 700px; height: 550px; border: 1px solid black; overflow: hidden; ' >
</iframe>

So, normally, the user can move the mouse around without clicking and no physicists are disturbed.
The user expects to click down on a physicist, drag it to some kind of destination, and let go.
The user might also want to cancel the operation after clicking down,
so most of the surface should NOT be a place that's an active slot.

(Don't figure out what was clicked by doing arithmetic with coordinates.
Even if you have little tiny things you think will be slow.
Elements aready do that for you, and you get click down/up/move events dispatched to the element.)

First, decide upon what elements do what.
You'll have one or more objects that the user can drag around (physicists in this example)
and one or more slot targets that the user can drag them into.

Your objects need  a mousedown handler, cuz the user will be clicking down on them.
```
	physicistElements.forEach(physicist => {
		physicist.addEventListener('mousedown', mouseDownHandler);
	});
```

The mousedown handler sets everything up for dragging.
The original clickdown physicist is kept around,
but we make a clone of it for the ghost - the image of what the user thinks they're dragging.
```
let arenaElement;
let physicistElements;
let slotElements;
let originalElement;
let targetSlot;

function mouseDownHandler(ev) {
	originalElement = ev.target;
	ghostElement = originalElement.cloneNode(true);
	ghostElement.classList.add('ghost')
	arenaUl.append(ghostElement);
	originalElement.classList.add('original');

	arenaElement.style.cursor = 'grabbing';

	// we need the clickdown location, relative to the upper left corner of the physicist's margin
	ghostOffsetX = ev.offsetX + 13;
	ghostOffsetY = ev.offsetY + 13;

	setGhostLocation(ev);
}
```

So all the mouse events have a few things in common:
they all contain the coordinates of the mouse,
and you have to move the ghost to match.
So this does stuff that all the mouse handlers need to do.
```
let ghostElement;
let ghostUl;
let ghostOffsetX;
let ghostOffsetY;

function setGhostLocation(ev) {
	ghostElement.style.left = `${ev.pageX - ghostOffsetX}px`;
	ghostElement.style.top = `${ev.pageY - ghostOffsetY}px`;

	// no text selections!  we need this for all the events
	ev.stopPropagation();
	ev.preventDefault();
}
```

The browser will send mouse move events, always, as long as the handler's set up and all.
Even if the mouse isn't down.  Even if the browser window isn't in front.
Mouse move events might come in a hundred per second, or even faster.
But, it's highly variable.
Conditions might include, how much work your handler does,
or how much overhead you have elsewhere on your page or your computer.
Or, what model of computer you have, as machines get faster over the years.
Never measure anything by the number of mouse move events, or their frequency --
only by the linear distance as given by the x and y coordinates.
Or, possibly, by timestamps from the events.
```
function mouseMoveHandler(ev) {
	if (ghostElement && (ev.buttons & 1)) {
		setGhostLocation(ev);
	}
}
```

Eventually, the drag must come to an end.
Typically, the user just lets go on the mouse.
But, if the user drags it out of the arena, you won't get the mouseup event,
the new mouse location will get the mouseup.
(And it probably will get ignored.)
So this is also the mouseleave handler.
You have to make sure that drag mode ends before the mouse slips away,
and all the things that were set in the mouseDown handler get closed or reset.
Also, get rid of the ghost element to indicate you're not in the middle of a drag.
```
function mouseUpHandler(ev) {
	// ev.buttons has already been set to zero
	if (ghostElement) {
		setGhostLocation(ev);

		// do we do it?  Only if they've been dragging over a slot
		if (targetSlot) {
			moveAPhysicist(originalElement.dataset.physicist, targetSlot.dataset.slot)
		}

		// remove any slot hiliting, like user dragged out of it
		leaveSlotHandler(ev);

		originalElement.classList.remove('original');

		arenaElement.style.cursor = '';

		ghostElement.remove();
		ghostElement = null;
	}
}
```


#### Alternatives

You can do exactly the same things with PointerEvents as with MouseEvents.
Simply global replace `mouse` with `pointer`.
They work exactly the same, although pointer events have more features.

Instead of having move and up listeners in the arena set all the time,
you can add them in the mousedown handler, and then remove them in the mouseup handler.

Instead of putting mousemove and mouseup handlers on the page body,
you can use `setPointerCapture()` to funnel all the move and other mouse events to the original element.
You need to supply the pointer ID which is only available on pointer events,
so you have to switch to pointer event handling.
Then you can add pointermove and pointerup handlers to the original clickdown object.
Capture mode ends by itself when the user releases.


