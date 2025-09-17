const colors = [
  "aqua",
  "azure",
  "bisque",
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
  "yellow",
];

const phraseData = [
  { phrase: "azure", boost: 10.0 },
  { phrase: "khaki", boost: 3.0 },
  { phrase: "tan", boost: 2.0 },
];

const phraseObjects = phraseData.map(
  (p) => new SpeechRecognitionPhrase(p.phrase, p.boost)
);

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.processLocally = true;
recognition.phrases = phraseObjects;

recognition.phrases.push(new SpeechRecognitionPhrase("thistle", 5.0));

const diagnostic = document.querySelector(".output");
const bg = document.querySelector("html");
const hints = document.querySelector(".hints");
const startBtn = document.querySelector("button");

let colorHTML = "";
colors.forEach(function (v, i, a) {
  console.log(v, i);
  colorHTML += `<span style="background-color: ${v};">${v}</span> `;
});
hints.innerHTML = `Press the button then say a color to change the background color of the app. For example, you could try ${colorHTML}`;

startBtn.addEventListener("click", () => {
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
