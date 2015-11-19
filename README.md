# web-speech-api
A repository for demos illustrating features of the Web Speech API. See https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API for more details.

## Voice color changer demo

This demo works pretty nicely — you'll need a phone running Firefox OS 2.5+, and Firefox Nightly/Developer edition. Use WebIDE to install the app on your phone and give it a go. You tap the screen then say a colour — the grammar string contains a large number of HTML keywords to choose from, although we've removed most of the multiple word colours to remove ambiguity. We did keep goldenrod, cos, well.

## Current issues

1. The SpeechRecognition.continuous property is not currently implemented in Gecko. This work is ongoing.
2. The onnomatch handler does not yet work properly — the speech recognition system always returns a positive match, and then guesses at what item in the grammar it found. This is being worked on.
