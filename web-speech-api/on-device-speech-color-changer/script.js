const colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral",
  "cornflowerblue",
  "crimson",
  "cyan",
  "deepskyblue",
  "fuchsia",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "hotpink",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lightseagreen",
  "lime",
  "linen",
  "magenta",
  "maroon",
  "moccasin",
  "navy",
  "olive",
  "orange",
  "orchid",
  "peru",
  "pink",
  "plum",
  "purple",
  "rebeccapurple",
  "red",
  "salmon",
  "sienna",
  "silver",
  "snow",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "white",
  "yellow",
];

const recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  const speechRecognitionList = new SpeechGrammarList();
  const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
    " | "
  )};`;
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
// New processLocally property
recognition.processLocally = true;

const diagnostic = document.querySelector(".output");
const bg = document.querySelector("html");
const hints = document.querySelector(".hints");

let colorHTML = "";
colors.forEach(function (v, i, a) {
  console.log(v, i);
  colorHTML += `<span style="background-color: ${v};">${v}</span> `;
});
hints.innerHTML = `Tap/click then say a color to change the background color of the app. Try ${colorHTML}`;

document.body.addEventListener("click", () => {
  // check availability of target language
  SpeechRecognition.available({ langs: ["en-US"], processLocally: true }).then(
    (result) => {
      if (result === "unavailable") {
        diagnostic.textContent = `en-US not available to download at this time. Sorry!`;
      } else if (result === "available") {
        recognition.start();
        console.log("Ready to receive a color command.");
      } else {
        diagnostic.textContent = `en-US language pack downloading`;
        SpeechRecognition.install({
          langs: ["en-US"],
          processLocally: true,
        }).then((result) => {
          if (result) {
            diagnostic.textContent = `en-US language pack downloaded. Try again.`;
          } else {
            diagnostic.textContent = `en-US language pack failed to download. Try again later.`;
          }
        });
      }
    }
  );
});

recognition.addEventListener("result", (event) => {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  let color = event.results[0][0].transcript;
  // Remove whitespace from recognized speech
  color = color.replace(/\s+/g, "");
  diagnostic.textContent = `Result received: ${color}.`;
  bg.style.backgroundColor = color;
  console.log(`Confidence: ${event.results[0][0].confidence}`);
});

recognition.addEventListener("speechend", () => {
  recognition.stop();
});

recognition.addEventListener("nomatch", (event) => {
  diagnostic.textContent = "I didn't recognise that color.";
});

recognition.addEventListener("error", (event) => {
  diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
});
