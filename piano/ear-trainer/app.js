(() => {
  'use strict';
  const { playNote, silence, ensure } = window.PianoAudio;
  const { NAMES, noteName, pick, rand, int, storage, keyboardHtml } = window.Drill;

  // ---------- Data ----------
  const NOTE_KEYS = 'awsedftgyhujkolp;'; // computer keys for C4..E5 (index = midi - 60)
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
  // Für Elise (Beethoven, public domain) right-hand phrases, as MIDI numbers.
  const PHRASES = {
    fe1: { label: 'E D♯ E D♯ E', notes: [76, 75, 76, 75, 76] },
    fe2: { label: 'B D C A', notes: [71, 74, 72, 69] },
    fe3: { label: 'C E A B', notes: [60, 64, 69, 71] },
    fe4: { label: 'E G♯ B C', notes: [64, 68, 71, 72] },
    fe5: { label: 'E C B A', notes: [64, 72, 71, 69] },
    feA: { label: 'Opening phrase', notes: [76, 75, 76, 75, 76, 71, 74, 72, 69] },
    feB: { label: 'Answer phrase', notes: [60, 64, 69, 71, 64, 68, 71, 72] },
    feC: { label: 'Closing phrase', notes: [60, 64, 69, 71, 64, 72, 71, 69] },
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
    melody: [
      { name: '1 · 3 notes: C D E', gen: { pool: [60, 62, 64], len: 3, leap: 2 } },
      { name: '2 · 4 notes: C to G', gen: { pool: [60, 62, 64, 65, 67], len: 4, leap: 2 } },
      { name: '3 · 5 notes: C to C', gen: { pool: [60, 62, 64, 65, 67, 69, 71, 72], len: 5, leap: 4 } },
      { name: '4 · Für Elise fragments', phrases: ['fe1', 'fe2', 'fe3', 'fe4', 'fe5'] },
      { name: '5 · Für Elise phrases', phrases: ['feA', 'feB', 'feC'] },
    ],
  };
  const MODES = Object.keys(LEVELS);
  const RECENT_N = 20;
  const LEVEL_UP_ACC = 0.9;

  // ---------- Persistence ----------
  const store = storage('eartrainer.v1');
  const defaults = () => ({
    mode: 'note', level: { note: 0, interval: 0, melody: 0 },
    ref: true, dir: 'up', auto: true, best: 0,
    stats: { note: {}, interval: {}, melody: {} }, recent: {},
  });
  const validKeys = {
    note: NAMES.map((_, i) => String(i)),
    interval: Object.keys(INTERVALS),
    melody: [...Object.keys(PHRASES), ...LEVELS.melody.map((_, i) => 'L' + i)],
  };
  // Storage is shared by every page on this origin, so keep only known keys with expected types.
  function load() {
    const d = defaults();
    const s = store.load();
    if (!s || typeof s !== 'object') return d;
    d.mode = MODES.includes(s.mode) ? s.mode : 'note';
    for (const m of MODES) {
      d.level[m] = int(s.level && s.level[m], 0, LEVELS[m].length - 1, 0);
      const src = (s.stats && s.stats[m]) || {};
      for (const k of validKeys[m]) {
        const v = src[k];
        if (!v) continue;
        const t = int(v.t, 0, 1e9, 0);
        d.stats[m][k] = { t, r: int(v.r, 0, t, 0) };
      }
    }
    d.ref = s.ref !== false;
    d.auto = s.auto !== false;
    d.dir = ['up', 'down', 'harm', 'mix'].includes(s.dir) ? s.dir : 'up';
    d.best = int(s.best, 0, 1e9, 0);
    for (const [k, arr] of Object.entries(s.recent || {})) {
      if (/^(note|interval|melody):\d$/.test(k) && Array.isArray(arr)) {
        d.recent[k] = arr.slice(-RECENT_N).map(x => (x === 1 ? 1 : 0));
      }
    }
    return d;
  }
  const state = load();
  const save = () => store.save(state);
  const session = { right: 0, total: 0, streak: 0 };
  let q = null; // current question
  let autoTimer = null;

  // ---------- Helpers ----------
  const $ = id => document.getElementById(id);
  const level = () => LEVELS[state.mode][state.level[state.mode]];
  const acc = key => {
    const s = state.stats[state.mode][key];
    return s && s.t ? s.r / s.t : 0.5;
  };
  // Items tracked in the progress panel for the current level.
  function levelItems() {
    const m = state.mode, lv = level();
    if (m === 'note') return lv.pool.map(k => ({ key: k, label: NAMES[k] }));
    if (m === 'interval') return lv.pool.map(k => ({ key: k, label: INTERVALS[k].n }));
    if (lv.phrases) return lv.phrases.map(k => ({ key: k, label: PHRASES[k].label }));
    return [{ key: 'L' + state.level.melody, label: 'Random melodies' }];
  }
  // Keys enabled on the melody keyboard.
  function melodyNotes() {
    const lv = level();
    if (lv.gen) return new Set(lv.gen.pool);
    return new Set(lv.phrases.flatMap(id => PHRASES[id].notes));
  }

  function playInterval(root, semis, dir) {
    if (dir === 'harm') { playNote(root); playNote(root + semis); }
    else if (dir === 'down') { playNote(root + semis); playNote(root, 0.8); }
    else { playNote(root); playNote(root + semis, 0.8); }
  }
  function melodyStep() { return level().phrases ? 0.32 : 0.6; }
  function playMelody(notes) {
    const step = melodyStep();
    notes.forEach((n, i) => playNote(n, i * step, i === notes.length - 1 ? 1.8 : step + 0.4));
    return notes.length * step;
  }

  // Random melody that moves by at most `leap` steps within the pool.
  function genMelody({ pool, len, leap }) {
    let i = rand(0, pool.length - 1);
    const out = [pool[i]];
    while (out.length < len) {
      let j;
      do { j = i + rand(-leap, leap); } while (j < 0 || j >= pool.length || j === i);
      i = j;
      out.push(pool[i]);
    }
    return out;
  }

  // ---------- Questions ----------
  function newQuestion() {
    const prev = q ? q.key : null;
    const base = { done: false, first: true, tried: new Set() };
    if (state.mode === 'note') {
      const key = pick(level().pool, acc, prev);
      q = { ...base, key, midi: 60 + key };
    } else if (state.mode === 'interval') {
      const key = pick(level().pool, acc, prev);
      const dir = state.dir === 'mix' ? ['up', 'down', 'harm'][rand(0, 2)] : state.dir;
      q = { ...base, key, root: rand(50, 74 - key), dir };
    } else {
      const lv = level();
      const key = lv.phrases ? pick(lv.phrases, acc, prev) : 'L' + state.level.melody;
      const notes = lv.phrases ? PHRASES[key].notes : genMelody(lv.gen);
      q = { ...base, key, notes, pos: 1, bad: null, touched: false }; // first note is given
    }
  }

  function playQuestion() {
    if (!q) return;
    silence();
    if (state.mode === 'note') {
      if (state.ref) { playNote(60); playNote(q.midi, 1.0); } else playNote(q.midi);
    } else if (state.mode === 'interval') {
      playInterval(q.root, q.key, q.dir);
    } else {
      playMelody(q.notes);
    }
  }

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

  // Note / interval answer
  function answer(key) {
    if (!q || q.done || !level().pool.includes(key)) return;
    clearTimeout(autoTimer);
    const correct = key === q.key;
    if (q.first) { record(correct); q.first = false; }
    const label = state.mode === 'note' ? NAMES[key] : INTERVALS[key].n;
    silence();
    if (correct) {
      q.done = true;
      if (state.mode === 'note') playNote(q.midi); else playInterval(q.root, q.key, q.dir);
      let msg = `<span class="good">Correct! ${label}.</span>`;
      if (state.mode === 'interval') msg += ` <span class="muted">Song to remember it: ${INTERVALS[key].song}</span>`;
      setPrompt(msg);
      if (state.auto) autoTimer = setTimeout(next, 1600);
    } else {
      q.tried.add(key);
      if (state.mode === 'note') playNote(60 + key); else playInterval(q.root, key, q.dir);
      setPrompt(`<span class="bad">That was ${label}.</span> Press <b>Replay</b> to hear the question again, then try another answer.`);
    }
    afterAnswer();
  }

  // Melody: one note at a time
  function melodyInput(midi) {
    if (!q || q.done || !melodyNotes().has(midi)) return;
    clearTimeout(autoTimer);
    silence();
    playNote(midi, 0, 1.0);
    q.touched = true;
    if (midi === q.notes[q.pos]) {
      q.pos++; q.bad = null;
      if (q.pos === q.notes.length) {
        q.done = true;
        record(q.first);
        const title = level().phrases ? ` <span class="muted">(${PHRASES[q.key].label})</span>` : '';
        setPrompt(q.first
          ? `<span class="good">Perfect, no mistakes!</span>${title}`
          : `<span class="good">Got it.</span> Some mistakes along the way, so this one counts as a miss.${title}`);
        const len = playMelodyLater(0.7);
        if (state.auto) autoTimer = setTimeout(next, (0.7 + len + 1.2) * 1000);
      } else {
        setPrompt(`Note ${q.pos} of ${q.notes.length}. Which note comes next?`);
      }
    } else {
      q.first = false; q.bad = midi;
      setPrompt(`<span class="bad">Not ${noteName(midi)}.</span> Press <b>Replay</b> and try note ${q.pos + 1} again.`);
    }
    afterAnswer();
  }
  function playMelodyLater(delay) {
    q.notes.forEach((n, i) => playNote(n, delay + i * melodyStep(), i === q.notes.length - 1 ? 1.8 : melodyStep() + 0.4));
    return q.notes.length * melodyStep();
  }

  function afterAnswer() {
    renderAnswers(); renderScore(); renderStats(); checkLevelUp();
    $('btnNext').disabled = false;
  }

  function next() {
    clearTimeout(autoTimer);
    // Skipping a melody after trying it counts as a miss.
    if (q && state.mode === 'melody' && !q.done && q.touched) { record(false); renderScore(); renderStats(); }
    newQuestion();
    const prompts = { // functions: only the current mode's prompt may read q's mode-specific fields
      note: () => (state.ref ? 'You\'ll hear C first, then the mystery note. Which note is it?' : 'Which note is this?'),
      interval: () => 'Which interval is this?',
      melody: () => `Listen to the melody. The first note (${noteName(q.notes[0])}) is given. Play the rest in order.`,
    };
    setPrompt(prompts[state.mode]());
    renderAnswers();
    playQuestion();
  }

  function start() {
    ensure();
    $('btnStart').textContent = 'Restart';
    ['btnReplay', 'btnNext'].forEach(id => { $(id).disabled = false; });
    $('btnRef').disabled = state.mode === 'interval';
    next();
  }

  // ---------- Rendering ----------
  function setPrompt(html) { $('prompt').innerHTML = html; }
  const kbdFor = m => (NOTE_KEYS[m - 60] || '').toUpperCase();

  function renderAnswers() {
    const box = $('answers');
    if (state.mode === 'note') {
      const pool = level().pool;
      box.innerHTML = keyboardHtml(60, 71, {
        enabled: m => pool.includes(m - 60),
        cls: m => (!q ? '' : q.done && m === q.midi ? ' good' : q.tried.has(m - 60) ? ' bad' : ''),
        kbd: kbdFor,
      });
    } else if (state.mode === 'interval') {
      box.innerHTML = '<div class="grid">' + level().pool.map((s, i) => {
        const iv = INTERVALS[s];
        const c = !q ? '' : q.done && s === q.key ? ' good' : q.tried.has(s) ? ' bad' : '';
        return `<button class="ans${c}" data-key="${s}"><b>${iv.s}</b><small>${iv.n}</small>${INT_KEYS[i] ? `<kbd>${INT_KEYS[i]}</kbd>` : ''}</button>`;
      }).join('') + '</div>';
    } else {
      const allowed = melodyNotes();
      let slots = '';
      if (q) {
        slots = '<div class="slots">' + q.notes.map((n, i) => {
          if (i === 0) return `<span class="slot given">${NAMES[n % 12]}</span>`;
          if (i < q.pos) return `<span class="slot filled">${NAMES[n % 12]}</span>`;
          if (i === q.pos && q.bad !== null) return '<span class="slot bad">?</span>';
          return '<span class="slot">?</span>';
        }).join('') + '</div>';
      }
      const last = q && q.pos > 0 ? q.notes[q.pos - 1] : null;
      box.innerHTML = slots + keyboardHtml(60, 76, {
        enabled: m => allowed.has(m),
        cls: m => (!q ? '' : m === q.bad ? ' bad' : q.done && m === last ? ' good' : ''),
        label: m => NAMES[m % 12],
        kbd: kbdFor,
      });
    }
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
    for (const { key, label } of levelItems()) {
      const s = state.stats[m][key];
      const pct = s && s.t ? Math.round(100 * s.r / s.t) : 0;
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
    renderAnswers(); renderScore(); renderStats(); checkLevelUp();
  }

  function resetQuestion(msg) {
    clearTimeout(autoTimer); silence(); q = null;
    if (msg) setPrompt(msg);
    $('btnStart').textContent = 'Start';
    ['btnReplay', 'btnNext', 'btnRef'].forEach(id => { $(id).disabled = true; });
  }

  // ---------- Events ----------
  function input(key) {
    if (state.mode === 'melody') melodyInput(key);
    else if (state.mode === 'note') answer(key - 60);
    else answer(key);
  }

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
    if (!q) { // preview sounds before starting
      ensure();
      if (state.mode === 'interval') playInterval(60, k, state.dir === 'mix' ? 'up' : state.dir);
      else playNote(k);
      return;
    }
    input(k);
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
    if (k === 'r' && state.mode !== 'interval') { silence(); playNote(60); return; }
    if (!q) return;
    if (state.mode === 'interval') {
      const i = INT_KEYS.indexOf(k);
      const pool = level().pool;
      if (i >= 0 && i < pool.length) answer(pool[i]);
    } else {
      const i = NOTE_KEYS.indexOf(k);
      if (i >= 0 && (state.mode === 'melody' || i < 12)) input(60 + i);
    }
  });

  renderMode();
})();
