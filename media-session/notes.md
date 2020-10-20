Exposes metadata about currently available media within web pages and apps.

Allows playing, pausing, seeking (via the scrubber), & skipping tracks.

There are lots of different integrated OS level UIs for media control. Think audio controls on a smart watch, or picture-in-picture controls on a desktop. Even hardware buttons, like play and pause keys on a laptop...

This API looks to provide consistant data for media, so 

<!-- This is taken directly from Francios -->
Examples: A user pressing the next track button on keyboard, a user seeking back 30 secs whilst listening to a podcast or using a media hub to control media playing in browser tabs.

There are two interfaces. Metadata to specify info about media and mediasession which is the controls.

Let's take a moment clarify the terms for controlling media.

Note the difference between seeking and skipping. Seeking is finding a specific point in a track or video, whereas skipping is moving track, either to the one before or after in the playlist.

It's up to the UA to provide the interface, however we can use these interfaces to enhance that experience.

When a website plays audio chrome gives notifications (how does firefox handle this?)

There's only one metadata 'slot' so only one piece of media can be shown at anytime, or added to the interface. Let's make a data object with all the metadata we will need for our playlist.

For the purposes of the code demo I'm using one large and one small image, however you can add in as many sizes as you want. The data also allows for blob & data urls.

You must use the same context - so if something is playing in an iframe it's metadata must be set in the code used in teh iframe.

When playback ends any media notifications will be removed from the interface. Remember there is one slot, so if the next media in a playlist starts the metadata will need to reflect that new data.

- update metadata function?

## Media Session Actions

A media session action is much like an event. They include interactions such as 'play' and 'pause' and are implemented by setting handlers on appropriate objects.

Use a try catch when setting actions as some may not be supported.

- take through each action

Media action controls won't be shown unless the proper handler is set.

## Play and Pause

Automatically handled by browser. Can be over-ridden. Need to update playback state if we do.
