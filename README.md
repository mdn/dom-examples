# web-speech-api
A repository for demos illustrating features of the Web Speech API. See [Web_Speech_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for more details.

## Speech color changer demo

This demo works pretty nicely — you'll need a phone running Firefox OS 2.5+, and Firefox Nightly/Developer edition. Use WebIDE to install the app on your phone and give it a go. You tap the screen then say a colour — the grammar string contains a large number of HTML keywords to choose from, although we've removed most of the multiple word colours to remove ambiguity. We did keep goldenrod, cos, well.

Note that [permissions are required](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#Firefox_OS_permissions) to use speech recognition.

## Speak easy synthesis demo

This demo works even better — speech synthesis needs no permissions to work on Desktop Firefox and Firefox OS. In this demo you can choose a voice from the available synthesis voices on your device. You can then enter a phrase you want to hear spoken in the text box, and press return to hear it.

## Current issues

1. The [SpeechRecognition.continuous](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/continuous) property is not currently implemented in Gecko. This work is ongoing.
2. The [onnomatch handler](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/onnomatch) does not yet work properly — the speech recognition system always returns a positive match, and then guesses at what item in the grammar it found. This is being worked on.
