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

      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gain.gain.value = 0; // Silent

      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(scriptProcessor);
      scriptProcessor.connect(ctx.destination);

      oscillator.start(0);

      scriptProcessor.onaudioprocess = async function (event) {
        const buffer = event.inputBuffer.getChannelData(0);

        // Convert buffer to string (keep 1 decimal precision)
        const fingerprintStr = Array.from(buffer)
          .slice(0, 512) // don't hash full buffer; 512 is enough
          .map(v => v.toFixed(3))
          .join(',');

        // Encode and hash using SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(fingerprintStr);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Cleanup
        oscillator.stop();
        oscillator.disconnect();
        analyser.disconnect();
        gain.disconnect();
        scriptProcessor.disconnect();
        ctx.close();

        resolve(hashHex);
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
