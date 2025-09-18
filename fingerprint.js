// fingerprint.js

export async function getAudioFingerprint() {
  return new Promise((resolve, reject) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const analyser = ctx.createAnalyser();
      const gain = ctx.createGain();
      const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);

      oscillator.type = 'triangle';
      oscillator.frequency.value = 10000;
      gain.gain.value = 0;

      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(scriptProcessor);
      scriptProcessor.connect(ctx.destination);

      oscillator.start(0);

      scriptProcessor.onaudioprocess = function (event) {
        const buffer = event.inputBuffer.getChannelData(0);
        let hash = 0;
        for (let i = 0; i < buffer.length; i++) {
          const value = Math.floor(buffer[i] * 1000);
          hash = ((hash << 5) - hash) + value;
          hash |= 0;
        }

        oscillator.stop();
        oscillator.disconnect();
        analyser.disconnect();
        gain.disconnect();
        scriptProcessor.disconnect();
        ctx.close();

        resolve(hash.toString());
      };
    } catch (err) {
      reject(err);
    }
  });
}

export function getCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 200;
  canvas.height = 50;

  ctx.textBaseline = 'top';
  ctx.font = '16px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(0, 0, 200, 50);
  ctx.fillStyle = '#069';
  ctx.fillText('Hello, canvas fingerprint!', 2, 15);

  const dataURL = canvas.toDataURL();

  let hash = 0;
  for (let i = 0; i < dataURL.length; i++) {
    const chr = dataURL.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  return hash.toString();
}

export async function getCombinedFingerprint() {
  const audio = await getAudioFingerprint();
  const canvas = getCanvasFingerprint();
  return {
    audio,
    canvas,
    combined: audio + '_' + canvas,
  };
}
