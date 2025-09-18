// audioFingerprint.js

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

      gain.gain.value = 0; // Mute

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
