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

      // More stable frequency
      oscillator.type = 'sine';
      oscillator.frequency.value = 440; // A4 pitch, stable waveform

      gain.gain.value = 0; // Still silent

      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(scriptProcessor);
      scriptProcessor.connect(ctx.destination);

      oscillator.start(0);

      scriptProcessor.onaudioprocess = function (event) {
        const buffer = event.inputBuffer.getChannelData(0);
        
        // Debug: Check if buffer has data
        //const max = Math.max(...buffer);
        //const min = Math.min(...buffer);
        let max = -Infinity, min = Infinity;
        for (let i = 0; i < buffer.length; i++) {
          const v = buffer[i];
          if (v > max) max = v;
          if (v < min) min = v;
        }
        console.log("Audio buffer range:", { min, max });

        // Ensure buffer has signal variation
        if (Math.abs(max - min) < 1e-5) {
          console.warn("Buffer is flat or too quiet");
          resolve("0");
          return;
        }

        // Hash the buffer
        let hash = 0;
        for (let i = 0; i < buffer.length; i++) {
          const val = Math.floor(buffer[i] * 1000);
          hash = ((hash << 5) - hash) + val;
          hash |= 0;
        }

        // Cleanup
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
