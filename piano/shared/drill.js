// Shared helpers: note names, adaptive picking, safe storage, on-screen keyboard.
(function () {
  'use strict';
  const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const BLACK = new Set([1, 3, 6, 8, 10]);
  const isBlack = m => BLACK.has(((m % 12) + 12) % 12);
  const noteName = m => NAMES[m % 12] + (Math.floor(m / 12) - 1);

  // Weighted random pick: items with low accuracy come up more often.
  // accOf(key) returns 0..1 (0.5 for unseen). Avoids repeating `avoid`.
  function pick(items, accOf, avoid) {
    const pool = items.length > 1 ? items.filter(k => k !== avoid) : items;
    const w = pool.map(k => 1 + 3 * (1 - accOf(k)));
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < pool.length; i++) { r -= w[i]; if (r <= 0) return pool[i]; }
    return pool[pool.length - 1];
  }

  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const int = (v, lo, hi, d) => (Number.isInteger(v) && v >= lo && v <= hi ? v : d);

  // localStorage is shared by every page on this origin; callers must validate what they read.
  function storage(key) {
    return {
      load() { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } },
      save(v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* unavailable */ } },
    };
  }

  // Piano keyboard from midi lo..hi (lo and hi should be white keys).
  // opts: enabled(m) -> bool, cls(m) -> extra class string, label(m) -> text, kbd(m) -> shortcut text, display (non-interactive)
  function keyboardHtml(lo, hi, opts = {}) {
    const enabled = opts.enabled || (() => true);
    const cls = opts.cls || (() => '');
    const label = opts.label || (m => NAMES[m % 12]);
    const kbd = opts.kbd || (() => '');
    let whites = 0;
    for (let m = lo; m <= hi; m++) if (!isBlack(m)) whites++;
    const W = 100 / whites;
    const btn = (m, color, style) => {
      const on = enabled(m);
      const k = kbd(m);
      return `<button class="key ${color}${on ? '' : ' off'}${cls(m)}" data-key="${m}" style="${style}"` +
        `${on && !opts.display ? '' : ' tabindex="-1"'}${on ? '' : ' disabled aria-hidden="true"'}>` +
        `<span>${label(m)}</span>${k ? `<kbd>${k}</kbd>` : ''}</button>`;
    };
    let html = `<div class="keyboard${opts.display ? ' display' : ''}${whites > 14 ? ' dense' : ''}">`;
    let blacks = '';
    let wi = -1;
    for (let m = lo; m <= hi; m++) {
      if (!isBlack(m)) { wi++; html += btn(m, 'white', ''); }
      else blacks += btn(m, 'black', `left:calc(${(wi + 1) * W}% - ${W * 0.3}%);width:${W * 0.6}%`);
    }
    return html + blacks + '</div>';
  }

  window.Drill = { NAMES, isBlack, noteName, pick, rand, int, storage, keyboardHtml };
})();
