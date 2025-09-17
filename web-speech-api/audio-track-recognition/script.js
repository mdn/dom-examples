const recognition = new SpeechRecognition();
recognition.lang = "en-US";

const startBtn = document.querySelector("button");
const diagnostic = document.querySelector(".output");

startBtn.addEventListener("click", () => {
  diagnostic.textContent = "";
  console.log("Loading audio track");
  const audioElement = new Audio("cheese-on-toast.mp3");
  audioElement.addEventListener("canplay", () => {
    const stream = audioElement.captureStream();
    const audioTrack = stream.getAudioTracks()[0];
    audioElement.play();
    recognition.start(audioTrack);
    console.log("Recognition started");
  });
});

recognition.addEventListener("result", (event) => {
  const speech = event.results[0][0].transcript;
  diagnostic.textContent = "Speech recognized: " + speech + ".";
  console.log("Confidence: " + event.results[0][0].confidence);
});

recognition.addEventListener("speechend", () => {
  console.log("Speech ended");
  recognition.stop();
});
