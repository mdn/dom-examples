const video = document.querySelector("video");

const assetURL = "frag_bunny.mp4";
// Need to be specific for Blink regarding codecs
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

function loadVideo() {
  if (MediaSource.isTypeSupported(mimeCodec)) {
    const mediaSource = new MediaSource();
    console.log(mediaSource.readyState); // closed
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener("sourceopen", sourceOpen);
  } else {
    console.error("Unsupported MIME type or codec: ", mimeCodec);
  }
}

async function sourceOpen() {
  console.log(this.readyState); // open
  const mediaSource = this;
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  const response = await fetch(assetURL);
  const buffer = await response.arrayBuffer();
  sourceBuffer.addEventListener("updateend", () => {
    mediaSource.endOfStream();
    video.play();
    console.log(mediaSource.readyState); // ended
  });
  sourceBuffer.appendBuffer(buffer);
}

const load = document.querySelector("#load");
load.addEventListener("click", loadVideo);
