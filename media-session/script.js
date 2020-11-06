console.clear();

// set up a faux status - to mimic what a UA would implement
const statusEl = document.querySelector('#status');

function updateStatus(track, playState = 'Stopped') {
  // update header
  statusEl.querySelector('h3').innerText = playState;

  // update track info
  const info = statusEl.querySelectorAll('dd');
  info[0].innerText = track.title;
  info[1].innerText = track.artist;
  info[2].innerText = track.album;

  //update image
  statusEl.querySelector('img').src = track.artwork[1].src;

}

// specify our data for our three tracks
// NB we include src, which isn't part of the metadata interface, so we can load the requested file
const allMeta = [
  {
    src: 'tracks/secret.mp3',
    title: 'Secret Garden',
    artist: 'Eugenio Mininni',
    album: 'Mellow',
    artwork: [
      { src: 'tracks/secret96.jpg',   sizes: '96x96',   type: 'image/jpeg' },
      { src: 'tracks/secret512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ]
  },

  {
    src: 'tracks/alignment.mp3',
    title: 'Alignment',
    artist: 'Arulo',
    album: 'Atmospheres',
    artwork: [
      { src: 'tracks/align96.jpg',   sizes: '96x96',   type: 'image/jpeg' },
      { src: 'tracks/align512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ]
  },

  {
    src: 'tracks/okay.mp3',
    title: "We'll Be Okay",
    artist: 'Michael Ramir C',
    album: 'Dramatic',
    artwork: [
      { src: 'tracks/okay96.jpg',   sizes: '96x96',   type: 'image/jpeg' },
      { src: 'tracks/okay512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ]
  }
]
// all tracks sourced from https://mixkit.co for use under creative commons license

let isSupported = false;
// check for compatibility & set the first track metatdata
if ("mediaSession" in navigator) {
  isSupported = true;
  navigator.mediaSession.metadata = new MediaMetadata(allMeta[0]);
} else {
  updateStatus(allMeta[index], 'Media Session is not supported ☹️')
}

// grab our audio element
const audioEl = document.querySelector('audio');
// set first track index
let index = 0;

// function for updating metadata on track change (see actions below)
function updateMetaData() {
  const track = allMeta[index];

  navigator.mediaSession.metadata = new MediaMetadata(track)

  updatePositionState();
}

// function to update position state, used when meta data is updated and seeking is actioned (see below)
function updatePositionState() {
  navigator.mediaSession.setPositionState({
    duration: audioEl.duration,
    playbackRate: audioEl.playbackRate,
    position: audioEl.currentTime
  });
}

// create a generic play audio function which also updates which track we are playing
function playAudio() {
  audioEl.src = allMeta[index].src;
  audioEl.play()
    .then(_ => updateMetaData())
    .catch(error => console.log(error));
}

// let's declare all actions handlers in an array and we'll loop through them with a try ... catch below
// NB play/pause should be active by default, however other actions need to be set
// set a skip time (seconds) for seeking back/forward
const defaultSkipTime = 10;
const actionHandlers = [
  // play
  [
    'play',
    async function() {
      // play our audio
      await audioEl.play();
      // set playback state
      navigator.mediaSession.playbackState = "playing";
      // update our status element
      updateStatus(allMeta[index], 'Action: play  |  Track is playing...')
    }
  ],
  [
    'pause',
    () => {
      // pause out audio
      audioEl.pause();
      // set playback state
      navigator.mediaSession.playbackState = "paused";
      // update our status element
      updateStatus(allMeta[index], 'Action: pause  |  Track has been paused...');
    }
  ],
  [
    'previoustrack',
    () => {
      // if it's the first track start from the beginning of the track (there is no previous)
      let statusMess = 'Previous track is now playing...';
      if (index === 0) {
        statusMess = 'No previous track, first track is now playing...';
      } else {
        index = index - 1;
      }
      // play
      playAudio();
      // update our status element
      updateStatus(allMeta[index], 'Action: previoustrack  |  '+statusMess);
    }
  ],
  ['nexttrack',
    () => {
      // if it's the last track seek to the end of the track
      let statusMess = 'Next track is now playing...'
      if (index === (allMeta.length-1)) {
        statusMess = 'No next track, playlist finished...';
        // empty metadata
        navigator.mediaSession.metadata = null;
        audioEl.pause();
        index = 0;
      } else {
        index = index + 1;
        // play
        playAudio();
        updateStatus(allMeta[index], 'Action: nexttrack  |  '+statusMess);
      }
      // update our status element
      
    }
  ],
  [
    'stop',
    () => {
      // there is no stop functionality on a media element, so let's pause the audio and reset the track to be the first
      audioEl.pause();
      index = 0;
      // update our status element
      updateStatus(allMeta[index], 'Action: stop  |  Playlist has stopped.');
    }
  ],
  [
    'seekbackward',
    (details) => {
      // details are: seekOffset, seekTime, fastSeek
      // get our skip time and set audio to that time
      const skipTime = details.seekOffset || defaultSkipTime;
      audioEl.currentTime = Math.max(audioEl.currentTime - skipTime, 0);
      // update our position
      updatePositionState();
      // update our status element
      updateStatus(allMeta[index], 'Action: seekbackward  |  Track has moved backward...')
    }
  ],
  [
    'seekforward',
    (details) => {
      // details are: seekOffset, seekTime, fastSeek
      // get our skip time and set audio to that time
      const skipTime = details.seekOffset || defaultSkipTime;
      audioEl.currentTime = Math.min(audioEl.currentTime + skipTime, audioEl.currentTime);
      // update our position
      updatePositionState();
      // update our status element
      updateStatus(allMeta[index], 'Action: seekforward  |  Track has moved forward...')
    }
  ],
  [
    'seekto',
    (details) => {
      // set our audio el to correct time
      audioEl.fastSeek(details.seekTime);
      audioEl.currentTime(details.seekTime);
      // update our position
      updatePositionState();
      // update our status element
      updateStatus(allMeta[index], 'Action: seekto  |  Track has moved...')
    }
  ],
  // NB there is also a 'skipad' action
];

// TODO play next track when the previous has finished
// TODO update playback state in certain actions

for (const [action, handler] of actionHandlers) {
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch (error) {
    console.log(`The media session action "${action}" is not supported yet.`);
  }
}

// add a couple of event listeners to the audio el to move to next track and update page info on first click
audioEl.addEventListener('ended', function() {
  // Play next track
  if (index < 2) {
    index++;
    playAudio();
  }
});

// on first play show correct info
let first = true;
audioEl.addEventListener('play', function() {
  if (first) {
    const message = isSupported ? "MediaSession active" : "MediaSession not supported";
    updateStatus(allMeta[index], message)
    first = false;
  }
})