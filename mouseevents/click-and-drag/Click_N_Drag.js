
let physicists = ['Noether', 'Dirac', 'Bohr', 'Curie', 'Pauli'];

// yes, using globals is a bad idea, in general.  But in this case, there's only
// one mouse, so there'll never be two users of  these variables at once.
let arenaElement;
let physicistElements;
let slotElements;
let originalElement;
let targetSlot;

// the image of the physicist being dragged.  If ghostElement is falsy, we're not  dragging
let ghostElement;
let ghostUl;
let ghostOffsetX;
let ghostOffsetY;

// generate html based on physicists
function populatePhysicists() {
	physicistElements.forEach((physicist, ix) => {
		physicist.textContent = physicists[ix];
	});
}

// when you finally decide to move one, call this
function moveAPhysicist(physicistToMove, slotToMoveTo) {
	// moved to a neighboring slot - nothing to do
	if (slotToMoveTo == physicistToMove || slotToMoveTo == physicistToMove + 1) {
		return;
	}

	// change the backing store.
	if (slotToMoveTo < physicistToMove) {
		[physicist] = physicists.splice(physicistToMove, 1);
		physicists.splice(slotToMoveTo, 0, physicist);
	}
	else {
		[physicist] = physicists.splice(physicistToMove, 1);
		physicists.splice(slotToMoveTo - 1, 0, physicist);
	}

	//  now recreate the screen elements according to the backing store
	populatePhysicists();
}


//////////////////////////////  event handlers.

// is called continuously while dragging is going on, to make ghost move around
function setGhostLocation(ev) {
	ghostElement.style.left = `${ev.pageX - ghostOffsetX}px`;
	ghostElement.style.top = `${ev.pageY - ghostOffsetY}px`;

	// no text selections!  we need this for all the events
	ev.stopPropagation();
	ev.preventDefault();
}

// as soon as the mouse clicks down over a physicist, everything changes
function mouseDownHandler(ev) {
	// must be left mouse button
	if (!(ev.buttons & 1)) {
		return;
	}

	// clone the physicist element, for the user to drag around.
	// Don't use the original, keep the existing layout.
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

function mouseMoveHandler(ev) {
	// Move the ghost as the user is dragging around, anywhere. If you don't
	// check ghostElement, a user could start this by dragging into a physicist
	// instead of clicking down. If you don't check ev.buttons, you could be
	// confused by a mouseUp outside the window.
	if (ghostElement && (ev.buttons & 1)) {
		setGhostLocation(ev);
	}
}

// after user lets go, or drags too far out, clean up the DOM
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

// as user drags the ghost onto a target slot
function enterSlotHandler(ev) {
	if (ghostElement) {
		targetSlot = ev.target;
		targetSlot.classList.add('targeted');
	}
}

function leaveSlotHandler(ev) {
	if (targetSlot && ghostElement) {
		targetSlot.classList.remove('targeted');
		targetSlot = null;
	}
}

//////////////////////////////  set event handlers.

// set ALL the event handlers
document.addEventListener('DOMContentLoaded', ev => {
	arenaElement = document.querySelector('main');
	arenaUl = arenaElement.querySelector('ul')
	slotElements = arenaUl.querySelectorAll('.slot');

	// The physicists need mousedown for the clickdown
	physicistElements = arenaUl.querySelectorAll('.physicist');
	physicistElements.forEach(physicist => {
		physicist.addEventListener('mousedown', mouseDownHandler);
	});
	populatePhysicists();

	// the slots need to hilite when dragged over, indicating that the user can drop.
	// and then, unhilte when the user drags out
	slotElements.forEach(slot => {
		slot.addEventListener('mouseenter', enterSlotHandler);
		slot.addEventListener('mouseleave', leaveSlotHandler);
	});

	// the user can move the mouse ANYWHERE.  Here we listen through the arena.
	arenaElement.addEventListener('mousemove', mouseMoveHandler);
	arenaElement.addEventListener('mouseup', mouseUpHandler);
	arenaElement.addEventListener('mouseleave', mouseUpHandler);

	// an alternative is to add listeners in your mouseDown handler,
	// and remove them in your mouseUp handler.
	// This is better if you have multiple places that do a click n drag.

	// A more modern way is to use setPointerCapture(). This will corral your
	// mouse events  so they arrive in your original click-down element.
	// In mouseDownHandler():
	// originalElement.setPointerCapture(ev.mouseId);

});


