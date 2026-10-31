// Shared piano-like synth (Web Audio, no samples).
(function () {
  'use strict';
  let ctx = null, master = null;
  const voices = new Set();

  // --- iOS: Web Audio is muted by the silent switch unless the page's audio
  // session is "playback". Safari 17+ exposes navigator.audioSession; older
  // versions switch category when an <audio> element plays, so we loop a
  // silent clip while the page is visible.
  let silentTag = null;
  function silentWavUrl() {
    const n = 4000, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVEfmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    str(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128); // 8-bit silence
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }
  function unlockIOS() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* unsupported */ }
    if (!silentTag) {
      silentTag = document.createElement('audio');
      silentTag.setAttribute('x-webkit-airplay', 'deny');
      silentTag.loop = true;
      silentTag.src = silentWavUrl();
    }
    if (silentTag.paused && document.visibilityState === 'visible') {
      const p = silentTag.play();
      if (p && p.catch) p.catch(() => { /* needs a user gesture; retried on the next one */ });
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && silentTag) silentTag.pause();
  });

  function ensure() {
    unlockIOS();
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(comp); comp.connect(ctx.destination);
      // A one-sample silent buffer, started inside the user gesture, fully unlocks older iOS.
      const b = ctx.createBufferSource();
      b.buffer = ctx.createBuffer(1, 1, 22050);
      b.connect(ctx.destination); b.start(0);
    }
    // iOS uses "interrupted" (calls, app switch) as well as "suspended".
    if (ctx.state !== 'running') { const r = ctx.resume(); if (r && r.catch) r.catch(() => {}); }
    return ctx;
  }
  // Unlock on the first touch/click/key anywhere, which counts as a user gesture on iOS.
  ['touchend', 'click', 'keydown'].forEach(ev =>
    document.addEventListener(ev, ensure, { capture: true, passive: true }));

  const freq = m => 440 * Math.pow(2, (m - 69) / 12);

  function playNote(midi, when = 0, dur = 1.8) {
    const c = ensure();
    const t = c.currentTime + 0.03 + when;
    const f = freq(midi);
    const out = c.createGain();
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(14000, f * 14), t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(f * 2.5, 500), t + dur);
    out.connect(lp); lp.connect(master);

    const lenScale = Math.pow(261.6 / f, 0.35); // lower notes ring longer
    const B = 0.0004; // string inharmonicity
    const oscs = [];
    for (let n = 1; n <= 10; n++) {
      const fn = f * n * Math.sqrt(1 + B * n * n);
      if (fn > 16000) break;
      const o = c.createOscillator();
      o.frequency.value = fn;
      const g = c.createGain();
      const a = 0.32 / Math.pow(n, 1.25);
      const tau = (0.55 * lenScale) / (1 + 0.45 * (n - 1));
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(a, t + 0.004);
      g.gain.setTargetAtTime(0, t + 0.004, tau);
      g.gain.setTargetAtTime(0, t + dur, 0.06); // release
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + dur + 0.5);
      oscs.push(o);
    }
    const v = { out, oscs };
    voices.add(v);
    oscs[0].onended = () => { voices.delete(v); out.disconnect(); };
  }

  function silence() {
    if (!ctx) return;
    const t = ctx.currentTime;
    for (const v of voices) {
      v.out.gain.cancelScheduledValues(t);
      v.out.gain.setValueAtTime(v.out.gain.value, t);
      v.out.gain.setTargetAtTime(0, t, 0.03);
      v.oscs.forEach(o => { try { o.stop(t + 0.2); } catch (e) { /* already stopped */ } });
    }
    voices.clear();
  }

  window.PianoAudio = { ensure, playNote, silence, freq };
})();
