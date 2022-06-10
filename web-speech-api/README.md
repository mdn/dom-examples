# web-speech-api

Code for demos illustrating features of the Web Speech API. See [Web_Speech_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for more details.

> For the latest browser support, please have a look at the browser compatibility table here: [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility) and [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility).

## Speech color changer demo

[Run recognition demo live](https://mdn.github.io/dom-examples/web-speech-api/speech-color-changer/)

Tap the screen then say a colour — the grammar string contains a large number of HTML keywords to choose from, although we've removed most of the multiple word colors to remove ambiguity. We did keep goldenrod, cos, well.

This current works only on Chrome/Chrome Mobile. To get this code running successfully, you'll need to run the code through a web server (localhost will work.)

## Phrase matcher demo

Speak the phrase and then see if the recognition engine successfully recognises it — this is another demo that relies on speech recognition, written for a research team at the University of Nebraska at Kearney.

This current works only on Chrome/Chrome Mobile. To get this code running successfully, you'll need to run the code through a web server (localhost will work.)

[Run phrase matcher demo live](https://mdn.github.io/dom-examples/web-speech-api/phrase-matcher/)

## Speak easy synthesis demo

[Run synthesis demo live](https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/)

Type words in the input then submit the form to hear it spoken. You can also select the different voices available on the system, and alter the rate and pitch.

This currently works in Chrome, Firefox and Safari.
