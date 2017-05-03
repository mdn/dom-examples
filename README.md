# web-speech-api
A repository for demos illustrating features of the Web Speech API. See [Web_Speech_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for more details.

## Speech color changer demo
[Run recognition demo live](http://mdn.github.io/web-speech-api/speech-color-changer/)

This demo works pretty nicely — you'll need a phone running Firefox OS 2.5+, and Firefox Nightly/Developer edition, or Chrome/Chrome Mobile. Use WebIDE to install the app on your phone and give it a go. You tap the screen then say a colour — the grammar string contains a large number of HTML keywords to choose from, although we've removed most of the multiple word colours to remove ambiguity. We did keep goldenrod, cos, well.

Note that [permissions are required](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#Firefox_OS_permissions) to use speech recognition on Firefox OS.

Note also that to get this code running successfully on Chrome/Chrome mobile, you'll need to run the code through a web server (localhost will work.)

## Phrase matcher demo
The same comments as above apply to this demo too — this is another demo that relies on speech recognition, written for a research team at the University of Nebraska at Kearney.

[Run phrase matcher demo live](http://mdn.github.io/web-speech-api/phrase-matcher/)

## Speak easy synthesis demo
[Run synthesis demo live](http://mdn.github.io/web-speech-api/speak-easy-synthesis/)

This demo works even better — speech synthesis needs no permissions to work on Desktop Firefox or Firefox OS. In this demo you can choose a voice from the available synthesis voices on your device. You can then enter a phrase you want to hear spoken in the text box, and press return to hear it.

## Current issues + gotchas

1. The [SpeechRecognition.continuous](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/continuous) property is not currently implemented in Firefox. This work is ongoing.
2. The [onnomatch handler](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/onnomatch) does not yet work properly in Firefox — the speech recognition system always returns a positive match, and then guesses at what item in the grammar it found. This will be worked on at some point soon hopefully.
