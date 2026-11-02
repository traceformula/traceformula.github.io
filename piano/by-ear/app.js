(() => {
  'use strict';
  const { playNote, silence, ensure } = window.PianoAudio;
  const { NAMES, isBlack, noteName, rand, int, storage, keyboardHtml } = window.Drill;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Songs ----------
  const CATS = { k: "Children's", f: 'Folk & traditional', h: 'Holiday', s: 'Hymns & anthems', c: 'Classical' };
  const LEVEL_NAMES = ['', 'Easy', 'Medium', 'Hard'];
  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  // "F#4:1.5" -> {m: 66, beats: 1.5}; "r:.5" -> {m: null, beats: .5}
  function parse(str) {
    const events = [];
    let t = 0;
    for (const tok of str.trim().split(/\s+/)) {
      const [n, d] = tok.split(':');
      const beats = d ? parseFloat(d) : 1;
      if (n === 'r') { t += beats; continue; }
      const mm = /^([A-G])(#|b)?(\d)$/.exec(n);
      if (!mm || !(beats > 0)) throw new Error('Bad note ' + tok);
      const m = 12 * (+mm[3] + 1) + PC[mm[1]] + (mm[2] === '#' ? 1 : mm[2] === 'b' ? -1 : 0);
      events.push({ m, t, beats });
      t += beats;
    }
    return events;
  }

  // How hard a tune is to find by ear: big leaps, many notes, many different pitches.
  function difficulty(ev) {
    const cost = i => (i === 0 ? 0.3 : i <= 2 ? 1 : i <= 4 ? 1.6 : i <= 7 ? 2.2 : i <= 12 ? 3 : 3.5);
    let sum = 0, maxLeap = 0;
    for (let i = 1; i < ev.length; i++) {
      const d = Math.abs(ev[i].m - ev[i - 1].m);
      sum += cost(d); maxLeap = Math.max(maxLeap, d);
    }
    const distinct = new Set(ev.map(e => e.m)).size;
    return (sum / (ev.length - 1)) * 2 + ev.length / 8 + maxLeap / 6 + distinct / 4;
  }

  const SONGS = window.SONGS.map(([id, title, by, cat, bpm, notes]) => {
    const ev = parse(notes);
    return { id, title, by, cat, bpm, ev, score: difficulty(ev) };
  });
  const BY_ID = Object.fromEntries(SONGS.map(s => [s.id, s]));
  // Split into thirds by difficulty score.
  [...SONGS].sort((a, b) => a.score - b.score).forEach((s, i, arr) => { s.level = 1 + Math.floor((3 * i) / arr.length); });

  // ---------- State ----------
  const store = storage('byear.v1');
  const defaults = () => ({ cat: 'all', diff: 'all', speed: 80, showTitle: true, randomKey: false, stats: {} });
  // stats[id] = [plays, perfect, best mistakes (-1 = never finished)]
  function load() {
    const d = defaults();
    const s = store.load();
    if (!s || typeof s !== 'object') return d;
    if (s.cat === 'all' || Object.prototype.hasOwnProperty.call(CATS, s.cat)) d.cat = s.cat;
    if (['all', '1', '2', '3'].includes(s.diff)) d.diff = s.diff;
    if ([60, 80, 100].includes(s.speed)) d.speed = s.speed;
    if (typeof s.showTitle === 'boolean') d.showTitle = s.showTitle;
    if (typeof s.randomKey === 'boolean') d.randomKey = s.randomKey;
    if (s.stats && typeof s.stats === 'object') {
      for (const id of Object.keys(BY_ID)) {
        const v = s.stats[id];
        if (Array.isArray(v) && v.length === 3) {
          d.stats[id] = [int(v[0], 0, 1e6, 0), int(v[1], 0, 1e6, 0), int(v[2], -1, 1e4, -1)];
        }
      }
    }
    return d;
  }
  const state = load();
  const save = () => store.save(state);
  const session = { done: 0, perfect: 0, streak: 0, recent: [] };

  // Current question
  let q = null;
  let lo = 60, hi = 76, kbBase = 60;

  // ---------- Picking ----------
  function pool() {
    return SONGS.filter(s => (state.cat === 'all' || s.cat === state.cat) && (state.diff === 'all' || s.level === +state.diff));
  }
  function pickSong() {
    const all = pool();
    if (!all.length) return null;
    const fresh = all.filter(s => !session.recent.includes(s.id));
    const items = fresh.length ? fresh : all;
    // Not yet perfect comes up more; never tried a bit more than perfect ones.
    const w = items.map(s => { const st = state.stats[s.id]; return !st ? 2 : st[1] > 0 ? 1 : 3; });
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
    return items[items.length - 1];
  }

  // ---------- Keyboard range ----------
  function rangeFor(notes) {
    const mn = Math.min(...notes), mx = Math.max(...notes);
    let a = mn; while (!(a % 12 === 0 || a % 12 === 5)) a--; // down to a C or F
    let b = mx; while (!(b % 12 === 4 || b % 12 === 11)) b++; // up to an E or B
    while (b - a < 16) { b++; while (!(b % 12 === 4 || b % 12 === 11)) b++; }
    return [a, b];
  }

  // ---------- Questions ----------
  function startSong(song) {
    clearTimers(); silence(); ensure();
    if (!song) { setPrompt('No songs match these filters.'); return; }
    let shift = 0;
    if (state.randomKey) {
      const mn = Math.min(...song.ev.map(e => e.m)), mx = Math.max(...song.ev.map(e => e.m));
      const opts = [];
      for (let s = -6; s <= 6; s++) if (s !== 0 && mn + s >= 48 && mx + s <= 88) opts.push(s);
      if (opts.length) shift = opts[rand(0, opts.length - 1)];
    }
    const ev = song.ev.map(e => ({ ...e, m: e.m + shift }));
    q = { song, ev, pos: 1, mistakes: 0, hints: 0, triesHere: 0, wrong: null, revealed: new Set(), done: false, gaveUp: false, touched: false };
    session.recent.push(song.id);
    if (session.recent.length > Math.min(8, Math.floor(pool().length / 2))) session.recent.shift();
    [lo, hi] = rangeFor(ev.map(e => e.m));
    kbBase = lo - (lo % 12);
    $('btnStart').innerHTML = 'Next song <kbd>Enter</kbd>';
    ['btnReplay', 'btnBit', 'btnHint', 'btnGiveUp'].forEach(id => { $(id).disabled = false; });
    promptQuestion();
    render();
    playFrom(0, ev.length, 0.15);
  }

  function heading() {
    const s = q.song;
    const lvl = `${LEVEL_NAMES[s.level]} · ${q.ev.length} notes`;
    if (state.showTitle || q.done) return `<b>${esc(s.title)}</b> <span class="meta">${esc(s.by)} · ${lvl}</span>`;
    return `<b>Mystery tune</b> <span class="meta">${CATS[s.cat]} · ${lvl}</span>`;
  }
  function promptQuestion(extra) {
    setPrompt(`${heading()}<br>${extra || `The first note is <b>${noteName(q.ev[0].m)}</b>. Play the rest, one note at a time.`}`);
  }
  function setPrompt(html) { $('prompt').innerHTML = html; }

  let timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  const secPerBeat = () => 60 / (q.song.bpm * state.speed / 100);

  // Play notes [from, to) of the current tune, keeping their rhythm.
  function playFrom(from, to, delay) {
    clearTimers(); silence();
    const spb = secPerBeat();
    const t0 = q.ev[from].t;
    const show = q.done; // light up keys only once the answer is known
    q.ev.slice(from, to).forEach(e => {
      const at = delay + (e.t - t0) * spb;
      playNote(e.m, at, Math.min(e.beats * spb + 0.3, 2.2));
      if (show) timers.push(setTimeout(() => flashKey(e.m), at * 1000));
    });
  }
  function flashKey(m) {
    const k = document.querySelector(`#keyboard [data-key="${m}"]`);
    if (!k) return;
    k.classList.add('given');
    setTimeout(() => k.classList.remove('given'), 280);
  }
  // A few notes around where you are: the last correct note plus the next three.
  function playBit() {
    if (!q) return;
    const from = Math.max(0, q.pos - 1);
    playFrom(from, Math.min(q.ev.length, from + 4), 0.05);
  }

  function input(m) {
    ensure();
    if (!q || q.done) { silence(); playNote(m, 0, 1.2); return; }
    clearTimers(); silence();
    playNote(m, 0, 1.0);
    q.touched = true;
    const want = q.ev[q.pos].m;
    if (m === want) {
      q.pos++; q.triesHere = 0; q.wrong = null;
      if (q.pos === q.ev.length) finish();
      else promptQuestion(`Yes, <b>${noteName(m)}</b>. Note ${q.pos + 1} of ${q.ev.length} next.`);
    } else {
      q.mistakes++; q.triesHere++; q.wrong = m;
      if (q.triesHere >= 3) {
        reveal();
        promptQuestion(`<span class="bad">Not ${noteName(m)}.</span> It was <b>${noteName(want)}</b>. Listen and carry on.`);
        playNote(want, 0.9, 1.0);
      } else {
        const dir = m < want ? 'higher' : 'lower';
        promptQuestion(`<span class="bad">Not ${noteName(m)}.</span> The next note is ${q.triesHere >= 2 ? `<b>${dir}</b>` : 'something else'}. Try again or press <b>N</b> to hear this part.`);
      }
    }
    render();
  }

  // Fill in the next note for the player.
  function reveal() {
    q.revealed.add(q.pos);
    q.pos++; q.triesHere = 0; q.wrong = null;
    if (q.pos === q.ev.length) finish();
  }

  function hint() {
    if (!q || q.done) return;
    q.hints++; q.touched = true;
    const m = q.ev[q.pos].m;
    reveal();
    if (!q.done) promptQuestion(`Hint: that note is <b>${noteName(m)}</b>.`);
    silence(); playNote(m, 0, 1.0);
    render();
  }

  function giveUp() {
    if (!q || q.done) return;
    q.gaveUp = true;
    while (q.pos < q.ev.length) q.revealed.add(q.pos++);
    finish();
    render();
  }

  function finish() {
    q.done = true;
    const st = state.stats[q.song.id] || [0, 0, -1];
    const errs = q.mistakes + q.hints;
    session.done++;
    if (q.gaveUp) {
      session.streak = 0;
    } else {
      st[0]++;
      if (errs === 0) { st[1]++; session.perfect++; session.streak++; } else session.streak = 0;
      st[2] = st[2] < 0 ? errs : Math.min(st[2], errs);
    }
    state.stats[q.song.id] = st;
    save();
    const msg = q.gaveUp ? 'Here it is. Listen once more, then try another one.'
      : errs === 0 ? '<span class="good">Perfect, no mistakes!</span>'
      : `<span class="good">Done</span> with ${errs} mistake${errs === 1 ? '' : 's'}${q.hints ? ' (hints count)' : ''}. Play it again later to get it perfect.`;
    setPrompt(`${heading()}<br>${msg} Press <b>Enter</b> for the next song.`);
    $('btnHint').disabled = true; $('btnGiveUp').disabled = true; $('btnBit').disabled = true;
    // Let the last note ring, then play the whole tune with the keys lit.
    clearTimers();
    timers.push(setTimeout(() => { if (q && q.done) playFrom(0, q.ev.length, 0.05); }, 900));
    renderScore(); renderSongs();
  }

  // ---------- Rendering ----------
  const KEYS = ['KeyA', 'KeyW', 'KeyS', 'KeyE', 'KeyD', 'KeyF', 'KeyT', 'KeyG', 'KeyY', 'KeyH', 'KeyU', 'KeyJ', 'KeyK', 'KeyO', 'KeyL', 'KeyP', 'Semicolon'];
  const KEY_LABELS = 'AWSEDFTGYHUJKOLP;';

  function render() {
    if (!q) {
      $('slots').innerHTML = '';
      $('keyboard').innerHTML = keyboardHtml(60, 76, { kbd: m => KEY_LABELS[m - 60] || '' });
      return;
    }
    $('slots').innerHTML = '<div class="slots">' + q.ev.map((e, i) => {
      const n = NAMES[e.m % 12];
      if (i === 0) return `<span class="slot given">${n}</span>`;
      if (i < q.pos) return q.revealed.has(i) ? `<span class="slot hint">${n}</span>` : `<span class="slot filled">${n}</span>`;
      if (i === q.pos && !q.done) return `<span class="slot ${q.wrong !== null ? 'bad' : 'cur'}">?</span>`;
      return '<span class="slot">?</span>';
    }).join('') + '</div>';
    const last = q.pos > 0 ? q.ev[q.pos - 1].m : null;
    $('keyboard').innerHTML = keyboardHtml(lo, hi, {
      cls: m => (m === q.wrong ? ' bad' : !q.done && m === last ? ' given' : ''),
      kbd: m => (m - kbBase >= 0 && m - kbBase < KEY_LABELS.length ? KEY_LABELS[m - kbBase] : ''),
    });
  }

  function renderScore() {
    $('sDone').textContent = session.done;
    $('sPerfect').textContent = session.perfect;
    $('sStreak').textContent = session.streak;
  }

  function renderSongs() {
    const list = pool();
    const perfect = SONGS.filter(s => (state.stats[s.id] || [0, 0])[1] > 0).length;
    $('count').textContent = `${SONGS.length} songs`;
    $('oText').textContent = `Perfect ${perfect} / ${SONGS.length}`;
    $('oBar').style.width = (100 * perfect / SONGS.length) + '%';
    $('songs').innerHTML = list.map(s => {
      const st = state.stats[s.id];
      const cls = !st ? '' : st[1] > 0 ? ' perfect' : ' tried';
      const status = !st ? 'not tried' : st[1] > 0 ? `✓ perfect ×${st[1]}` : st[2] >= 0 ? `best: ${st[2]} mistake${st[2] === 1 ? '' : 's'}` : 'tried';
      return `<button class="song${cls}${q && q.song.id === s.id ? ' cur' : ''}" data-id="${esc(s.id)}">${esc(s.title)}<small>${LEVEL_NAMES[s.level]} · ${status}</small></button>`;
    }).join('') || '<p class="muted">No songs match these filters.</p>';
  }

  function renderOptions() {
    $('cat').value = state.cat;
    $('diff').value = state.diff;
    $('speed').value = String(state.speed);
    $('optTitle').checked = state.showTitle;
    $('optKey').checked = state.randomKey;
  }

  function resetQuestion() {
    clearTimers(); silence(); q = null;
    $('btnStart').innerHTML = 'Start <kbd>Enter</kbd>';
    ['btnReplay', 'btnBit', 'btnHint', 'btnGiveUp'].forEach(id => { $(id).disabled = true; });
    setPrompt(`Press <b>Start</b> to hear a famous tune (${pool().length} songs match). The first note is given; you find the rest.`);
    render(); renderSongs();
  }

  // ---------- Events ----------
  const next = () => startSong(pickSong());
  $('btnStart').addEventListener('click', next);
  $('btnReplay').addEventListener('click', () => { if (q) playFrom(0, q.ev.length, 0.05); });
  $('btnBit').addEventListener('click', playBit);
  $('btnHint').addEventListener('click', hint);
  $('btnGiveUp').addEventListener('click', giveUp);
  $('keyboard').addEventListener('click', e => {
    const b = e.target.closest('[data-key]');
    if (b && !b.disabled) input(+b.dataset.key);
  });
  $('songs').addEventListener('click', e => {
    const b = e.target.closest('[data-id]');
    if (b && BY_ID[b.dataset.id]) startSong(BY_ID[b.dataset.id]);
  });
  $('cat').addEventListener('change', e => { state.cat = e.target.value; save(); resetQuestion(); });
  $('diff').addEventListener('change', e => { state.diff = e.target.value; save(); resetQuestion(); });
  $('speed').addEventListener('change', e => { state.speed = +e.target.value; save(); });
  $('optTitle').addEventListener('change', e => {
    state.showTitle = e.target.checked; save();
    if (q && !q.done) promptQuestion();
  });
  $('optKey').addEventListener('change', e => { state.randomKey = e.target.checked; save(); });
  $('btnReset').addEventListener('click', () => {
    state.stats = {}; save();
    session.done = session.perfect = session.streak = 0;
    renderScore(); renderSongs();
  });
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.matches && e.target.matches('select, input, textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); q ? playFrom(0, q.ev.length, 0.05) : next(); return; }
    if (e.code === 'Enter') { e.preventDefault(); next(); return; }
    if (e.code === 'KeyN') { playBit(); return; }
    if (e.code === 'Slash') { e.preventDefault(); hint(); return; }
    const i = KEYS.indexOf(e.code);
    if (i < 0 || e.repeat) return;
    const m = (q ? kbBase : 60) + i + (e.shiftKey ? 12 : 0);
    if (q && (m < lo || m > hi)) return;
    input(m);
  });

  renderOptions(); renderScore(); resetQuestion();
})();
