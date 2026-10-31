(() => {
  'use strict';

  // ---------- Data ----------
  const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const NOTE_KEYS = 'awsedftgyhuj'; // computer keys for C..B
  const INT_KEYS = '1234567890-=';
  const INTERVALS = {
    1: { s: 'm2', n: 'Minor 2nd', song: 'Jaws theme' },
    2: { s: 'M2', n: 'Major 2nd', song: 'Happy Birthday' },
    3: { s: 'm3', n: 'Minor 3rd', song: 'Greensleeves' },
    4: { s: 'M3', n: 'Major 3rd', song: 'When the Saints Go Marching In' },
    5: { s: 'P4', n: 'Perfect 4th', song: 'Here Comes the Bride' },
    6: { s: 'TT', n: 'Tritone', song: 'The Simpsons theme' },
    7: { s: 'P5', n: 'Perfect 5th', song: 'Star Wars theme' },
    8: { s: 'm6', n: 'Minor 6th', song: 'The Entertainer (E→C)' },
    9: { s: 'M6', n: 'Major 6th', song: 'My Bonnie Lies over the Ocean' },
    10: { s: 'm7', n: 'Minor 7th', song: 'Somewhere (West Side Story)' },
    11: { s: 'M7', n: 'Major 7th', song: 'Take On Me (chorus leap)' },
    12: { s: 'P8', n: 'Octave', song: 'Somewhere Over the Rainbow' },
  };
  const LEVELS = {
    note: [
      { name: '1 · C E G', pool: [0, 4, 7] },
      { name: '2 · C D E F G', pool: [0, 2, 4, 5, 7] },
      { name: '3 · All white keys', pool: [0, 2, 4, 5, 7, 9, 11] },
      { name: '4 · Für Elise notes', pool: [9, 11, 0, 2, 3, 4] },
      { name: '5 · All 12 notes', pool: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
    ],
    interval: [
      { name: '1 · M3 P5 Octave', pool: [4, 7, 12] },
      { name: '2 · + m3 P4', pool: [3, 4, 5, 7, 12] },
      { name: '3 · + M2 M6', pool: [2, 3, 4, 5, 7, 9, 12] },
      { name: '4 · + m2 m6 m7', pool: [1, 2, 3, 4, 5, 7, 8, 9, 10, 12] },
      { name: '5 · All intervals', pool: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    ],
  };
  const RECENT_N = 20;
  const LEVEL_UP_ACC = 0.9;

  // ---------- Persistence ----------
  const STORE = 'eartrainer.v1';
  const defaults = () => ({
    mode: 'note', level: { note: 0, interval: 0 },
    ref: true, dir: 'up', auto: true, best: 0,
    stats: { note: {}, interval: {} }, recent: {},
  });
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE));
      if (s && s.stats) return Object.assign(defaults(), s);
    } catch (e) { /* storage unavailable */ }
    return defaults();
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* ignore */ } }

  const state = load();
  const session = { right: 0, total: 0, streak: 0 };
  let q = null; // current question
  let autoTimer = null;

  // ---------- Audio (synthesized piano-like tone) ----------
  let ctx = null, master = null;
  const voices = new Set();
  function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const freq = m => 440 * Math.pow(2, (m - 69) / 12);

  function playNote(midi, when = 0, dur = 1.8) {
    const c = audio();
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
  function playInterval(root, semis, dir) {
    if (dir === 'harm') { playNote(root); playNote(root + semis); }
    else if (dir === 'down') { playNote(root + semis); playNote(root, 0.8); }
    else { playNote(root); playNote(root + semis, 0.8); }
  }

  // ---------- Question generation ----------
  const level = () => LEVELS[state.mode][state.level[state.mode]];
  function acc(key) {
    const s = state.stats[state.mode][key];
    return s && s.t ? s.r / s.t : 0.5;
  }
  function pick(pool, avoid) {
    // Weight weak items more heavily; avoid immediate repeats.
    const items = pool.length > 1 ? pool.filter(k => k !== avoid) : pool;
    const w = items.map(k => 1 + 3 * (1 - acc(k)));
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
    return items[items.length - 1];
  }
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

  function newQuestion() {
    const prev = q ? q.key : null;
    const key = pick(level().pool, prev);
    if (state.mode === 'note') {
      q = { key, midi: 60 + key, tried: new Set(), done: false, first: true };
    } else {
      const dir = state.dir === 'mix' ? ['up', 'down', 'harm'][rand(0, 2)] : state.dir;
      q = { key, root: rand(50, 74 - key), dir, tried: new Set(), done: false, first: true };
    }
  }
  function playQuestion() {
    if (!q) return;
    silence();
    if (state.mode === 'note') {
      if (state.ref) { playNote(60); playNote(q.midi, 1.0); }
      else playNote(q.midi);
    } else {
      playInterval(q.root, q.key, q.dir);
    }
  }

  // ---------- Answering ----------
  function record(correct) {
    const m = state.mode;
    const s = state.stats[m][q.key] || (state.stats[m][q.key] = { r: 0, t: 0 });
    s.t++; if (correct) s.r++;
    const rk = m + ':' + state.level[m];
    const rec = state.recent[rk] || (state.recent[rk] = []);
    rec.push(correct ? 1 : 0);
    if (rec.length > RECENT_N) rec.shift();
    session.total++;
    if (correct) { session.right++; session.streak++; state.best = Math.max(state.best, session.streak); }
    else session.streak = 0;
    save();
  }

  function answer(key) {
    if (!q || q.done) return;
    if (!level().pool.includes(key)) return;
    clearTimeout(autoTimer);
    const correct = key === q.key;
    if (q.first) { record(correct); q.first = false; }
    const label = state.mode === 'note' ? NAMES[key] : INTERVALS[key].n;
    if (correct) {
      q.done = true;
      silence();
      if (state.mode === 'note') playNote(q.midi);
      else playInterval(q.root, q.key, q.dir);
      let msg = `<span class="good">Correct! ${label}.</span>`;
      if (state.mode === 'interval') msg += ` <span class="muted">Song to remember it: ${INTERVALS[key].song}</span>`;
      setPrompt(msg);
      if (state.auto) autoTimer = setTimeout(next, 1600);
    } else {
      q.tried.add(key);
      silence();
      if (state.mode === 'note') playNote(60 + key);
      else playInterval(q.root, key, q.dir);
      setPrompt(`<span class="bad">That was ${label}.</span> Press <b>Replay</b> to hear the question again, then try another answer.`);
    }
    renderAnswers(); renderScore(); renderStats(); checkLevelUp();
    $('btnNext').disabled = false;
  }

  function next() {
    clearTimeout(autoTimer);
    newQuestion();
    setPrompt(state.mode === 'note'
      ? (state.ref ? 'You\'ll hear C first, then the mystery note. Which note is it?' : 'Which note is this?')
      : 'Which interval is this?');
    renderAnswers();
    playQuestion();
  }

  function start() {
    audio();
    $('btnStart').textContent = 'Restart';
    ['btnReplay', 'btnNext'].forEach(id => { $(id).disabled = false; });
    $('btnRef').disabled = state.mode !== 'note';
    next();
  }

  // ---------- Rendering ----------
  const $ = id => document.getElementById(id);
  function setPrompt(html) { $('prompt').innerHTML = html; }

  function keyClass(k) {
    if (!q) return '';
    if (q.done && k === q.key) return ' good';
    if (q.tried.has(k)) return ' bad';
    return '';
  }

  function renderAnswers() {
    const pool = level().pool;
    const box = $('answers');
    if (state.mode === 'note') {
      const whites = [0, 2, 4, 5, 7, 9, 11];
      const blacks = [[1, 0], [3, 1], [6, 3], [8, 4], [10, 5]]; // [pc, white index to the left]
      let html = '<div class="keyboard">';
      for (const pc of whites) html += keyHtml(pc, 'white', pool, '');
      for (const [pc, wi] of blacks) html += keyHtml(pc, 'black', pool, `left:calc(${(wi + 1) * (100 / 7)}% - 4.5%)`);
      box.innerHTML = html + '</div>';
    } else {
      box.innerHTML = '<div class="grid">' + pool.map((s, i) => {
        const iv = INTERVALS[s];
        return `<button class="ans${keyClass(s)}" data-key="${s}"><b>${iv.s}</b><small>${iv.n}</small>${INT_KEYS[i] ? `<kbd>${INT_KEYS[i]}</kbd>` : ''}</button>`;
      }).join('') + '</div>';
    }
  }
  function keyHtml(pc, color, pool, style) {
    const on = pool.includes(pc);
    return `<button class="key ${color}${on ? '' : ' off'}${keyClass(pc)}" data-key="${pc}" style="${style}" ${on ? '' : 'disabled aria-hidden="true"'}>
      <span>${NAMES[pc]}</span><kbd>${NOTE_KEYS[pc].toUpperCase()}</kbd></button>`;
  }

  function renderScore() {
    $('sScore').textContent = `${session.right} / ${session.total}`;
    $('sStreak').textContent = session.streak;
    $('sBest').textContent = state.best;
  }

  function renderStats() {
    const m = state.mode;
    const rec = state.recent[m + ':' + state.level[m]] || [];
    const recAcc = rec.length ? Math.round(100 * rec.reduce((a, b) => a + b, 0) / rec.length) : null;
    let html = `<p class="muted">This level, last ${rec.length} answers: <b>${recAcc === null ? '–' : recAcc + '%'}</b></p>`;
    for (const k of level().pool) {
      const s = state.stats[m][k];
      const pct = s && s.t ? Math.round(100 * s.r / s.t) : 0;
      const label = m === 'note' ? NAMES[k] : INTERVALS[k].n;
      html += `<div class="stat"><span>${label}</span><div class="bar"><i style="width:${pct}%"></i></div><span class="n">${s ? `${pct}% · ${s.t}` : '–'}</span></div>`;
    }
    $('stats').innerHTML = html;
  }

  function checkLevelUp() {
    const m = state.mode, lv = state.level[m];
    const rec = state.recent[m + ':' + lv] || [];
    const ok = rec.length >= RECENT_N && rec.reduce((a, b) => a + b, 0) / rec.length >= LEVEL_UP_ACC;
    const b = $('levelUp');
    if (ok && lv < LEVELS[m].length - 1) {
      b.innerHTML = `You scored 90% or better on the last ${RECENT_N} questions. Ready for the next level? <button id="btnUp">Go to level ${lv + 2}</button>`;
      b.hidden = false;
    } else b.hidden = true;
  }

  function renderMode() {
    document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.mode === state.mode)));
    $('level').innerHTML = LEVELS[state.mode].map((l, i) => `<option value="${i}">${l.name}</option>`).join('');
    $('level').value = state.level[state.mode];
    $('refWrap').hidden = state.mode !== 'note';
    $('dirWrap').hidden = state.mode !== 'interval';
    $('optRef').checked = state.ref;
    $('optDir').value = state.dir;
    $('optAuto').checked = state.auto;
    $('btnRef').disabled = state.mode !== 'note' || !q;
    renderAnswers(); renderScore(); renderStats(); checkLevelUp();
  }

  function resetQuestion(msg) {
    clearTimeout(autoTimer); silence(); q = null;
    if (msg) setPrompt(msg);
    $('btnStart').textContent = 'Start';
    ['btnReplay', 'btnNext', 'btnRef'].forEach(id => { $(id).disabled = true; });
  }

  // ---------- Events ----------
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    if (state.mode === t.dataset.mode) return;
    state.mode = t.dataset.mode; save();
    resetQuestion('Press <b>Start</b>, listen, then pick your answer.');
    renderMode();
  }));
  $('level').addEventListener('change', e => {
    state.level[state.mode] = +e.target.value; save();
    resetQuestion('Level changed. Press <b>Start</b>.');
    renderMode();
  });
  $('optRef').addEventListener('change', e => { state.ref = e.target.checked; save(); });
  $('optDir').addEventListener('change', e => { state.dir = e.target.value; save(); });
  $('optAuto').addEventListener('change', e => { state.auto = e.target.checked; save(); });
  $('btnStart').addEventListener('click', start);
  $('btnReplay').addEventListener('click', playQuestion);
  $('btnRef').addEventListener('click', () => { silence(); playNote(60); });
  $('btnNext').addEventListener('click', next);
  $('btnReset').addEventListener('click', () => {
    const keep = { mode: state.mode, level: state.level, ref: state.ref, dir: state.dir, auto: state.auto };
    Object.assign(state, defaults(), keep); save();
    session.right = session.total = session.streak = 0;
    renderMode();
  });
  $('answers').addEventListener('click', e => {
    const b = e.target.closest('[data-key]');
    if (!b || b.disabled) return;
    const k = +b.dataset.key;
    if (!q) { audio(); state.mode === 'note' ? playNote(60 + k) : playInterval(60, k, state.dir === 'mix' ? 'up' : state.dir); return; }
    answer(k);
  });
  $('levelUp').addEventListener('click', e => {
    if (e.target.id !== 'btnUp') return;
    state.level[state.mode]++; save();
    resetQuestion('New level! Press <b>Start</b>.');
    renderMode();
  });
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.matches('select, input, textarea')) return;
    const k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); q ? playQuestion() : start(); return; }
    if (k === 'enter') { e.preventDefault(); q ? next() : start(); return; }
    if (k === 'r' && state.mode === 'note') { silence(); playNote(60); return; }
    if (!q) return;
    if (state.mode === 'note') {
      const pc = NOTE_KEYS.indexOf(k);
      if (pc >= 0) answer(pc);
    } else {
      const i = INT_KEYS.indexOf(k);
      const pool = level().pool;
      if (i >= 0 && i < pool.length) answer(pool[i]);
    }
  });

  renderMode();
})();
