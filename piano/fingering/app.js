(() => {
  'use strict';
  const { playNote, silence, ensure } = window.PianoAudio;
  const { NAMES, isBlack, int, storage, keyboardHtml } = window.Drill;

  // ---------- Data ----------
  // Finger numbers: 1 = thumb, 2 = index, 3 = middle, 4 = ring, 5 = pinky (both hands).
  const POSITIONS = [
    { id: 'rhC', name: 'Right hand · C position', hand: 'R', keys: { 60: 1, 62: 2, 64: 3, 65: 4, 67: 5 },
      tip: 'Thumb on middle C, then one finger per white key up to G.' },
    { id: 'lhC', name: 'Left hand · C position', hand: 'L', keys: { 48: 5, 50: 4, 52: 3, 53: 2, 55: 1 },
      tip: 'Pinky on the C below middle C, thumb on G. The left hand counts from the thumb too.' },
    { id: 'rhG', name: 'Right hand · G position', hand: 'R', keys: { 67: 1, 69: 2, 71: 3, 72: 4, 74: 5 },
      tip: 'The same shape as C position, moved up so the thumb is on G.' },
    { id: 'lhG', name: 'Left hand · G position', hand: 'L', keys: { 43: 5, 45: 4, 47: 3, 48: 2, 50: 1 },
      tip: 'The same shape as left-hand C position, moved down so the pinky is on G.' },
    { id: 'rhFE', name: 'Right hand · Für Elise (A position)', hand: 'R', keys: { 69: 1, 71: 2, 72: 3, 74: 4, 75: 4, 76: 5 },
      tip: 'Thumb on A. Finger 4 plays both D and D♯: slide forward onto the black key for D♯.' },
    { id: 'lhFE', name: 'Left hand · Für Elise bass (A E A)', hand: 'L', keys: { 45: 5, 52: 2, 57: 1 },
      tip: 'An open hand: pinky on low A, finger 2 on E, thumb on the A above. Fingers 3 and 4 float.' },
  ];
  const n = (midi, f) => [midi, f];
  const EXERCISES = [
    { id: 'c5R', name: 'C position up and down (right hand)', hand: 'R',
      notes: [n(60, 1), n(62, 2), n(64, 3), n(65, 4), n(67, 5), n(65, 4), n(64, 3), n(62, 2), n(60, 1)],
      tip: 'One finger per key. Keep every finger resting on its key, even when it isn\'t playing.' },
    { id: 'c5L', name: 'C position up and down (left hand)', hand: 'L',
      notes: [n(48, 5), n(50, 4), n(52, 3), n(53, 2), n(55, 1), n(53, 2), n(52, 3), n(50, 4), n(48, 5)],
      tip: 'Start with the pinky. Fingers 4 and 5 are the weakest, so play them a little firmer.' },
    { id: 'skip', name: 'Skips: C E D F E G (right hand)', hand: 'R',
      notes: [n(60, 1), n(64, 3), n(62, 2), n(65, 4), n(64, 3), n(67, 5), n(65, 4), n(62, 2), n(64, 3), n(60, 1)],
      tip: 'Your hand stays still. Only the fingers move.' },
    { id: 'shift', name: 'Shift: C position → G position (right hand)', hand: 'R',
      notes: [n(60, 1), n(62, 2), n(64, 3), n(65, 4), n(67, 5), n(67, 1), n(69, 2), n(71, 3), n(72, 4), n(74, 5)],
      tip: 'After G with finger 5, lift the whole hand and land with the thumb on that same G.' },
    { id: 'scaleR', name: 'C scale, thumb under (right hand)', hand: 'R',
      notes: [n(60, 1), n(62, 2), n(64, 3), n(65, 1), n(67, 2), n(69, 3), n(71, 4), n(72, 5),
        n(71, 4), n(69, 3), n(67, 2), n(65, 1), n(64, 3), n(62, 2), n(60, 1)],
      tip: 'Going up, the thumb passes under finger 3 to reach F. Coming down, finger 3 crosses over the thumb to E.' },
    { id: 'scaleL', name: 'C scale, cross over (left hand)', hand: 'L',
      notes: [n(48, 5), n(50, 4), n(52, 3), n(53, 2), n(55, 1), n(57, 3), n(59, 2), n(60, 1),
        n(59, 2), n(57, 3), n(55, 1), n(53, 2), n(52, 3), n(50, 4), n(48, 5)],
      tip: 'Going up, finger 3 crosses over the thumb to A. Coming down, the thumb passes under to G.' },
    { id: 'feR', name: 'Für Elise opening (right hand)', hand: 'R',
      notes: [n(76, 5), n(75, 4), n(76, 5), n(75, 4), n(76, 5), n(71, 2), n(74, 4), n(72, 3), n(69, 1)],
      tip: 'Rock gently between fingers 5 and 4 for E and D♯, with a loose wrist. This is one common fingering, so check your sheet music.' },
    { id: 'feL', name: 'Für Elise bass: A E A (left hand)', hand: 'L',
      notes: [n(45, 5), n(52, 2), n(57, 1), n(45, 5), n(52, 2), n(57, 1)],
      tip: 'Keep the hand open and let it roll from pinky to thumb.' },
  ];
  const TEMPOS = [40, 60, 90, 120];

  // ---------- Persistence (validated: storage is shared across this origin) ----------
  const store = storage('fingering.v1');
  const defaults = () => ({ tab: 'positions', pos: 0, ex: 0, tempo: 60, showFingers: true, stats: {}, best: {} });
  function load() {
    const d = defaults();
    const s = store.load();
    if (!s || typeof s !== 'object') return d;
    d.tab = s.tab === 'exercises' ? 'exercises' : 'positions';
    d.pos = int(s.pos, 0, POSITIONS.length - 1, 0);
    d.ex = int(s.ex, 0, EXERCISES.length - 1, 0);
    d.tempo = TEMPOS.includes(s.tempo) ? s.tempo : 60;
    d.showFingers = s.showFingers !== false;
    for (const p of POSITIONS) {
      const v = s.stats && s.stats[p.id];
      if (v) { const t = int(v.t, 0, 1e9, 0); d.stats[p.id] = { t, r: int(v.r, 0, t, 0) }; }
    }
    for (const e of EXERCISES) {
      const v = s.best && s.best[e.id];
      if (v) d.best[e.id] = { ms: int(v.ms, 0, 3600000, 0), runs: int(v.runs, 0, 1e9, 0), clean: int(v.clean, 0, 1e9, 0) };
    }
    return d;
  }
  const state = load();
  const save = () => store.save(state);
  const session = { right: 0, total: 0, streak: 0 };

  // ---------- UI state ----------
  let quiz = null;     // positions quiz question
  let run = null;      // exercise practice run
  let watch = null;    // { i, timer } while the demo plays
  let flash = {};      // transient highlight: { finger: 'good'|'bad', key: midi }

  const $ = id => document.getElementById(id);
  const pos = () => POSITIONS[state.pos];
  const ex = () => EXERCISES[state.ex];
  const nm = m => NAMES[m % 12];

  // ---------- Hand diagram (palm down, as you see your hand over the keys) ----------
  function handSvg(hand, hi, cls = {}, dim = []) {
    const R = hand === 'R';
    const mx = x => (R ? x : 200 - x);
    const fingers = [
      { f: 2, cx: 80, top: 30 }, { f: 3, cx: 106, top: 16 }, { f: 4, cx: 132, top: 26 }, { f: 5, cx: 157, top: 48 },
    ];
    const c = f => `finger${hi === f ? ' hi' : ''}${cls[f] ? ' ' + cls[f] : ''}${dim.includes(f) ? ' dim' : ''}`;
    let s = `<svg class="hand" viewBox="0 0 200 175" role="group" aria-label="${R ? 'Right' : 'Left'} hand">`;
    for (const { f, cx, top } of fingers) {
      s += `<g data-finger="${f}" class="${c(f)}"><rect x="${mx(cx) - 12}" y="${top}" width="24" height="${112 - top}" rx="12"/>` +
        `<text x="${mx(cx)}" y="${top + 20}">${f}</text></g>`;
    }
    const tx = mx(74); // thumb grows out of the lower side of the palm
    s += `<g data-finger="1" class="${c(1)}"><rect x="${tx - 12}" y="84" width="24" height="60" rx="12" transform="rotate(${R ? -42 : 42} ${tx} 140)"/>` +
      `<text x="${mx(51)}" y="120">1</text></g>`;
    s += `<rect class="palm" x="${R ? 64 : 26}" y="90" width="110" height="70" rx="26"/>`;
    s += `<text class="hand-label" x="100" y="172">${R ? 'Right hand' : 'Left hand'}</text>`;
    return s + '</svg>';
  }

  // Keyboard range around a set of notes: start on a white key, show at least an octave.
  function range(midis) {
    let lo = Math.min(...midis) - 2, hi = Math.max(...midis) + 2;
    while (isBlack(lo)) lo--;
    while (isBlack(hi) || hi - lo < 11) hi++;
    while (isBlack(hi)) hi++;
    return [lo, hi];
  }

  // ---------- Positions ----------
  function positionFingers() { return [...new Set(Object.values(pos().keys))]; }
  function newQuiz() {
    const keys = Object.keys(pos().keys).map(Number);
    const prev = quiz;
    let q;
    do {
      const type = Math.random() < 0.5 ? 'k2f' : 'f2k';
      if (type === 'k2f') { const midi = keys[Math.floor(Math.random() * keys.length)]; q = { type, midi, finger: pos().keys[midi] }; }
      else { const fs = positionFingers(); q = { type, finger: fs[Math.floor(Math.random() * fs.length)] }; }
    } while (prev && q.type === prev.type && q.finger === prev.finger && keys.length > 1);
    quiz = { ...q, done: false, first: true, tried: new Set() };
    flash = {};
    setPrompt(quiz.type === 'k2f'
      ? `Which finger plays the highlighted key <b>${nm(quiz.midi)}</b>? Tap a finger or press <kbd>1</kbd>–<kbd>5</kbd>.`
      : `Where does finger <b>${quiz.finger}</b> go? Tap the key.`);
    render();
  }
  function recordQuiz(correct) {
    const s = state.stats[pos().id] || (state.stats[pos().id] = { r: 0, t: 0 });
    s.t++; if (correct) s.r++;
    session.total++;
    if (correct) { session.right++; session.streak++; } else session.streak = 0;
    save();
  }
  function quizAnswer(kind, value) {
    if (!quiz || quiz.done) return;
    const P = pos().keys;
    let correct, label;
    if (quiz.type === 'k2f') {
      if (kind !== 'finger') return;
      correct = value === quiz.finger; label = `finger ${value}`;
    } else {
      if (kind !== 'key') return;
      correct = P[value] === quiz.finger; label = noteLabel(value);
      playNote(value, 0, 1.0);
    }
    if (quiz.first) { recordQuiz(correct); quiz.first = false; }
    if (correct) {
      quiz.done = true;
      const midi = quiz.type === 'k2f' ? quiz.midi : value;
      if (quiz.type === 'k2f') playNote(midi, 0, 1.0);
      flash = { finger: quiz.finger, fingerCls: 'good', key: midi, keyCls: 'good' };
      setPrompt(`<span class="good">Yes: finger ${quiz.finger} on ${nm(midi)}.</span>`);
      setTimeout(() => { if (quiz && quiz.done && state.tab === 'positions') newQuiz(); }, 1100);
    } else {
      quiz.tried.add(value);
      flash = kind === 'finger' ? { finger: value, fingerCls: 'bad' } : { key: value, keyCls: 'bad' };
      setPrompt(`<span class="bad">Not ${label}.</span> ${pos().tip}`);
    }
    render();
  }
  const noteLabel = m => nm(m);

  // Study mode: tapping shows the pairing
  function studyTap(kind, value) {
    const P = pos().keys;
    if (kind === 'key') {
      playNote(value, 0, 1.0);
      flash = P[value] ? { finger: P[value], fingerCls: 'hi', key: value, keyCls: 'hi' } : { key: value, keyCls: 'hi' };
      setPrompt(P[value] ? `${nm(value)} → finger <b>${P[value]}</b>` : `${nm(value)} isn't part of this position.`);
    } else {
      const midis = Object.keys(P).map(Number).filter(m => P[m] === value);
      if (midis.length) {
        playNote(midis[0], 0, 1.0);
        flash = { finger: value, fingerCls: 'hi', keys: midis, keyCls: 'hi' };
        setPrompt(`Finger <b>${value}</b> → ${midis.map(nm).join(' or ')}`);
      } else {
        flash = { finger: value, fingerCls: 'hi' };
        setPrompt(`Finger ${value} isn't used in this position. Let it rest.`);
      }
    }
    render();
  }

  // ---------- Exercises ----------
  function stopWatch() { if (watch) { clearTimeout(watch.timer); watch = null; } }
  function startWatch() {
    stopRun(); stopWatch(); silence();
    const notes = ex().notes, beat = 60 / state.tempo;
    watch = { i: 0, timer: null };
    setPrompt('Watch the hand and listen. No piano yet? Tap the glowing finger on a table.');
    const step = () => {
      if (!watch) return;
      if (watch.i >= notes.length) { watch = null; setPrompt('Done. Press <b>Practice</b> to try it yourself.'); render(); return; }
      playNote(notes[watch.i][0], 0, Math.max(0.5, beat * 1.2));
      render();
      watch.i++;
      watch.timer = setTimeout(step, beat * 1000);
    };
    step();
  }
  function startRun() {
    stopWatch(); silence();
    run = { i: 0, mistakes: 0, missesHere: 0, start: performance.now(), done: false };
    flash = {};
    setPrompt('Which finger plays the highlighted key? Tap a finger or press <kbd>1</kbd>–<kbd>5</kbd>.');
    render();
  }
  function stopRun() { run = null; }
  function runAnswer(finger) {
    if (!run || run.done) return;
    const [midi, f] = ex().notes[run.i];
    if (finger === f) {
      playNote(midi, 0, 0.9);
      flash = { finger, fingerCls: 'good' };
      run.i++; run.missesHere = 0;
      if (run.i === ex().notes.length) return finishRun();
      setPrompt(`Note ${run.i + 1} of ${ex().notes.length}: which finger?`);
    } else {
      run.mistakes++; run.missesHere++;
      flash = { finger, fingerCls: 'bad' };
      setPrompt(run.missesHere >= 2
        ? `<span class="bad">It's finger ${f}.</span> ${ex().tip}`
        : `<span class="bad">Not finger ${finger}.</span> Try again.`);
    }
    render();
  }
  function finishRun() {
    run.done = true;
    const ms = performance.now() - run.start;
    const b = state.best[ex().id] || (state.best[ex().id] = { ms: 0, runs: 0, clean: 0 });
    b.runs++;
    let record = '';
    if (run.mistakes === 0) {
      b.clean++;
      if (!b.ms || ms < b.ms) { b.ms = Math.round(ms); record = ' New best time!'; }
    }
    save();
    setPrompt(run.mistakes === 0
      ? `<span class="good">Clean run in ${(ms / 1000).toFixed(1)}s.</span>${record} Press <b>Practice</b> again, or turn off finger numbers to test your memory.`
      : `Finished with ${run.mistakes} mistake${run.mistakes > 1 ? 's' : ''} in ${(ms / 1000).toFixed(1)}s. Press <b>Practice</b> to go again.`);
    render();
  }

  // ---------- Rendering ----------
  function setPrompt(html) { $('prompt').innerHTML = html; }

  function render() {
    document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === state.tab)));
    $('posWrap').hidden = state.tab !== 'positions';
    $('exWrap').hidden = state.tab !== 'exercises';
    $('btnQuiz').hidden = state.tab !== 'positions';
    $('btnWatch').hidden = $('btnPractice').hidden = $('tempoWrap').hidden = $('showWrap').hidden = state.tab !== 'exercises';
    $('btnQuiz').textContent = quiz ? 'Stop quiz' : 'Quiz me';
    $('btnWatch').textContent = watch ? 'Stop' : 'Watch';
    state.tab === 'positions' ? renderPositions() : renderExercise();
    renderScore();
  }

  function renderPositions() {
    const P = pos().keys, midis = Object.keys(P).map(Number);
    const [lo, hi] = range(midis);
    const used = positionFingers();
    const dim = [1, 2, 3, 4, 5].filter(f => !used.includes(f));
    let handHi = null;
    if (quiz && quiz.type === 'f2k' && !quiz.done) handHi = quiz.finger;
    $('hand').innerHTML = handSvg(pos().hand, flash.fingerCls === 'hi' ? flash.finger : handHi,
      flash.finger && flash.fingerCls !== 'hi' ? { [flash.finger]: flash.fingerCls } : {}, dim);
    const studying = !quiz;
    $('keyboard').innerHTML = keyboardHtml(lo, hi, {
      cls: m => {
        if (flash.key === m || (flash.keys && flash.keys.includes(m))) return ' ' + flash.keyCls;
        if (quiz && quiz.type === 'k2f' && m === quiz.midi) return ' hi';
        return P[m] ? ' inpos' : '';
      },
      label: m => (studying && P[m] ? `<b class="fnum">${P[m]}</b>${nm(m)}` : m % 12 === 0 ? 'C' + (m / 12 - 1) : ''),
    });
    $('seq').innerHTML = '';
    const s = state.stats[pos().id];
    $('posStats').textContent = s ? `Quiz accuracy for this position: ${Math.round(100 * s.r / s.t)}% (${s.t} answers)` : '';
  }

  function renderExercise() {
    const E = ex(), notes = E.notes;
    const cur = watch ? watch.i : run && !run.done ? run.i : -1;
    const [lo, hi] = range(notes.map(x => x[0]));
    const show = state.showFingers || watch || !run;
    const curFinger = cur >= 0 && cur < notes.length ? notes[cur][1] : null;
    $('hand').innerHTML = handSvg(E.hand, watch ? curFinger : null, flash.finger ? { [flash.finger]: flash.fingerCls } : {});
    const fingerOn = {};
    for (const [m, f] of notes) (fingerOn[m] = fingerOn[m] || new Set()).add(f);
    $('keyboard').innerHTML = keyboardHtml(lo, hi, {
      cls: m => (cur >= 0 && cur < notes.length && notes[cur][0] === m ? ' hi' : fingerOn[m] ? ' inpos' : ''),
      label: m => (fingerOn[m] && show && !run ? `<b class="fnum">${[...fingerOn[m]].join('/')}</b>${nm(m)}` : fingerOn[m] ? nm(m) : ''),
    });
    $('seq').innerHTML = '<div class="seq">' + notes.map(([m, f], i) => {
      const c = i === cur ? ' cur' : (run && i < run.i) || (watch && i < watch.i) ? ' done' : '';
      const fin = show || (run && i < run.i) ? f : '?';
      return `<span class="step${c}"><b>${nm(m)}</b><small>${fin}</small></span>`;
    }).join('') + '</div>' + `<p class="muted tip">${E.tip}</p>`;
    const b = state.best[E.id];
    $('posStats').textContent = b ? `Runs: ${b.runs} · clean: ${b.clean}${b.ms ? ` · best clean time ${(b.ms / 1000).toFixed(1)}s` : ''}` : '';
  }

  function renderScore() {
    $('score').hidden = state.tab !== 'positions' || !session.total;
    $('sScore').textContent = `${session.right} / ${session.total}`;
    $('sStreak').textContent = session.streak;
  }

  function resetUi(msg) {
    stopWatch(); stopRun(); quiz = null; flash = {}; silence();
    setPrompt(msg);
  }
  const intro = () => (state.tab === 'positions'
    ? `${pos().tip} Tap keys or fingers to explore, then press <b>Quiz me</b>.`
    : 'Press <b>Watch</b> to see and hear it, then <b>Practice</b> to name each finger yourself.');

  // ---------- Events ----------
  $('posSel').innerHTML = POSITIONS.map((p, i) => `<option value="${i}">${p.name}</option>`).join('');
  $('exSel').innerHTML = EXERCISES.map((e, i) => `<option value="${i}">${e.name}</option>`).join('');
  $('tempo').innerHTML = TEMPOS.map(t => `<option value="${t}">${t} BPM${t === 40 ? ' (very slow)' : t === 60 ? ' (slow)' : ''}</option>`).join('');
  $('posSel').value = state.pos; $('exSel').value = state.ex; $('tempo').value = state.tempo;
  $('optShow').checked = state.showFingers;

  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    state.tab = t.dataset.tab; save(); resetUi(intro()); render();
  }));
  $('posSel').addEventListener('change', e => { state.pos = +e.target.value; save(); resetUi(intro()); render(); });
  $('exSel').addEventListener('change', e => { state.ex = +e.target.value; save(); resetUi(intro()); render(); });
  $('tempo').addEventListener('change', e => { state.tempo = +e.target.value; save(); });
  $('optShow').addEventListener('change', e => { state.showFingers = e.target.checked; save(); render(); });
  $('btnQuiz').addEventListener('click', () => { ensure(); if (quiz) { resetUi(intro()); render(); } else newQuiz(); });
  $('btnWatch').addEventListener('click', () => { ensure(); if (watch) { stopWatch(); render(); } else startWatch(); });
  $('btnPractice').addEventListener('click', () => { ensure(); startRun(); });

  function fingerInput(f) {
    ensure();
    if (state.tab === 'positions') { quiz ? quizAnswer('finger', f) : studyTap('finger', f); }
    else if (run) runAnswer(f);
    else { // explore: show which notes this finger plays in the exercise
      const ms = [...new Set(ex().notes.filter(x => x[1] === f).map(x => x[0]))];
      flash = { finger: f, fingerCls: 'good' };
      if (ms.length) playNote(ms[0], 0, 0.9);
      setPrompt(ms.length ? `In this exercise, finger <b>${f}</b> plays ${ms.map(nm).join(', ')}.` : `Finger ${f} isn't used in this exercise.`);
      render();
    }
  }
  $('hand').addEventListener('click', e => {
    const g = e.target.closest('[data-finger]');
    if (g) fingerInput(+g.dataset.finger);
  });
  $('keyboard').addEventListener('click', e => {
    const b = e.target.closest('[data-key]');
    if (!b) return;
    const m = +b.dataset.key;
    ensure();
    if (state.tab === 'positions') { quiz ? quizAnswer('key', m) : studyTap('key', m); }
    else playNote(m, 0, 0.9);
  });
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target.matches && e.target.matches('select, input, textarea'))) return;
    if (/^[1-5]$/.test(e.key)) { fingerInput(+e.key); return; }
    if (e.key === ' ') { e.preventDefault(); state.tab === 'exercises' ? $('btnWatch').click() : $('btnQuiz').click(); }
    if (e.key === 'Enter') { e.preventDefault(); state.tab === 'exercises' ? $('btnPractice').click() : (quiz ? newQuiz() : $('btnQuiz').click()); }
  });

  setPrompt(intro());
  render();
})();
