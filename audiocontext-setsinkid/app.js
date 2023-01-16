const audioCtx = new window.AudioContext();
const playBtn = document.querySelector('.play');
const mediaDeviceBtn = document.querySelector('.media-devices');
const selectDiv = document.querySelector('.select-container');

playBtn.disabled = true;

mediaDeviceBtn.addEventListener('click', async () => {
  if ("setSinkId" in AudioContext.prototype) {
    selectDiv.innerHTML = '';
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();

    const label = document.createElement('label');
    label.innerHTML = 'Select output device:';
    label.htmlFor = 'output-device-select';

    const select = document.createElement('select');
    select.id = 'output-device-select';

    selectDiv.appendChild(label);
    selectDiv.appendChild(select);
    selectDiv.style.margin = '0 0 20px';
    selectDiv.style.padding = '20px 0';
    selectDiv.style.borderTop = '1px solid #ddd';
    selectDiv.style.borderBottom = '1px solid #ddd';

    const audioOutputs = devices.filter((device) => device.kind === 'audiooutput' && device.deviceId !== 'default');

    audioOutputs.forEach((device) => {
      const option = document.createElement('option')
      option.value = device.deviceId;
      option.textContent = device.label;
      select.appendChild(option);
    });

    const option = document.createElement('option')
    option.value = 'none';
    option.textContent = 'None';
    select.appendChild(option);

    playBtn.disabled = false;

    select.addEventListener('change', async () => {
      if(select.value === 'none') {
        await audioCtx.setSinkId({ type : 'none' });
      } else {
        await audioCtx.setSinkId(select.value);
      }
    })
    
    // Stop audio tracks, as we don't need them running now the permission has been granted
    stream.getAudioTracks().forEach((track) => track.stop());
    
  } else {
    const para = document.createElement('p');
    para.innerHTML = 'Your browser doesn\'t support <code>AudioContext.setSinkId()</code>. Check the <a href="https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/setSinkId#browser_compatibility">browser compatibility information</a> to see which browsers support it.'
    selectDiv.appendChild(para);
  }
});

// Create an empty three-second stereo buffer at the sample rate of the AudioContext
const myArrayBuffer = audioCtx.createBuffer(
  2,
  audioCtx.sampleRate * 3,
  audioCtx.sampleRate
);

// Fill the buffer with white noise;
// just random values between -1.0 and 1.0
for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
  const nowBuffering = myArrayBuffer.getChannelData(channel);
  for (let i = 0; i < myArrayBuffer.length; i++) {
    nowBuffering[i] = Math.random() * 2 - 1;
  }
}

const gain = audioCtx.createGain();
gain.gain.value = 0.25; 

playBtn.addEventListener('click', () => {
  const source = audioCtx.createBufferSource();
  source.buffer = myArrayBuffer;
  source.connect(gain);
  gain.connect(audioCtx.destination);
  source.start();
  
  if(audioCtx.sinkId === '') {
    console.log('Audio playing on default device');
  } else if(typeof audioCtx.sinkId === 'object' && audioCtx.sinkId.type === 'none') {
    console.log('Audio not playing on any device');
  } else {
    console.log(`Audio playing on device ${ audioCtx.sinkId }`);
  }
});

audioCtx.addEventListener('sinkchange', () => {
  if(typeof audioCtx.sinkId === 'object' && audioCtx.sinkId.type === 'none') {
    console.log('Audio changed to not play on any device');
  } else {
    console.log(`Audio output device changed to ${ audioCtx.sinkId }`);
  }
});