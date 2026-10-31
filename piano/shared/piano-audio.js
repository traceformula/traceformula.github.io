// Shared piano-like synth (Web Audio, no samples).
// Add ?debug to the page URL to see audio state changes on screen.
(function () {
  'use strict';
  let ctx = null, master = null;
  const voices = new Set();
  let queue = []; // notes requested while the context was not running yet

  // ---------- On-screen debug log (?debug) ----------
  const DEBUG = /[?&]debug\b/.test(location.search);
  let logBox = null;
  function log(msg) {
    if (!DEBUG) return;
    if (!logBox) {
      logBox = document.createElement('pre');
      logBox.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:35vh;overflow:auto;margin:0;padding:6px 8px;' +
        'font:11px/1.35 ui-monospace,monospace;background:rgba(0,0,0,.85);color:#7f7;z-index:9999;white-space:pre-wrap';
      document.body.appendChild(logBox);
    }
    const t = (performance.now() / 1000).toFixed(2);
    logBox.textContent += `${t} ${msg}\n`;
    logBox.scrollTop = logBox.scrollHeight;
  }

  // ---------- iOS unlocking ----------
  // Web Audio is muted by the iPhone silent switch unless the page's audio
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
    // Set the session type once; changing it again can interrupt a running context.
    try {
      if (navigator.audioSession && navigator.audioSession.type !== 'playback') {
        navigator.audioSession.type = 'playback';
        log('audioSession.type = playback');
      }
    } catch (e) { /* unsupported */ }
    if (!silentTag) {
      silentTag = document.createElement('audio');
      silentTag.setAttribute('x-webkit-airplay', 'deny');
      silentTag.loop = true;
      silentTag.src = silentWavUrl();
    }
    if (silentTag.paused && document.visibilityState === 'visible') {
      const p = silentTag.play();
      if (p && p.then) p.then(() => log('silent <audio> playing'), e => log('silent <audio> blocked: ' + e.name));
    }
  }

  function resume(why) {
    if (!ctx || ctx.state === 'running') return;
    const r = ctx.resume();
    log(`resume() from ${ctx.state} (${why})`);
    if (r && r.then) r.then(() => log('resume ok → ' + ctx.state), e => log('resume failed: ' + e.name));
  }

  function ensure() {
    unlockIOS();
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      log('AudioContext created, state=' + ctx.state);
      const comp = ctx.createDynamicsCompressor();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(comp); comp.connect(ctx.destination);
      // A one-sample silent buffer, started inside the user gesture, fully unlocks older iOS.
      const b = ctx.createBufferSource();
      b.buffer = ctx.createBuffer(1, 1, 22050);
      b.connect(ctx.destination); b.start(0);
      ctx.onstatechange = () => {
        log('state → ' + ctx.state);
        if (ctx.state === 'running') flushQueue();
        // iOS can briefly "interrupt" the context (e.g. while the audio session switches); try to come back.
        else if (document.visibilityState === 'visible') resume('statechange');
      };
    }
    // iOS uses "interrupted" (calls, app switch) as well as "suspended".
    resume('gesture');
    return ctx;
  }
  // Unlock on any touch/click/key, each of which counts as a user gesture on iOS.
  ['touchend', 'click', 'keydown'].forEach(ev =>
    document.addEventListener(ev, ensure, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && silentTag) silentTag.pause();
  });

  // ---------- Synth ----------
  const freq = m => 440 * Math.pow(2, (m - 69) / 12);

  // Public: play now if the context is running, otherwise queue until it is.
  function playNote(midi, when = 0, dur = 1.8) {
    const c = ensure();
    if (c.state !== 'running') {
      queue.push({ midi, when, dur, at: performance.now() });
      log(`queued note ${midi} (state=${c.state})`);
      return;
    }
    schedule(c, midi, when, dur);
  }

  function flushQueue() {
    const now = performance.now();
    const fresh = queue.filter(n => now - n.at < 3000); // drop stale requests
    queue = [];
    if (fresh.length) log(`playing ${fresh.length} queued note(s)`);
    const base = fresh.length ? fresh[0].at : now;
    for (const n of fresh) schedule(ctx, n.midi, n.when + (n.at - base) / 1000, n.dur);
  }

  function schedule(c, midi, when, dur) {
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
    if (DEBUG) log(`note ${midi} at +${when.toFixed(2)}s`);
  }

  function silence() {
    queue = [];
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

  window.PianoAudio = { ensure, playNote, silence, freq, log };
})();
