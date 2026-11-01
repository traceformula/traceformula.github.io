(() => {
  'use strict';
  const { playNote, silence, ensure } = window.PianoAudio;
  const { isBlack, pick, int, storage, keyboardHtml } = window.Drill;

  // ---------- Music data ----------
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const NATURAL_PCS = [0, 2, 4, 5, 7, 9, 11];
  // Spell a MIDI note with sharps (Für Elise uses D♯ and G♯).
  function spell(m) {
    const pc = m % 12, oct = Math.floor(m / 12) - 1;
    let li = NATURAL_PCS.indexOf(pc), sharp = false;
    if (li < 0) { li = NATURAL_PCS.indexOf(pc - 1); sharp = true; }
    const name = LETTERS[li] + (sharp ? '♯' : '');
    return { li, sharp, oct, step: oct * 7 + li, name, full: name + oct };
  }
  const CLEFS = {
    t: { name: 'Treble', bottom: spell(64).step, glyph: '\u{1D11E}', anchor: 2, lines: 'E G B D F', linesM: 'Every Good Boy Does Fine', spaces: 'F A C E', spacesM: 'FACE' },
    b: { name: 'Bass', bottom: spell(43).step, glyph: '\u{1D122}', anchor: 6, lines: 'G B D F A', linesM: 'Good Boys Do Fine Always', spaces: 'A C E G', spacesM: 'All Cows Eat Grass' },
  };
  const naturals = (lo, hi) => { const a = []; for (let m = lo; m <= hi; m++) if (!isBlack(m)) a.push(m); return a; };
  const T = ms => ms.map(m => 't' + m);
  const B = ms => ms.map(m => 'b' + m);
  const LEVELS = [
    { name: '1 · Treble: C D E F G', items: T([60, 62, 64, 65, 67]) },
    { name: '2 · Treble staff', items: T(naturals(64, 77)) },
    { name: '3 · Treble + ledger lines', items: T(naturals(57, 84)) },
    { name: '4 · Bass: C D E F G', items: B([48, 50, 52, 53, 55]) },
    { name: '5 · Bass staff', items: B(naturals(43, 57)) },
    { name: '6 · Bass + ledger lines', items: B(naturals(36, 64)) },
    { name: '7 · Both clefs', items: [...T(naturals(60, 79)), ...B(naturals(41, 60))] },
    { name: '8 · Für Elise notes', items: [...T([60, 64, 68, 69, 71, 72, 74, 75, 76]), ...B([40, 45, 52, 56, 57])] },
  ];
  const parse = key => ({ clef: key[0], midi: +key.slice(1) });
  const RECENT_N = 20;
  const LEVEL_UP_ACC = 0.9;
  const FLUENT_MS = 2000;

  // ---------- Persistence (validated: storage is shared across this origin) ----------
  const store = storage('notereader.v1');
  const ALL_KEYS = new Set(LEVELS.flatMap(l => l.items));
  const defaults = () => ({ level: 0, answer: 'letters', auto: true, sound: true, best: 0, stats: {}, recent: {} });
  function load() {
    const d = defaults();
    const s = store.load();
    if (!s || typeof s !== 'object') return d;
    d.level = int(s.level, 0, LEVELS.length - 1, 0);
    d.answer = s.answer === 'keys' ? 'keys' : 'letters';
    d.auto = s.auto !== false;
    d.sound = s.sound !== false;
    d.best = int(s.best, 0, 1e9, 0);
    for (const [k, v] of Object.entries(s.stats || {})) {
      if (!ALL_KEYS.has(k) || !v) continue;
      const t = int(v.t, 0, 1e9, 0);
      d.stats[k] = { t, r: int(v.r, 0, t, 0), ms: int(v.ms, 0, 600000, 0) };
    }
    for (const [k, arr] of Object.entries(s.recent || {})) {
      if (/^\d$/.test(k) && Array.isArray(arr)) d.recent[k] = arr.slice(-RECENT_N).map(x => (x === 1 ? 1 : 0));
    }
    return d;
  }
  const state = load();
  const save = () => store.save(state);
  const session = { right: 0, total: 0, streak: 0, times: [] };
  let q = null;
  let autoTimer = null;

  // ---------- Helpers ----------
  const $ = id => document.getElementById(id);
  const level = () => LEVELS[state.level];
  const acc = key => {
    const s = state.stats[key];
    if (!s || !s.t) return 0.5;
    // Slow answers count as partly weak, so they come up more often too.
    const slow = s.ms > FLUENT_MS ? Math.min(0.3, (s.ms - FLUENT_MS) / 10000) : 0;
    return Math.max(0, s.r / s.t - slow);
  };
  const fmtS = ms => (ms / 1000).toFixed(1) + 's';

  // Where the note sits, in words, plus the mnemonic that helps.
  function describe(key) {
    const { clef, midi } = parse(key);
    const c = CLEFS[clef], sp = spell(midi);
    const pos = sp.step - c.bottom;
    const ord = n => ['1st', '2nd', '3rd', '4th', '5th'][n - 1];
    if (pos >= 0 && pos <= 8) {
      if (pos % 2 === 0) return `${ord(pos / 2 + 1)} line from the bottom of the ${c.name.toLowerCase()} staff. Lines: ${c.lines}, “${c.linesM}”.`;
      return `${ord((pos + 1) / 2)} space from the bottom of the ${c.name.toLowerCase()} staff. Spaces: ${c.spaces}, “${c.spacesM}”.`;
    }
    const below = pos < 0;
    const where = below ? 'below' : 'above';
    const out = below ? -pos : pos - 8; // steps outside the staff
    const extra = midi === 60 ? ' This is middle C.' : '';
    if (out % 2 === 0) return `On the ${ord(out / 2)} ledger line ${where} the staff.${extra}`;
    const n = (out - 1) / 2; // ledger lines between the staff and the note
    if (n === 0) return `In the space just ${where} the staff.${extra}`;
    return `Just ${where} the ${ord(n)} ledger line ${where} the staff.${extra}`;
  }

  // ---------- Staff drawing ----------
  function staffSvg(key, status) {
    const { clef, midi } = parse(key);
    const c = CLEFS[clef], sp = spell(midi);
    const H = 7, bottomY = 150, W = 360, X = 210;
    const y = step => bottomY - (step - c.bottom) * H;
    let s = `<svg class="staff${status ? ' ' + status : ''}" viewBox="0 48 ${W} 146" role="img" aria-label="A note on the ${c.name.toLowerCase()} staff">`;
    for (let i = 0; i < 5; i++) {
      const ly = y(c.bottom + 2 * i);
      s += `<line class="line" x1="10" x2="${W - 10}" y1="${ly}" y2="${ly}"/>`;
    }
    const ay = y(c.bottom + c.anchor);
    s += clef === 't'
      ? `<text class="clef" x="18" y="${ay + 14}" font-size="62">${c.glyph}</text>`
      : `<text class="clef" x="18" y="${ay + 42}" font-size="60">${c.glyph}</text>`;
    const pos = sp.step - c.bottom;
    for (let p = -2; p >= pos; p -= 2) s += `<line class="line" x1="${X - 17}" x2="${X + 17}" y1="${y(c.bottom + p)}" y2="${y(c.bottom + p)}"/>`;
    for (let p = 10; p <= pos; p += 2) s += `<line class="line" x1="${X - 17}" x2="${X + 17}" y1="${y(c.bottom + p)}" y2="${y(c.bottom + p)}"/>`;
    const ny = y(sp.step);
    if (sp.sharp) s += `<text class="acc" x="${X - 34}" y="${ny + 9}">♯</text>`;
    s += `<ellipse class="head" cx="${X}" cy="${ny}" rx="9" ry="6.2" transform="rotate(-20 ${X} ${ny})"/>`;
    return s + '</svg>';
  }

  // ---------- Questions ----------
  function newQuestion() {
    clearTimeout(autoTimer);
    const key = pick(level().items, acc, q ? q.key : null);
    q = { key, ...parse(key), sp: spell(parse(key).midi), start: performance.now(), done: false, first: true, tried: new Set() };
    setPrompt(state.answer === 'letters' ? 'Which note is this?' : 'Find this note on the piano. The octave counts.');
    render();
  }

  function record(correct, ms) {
    const s = state.stats[q.key] || (state.stats[q.key] = { r: 0, t: 0, ms: 0 });
    s.t++;
    if (correct) {
      s.r++;
      s.ms = s.ms ? Math.round(s.ms * 0.7 + ms * 0.3) : Math.round(ms);
      session.times.push(ms);
    }
    const rec = state.recent[state.level] || (state.recent[state.level] = []);
    rec.push(correct ? 1 : 0);
    if (rec.length > RECENT_N) rec.shift();
    session.total++;
    if (correct) { session.right++; session.streak++; state.best = Math.max(state.best, session.streak); }
    else session.streak = 0;
    save();
  }

  // ans: a letter name ('D♯') in letters mode, or a midi number in keys mode
  function answer(ans) {
    if (!q || q.done) return;
    const ms = performance.now() - q.start;
    const correct = state.answer === 'letters' ? ans === q.sp.name : ans === q.midi;
    if (q.first) { record(correct, ms); q.first = false; }
    if (state.answer === 'keys' && state.sound) { ensure(); silence(); playNote(ans); }
    if (correct) {
      q.done = true;
      if (state.sound && state.answer === 'letters') { ensure(); silence(); playNote(q.midi); }
      const speed = q.tried.size ? '' : ` <span class="muted">${fmtS(ms)}${ms <= FLUENT_MS ? ', fluent' : ''}</span>`;
      setPrompt(`<span class="good">${q.sp.full}</span>${speed}`);
      if (state.auto) autoTimer = setTimeout(newQuestion, q.tried.size ? 2200 : 900);
    } else {
      q.tried.add(ans);
      const said = state.answer === 'letters' ? ans : spell(ans).full;
      const hint = state.answer === 'keys' && spell(ans).name === q.sp.name
        ? 'Right letter, wrong octave.'
        : describe(q.key);
      setPrompt(`<span class="bad">Not ${said}.</span> ${hint}`);
    }
    render();
  }

  // ---------- Rendering ----------
  function setPrompt(html) { $('prompt').innerHTML = html; }

  function keyboardRange() {
    const ms = level().items.map(k => parse(k).midi);
    let lo = Math.min(...ms), hi = Math.max(...ms);
    while (isBlack(lo) || lo % 12 !== 0 && hi - lo < 11) lo--; // start on C when the range is small
    while (isBlack(hi) || (hi % 12 !== 11 && hi - lo < 11)) hi++; // show at least an octave
    return [lo, hi];
  }

  function render() {
    const status = !q ? '' : q.done ? (q.tried.size ? '' : 'good') : q.tried.size ? 'bad' : '';
    $('staff').innerHTML = q ? staffSvg(q.key, status) : '';

    // Letter buttons: only the names used in this level
    if (state.answer === 'letters') {
      const names = [...new Set(level().items.map(k => spell(parse(k).midi).name))]
        .sort((a, b) => spell(nameToMidi(a)).step * 2 + (a.length > 1) - (spell(nameToMidi(b)).step * 2 + (b.length > 1)));
      $('letters').innerHTML = '<div class="letters">' + names.map(n => {
        const c = q && q.done && n === q.sp.name ? ' good' : q && q.tried.has(n) ? ' bad' : '';
        const hot = n.length > 1 ? `⇧${n[0]}` : n;
        return `<button class="ans${c}" data-name="${n}"><b>${n}</b><kbd>${hot}</kbd></button>`;
      }).join('') + '</div>';
    } else $('letters').innerHTML = '';

    // Keyboard: interactive in keys mode, display-only (shows the answer) in letters mode
    const [lo, hi] = keyboardRange();
    const show = q && q.done;
    $('keyboard').innerHTML = keyboardHtml(lo, hi, {
      display: state.answer === 'letters',
      cls: m => (!q ? '' : show && m === q.midi ? ' good' : q.tried.has(m) ? ' bad' : ''),
      label: m => (show && m === q.midi ? spell(m).full : m % 12 === 0 ? 'C' + (m / 12 - 1) : ''),
    });

    document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.answer === state.answer)));
    renderScore(); renderStats(); checkLevelUp();
  }
  const nameToMidi = n => 60 + NATURAL_PCS[LETTERS.indexOf(n[0])] + (n.length > 1 ? 1 : 0);

  function renderScore() {
    $('sScore').textContent = `${session.right} / ${session.total}`;
    $('sStreak').textContent = session.streak;
    $('sBest').textContent = state.best;
    const t = session.times.slice(-10);
    $('sTime').textContent = t.length ? fmtS(t.reduce((a, b) => a + b, 0) / t.length) : '–';
  }

  function renderStats() {
    const rec = state.recent[state.level] || [];
    const recAcc = rec.length ? Math.round(100 * rec.reduce((a, b) => a + b, 0) / rec.length) : null;
    let html = `<p class="muted">This level, last ${rec.length} answers: <b>${recAcc === null ? '–' : recAcc + '%'}</b>. Darker means stronger: accurate <i>and</i> fast.</p><div class="chips">`;
    for (const key of level().items) {
      const { clef, midi } = parse(key);
      const s = state.stats[key];
      const pct = s && s.t ? Math.round(100 * s.r / s.t) : 0;
      const strength = s && s.t ? acc(key) * Math.min(1, s.t / 5) : 0;
      const clefTag = level().items.some(k => k[0] !== clef) ? ` <small>${CLEFS[clef].name[0]}</small>` : '';
      html += `<div class="chip" style="--p:${strength.toFixed(2)}"><b>${spell(midi).full}${clefTag}</b><span>${s ? `${pct}% · ${s.ms ? fmtS(s.ms) : '–'}` : 'new'}</span></div>`;
    }
    $('stats').innerHTML = html + '</div>';
  }

  function checkLevelUp() {
    const rec = state.recent[state.level] || [];
    const ok = rec.length >= RECENT_N && rec.reduce((a, b) => a + b, 0) / rec.length >= LEVEL_UP_ACC;
    const b = $('levelUp');
    if (ok && state.level < LEVELS.length - 1) {
      b.innerHTML = `You scored 90% or better on the last ${RECENT_N} notes. Ready for the next level? <button id="btnUp">Go to level ${state.level + 2}</button>`;
      b.hidden = false;
    } else b.hidden = true;
  }

  // ---------- Events ----------
  $('level').innerHTML = LEVELS.map((l, i) => `<option value="${i}">${l.name}</option>`).join('');
  $('level').value = state.level;
  $('optAuto').checked = state.auto;
  $('optSound').checked = state.sound;

  $('level').addEventListener('change', e => { state.level = +e.target.value; save(); q = null; newQuestion(); });
  $('optAuto').addEventListener('change', e => { state.auto = e.target.checked; save(); });
  $('optSound').addEventListener('change', e => { state.sound = e.target.checked; save(); });
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    state.answer = t.dataset.answer; save(); newQuestion();
  }));
  $('btnNext').addEventListener('click', newQuestion);
  $('btnReset').addEventListener('click', () => {
    Object.assign(state, defaults(), { level: state.level, answer: state.answer, auto: state.auto, sound: state.sound });
    save();
    Object.assign(session, { right: 0, total: 0, streak: 0, times: [] });
    render();
  });
  $('letters').addEventListener('click', e => {
    const b = e.target.closest('[data-name]');
    if (b) answer(b.dataset.name);
  });
  $('keyboard').addEventListener('click', e => {
    const b = e.target.closest('[data-key]');
    if (b && !b.disabled && state.answer === 'keys') answer(+b.dataset.key);
  });
  $('levelUp').addEventListener('click', e => {
    if (e.target.id !== 'btnUp') return;
    state.level++; save();
    $('level').value = state.level;
    q = null; newQuestion();
  });
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if ((e.target.matches && e.target.matches('select, input, textarea'))) return;
    if (e.key === 'Enter') { e.preventDefault(); newQuestion(); return; }
    if (state.answer !== 'letters' || !q || q.done) return;
    const L = e.key.toUpperCase();
    if (LETTERS.includes(L)) {
      const name = L + (e.shiftKey ? '♯' : '');
      if ($('letters').querySelector(`[data-name="${name}"]`)) answer(name);
    }
  });

  newQuestion();
})();
