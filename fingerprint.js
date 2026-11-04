// Browser fingerprinting demo. Everything here runs locally: this module makes
// no network requests and uses no cookies or browser storage.

export const AUDIO_SETTINGS = {
  sampleRate: 44100, length: 5000, windowStart: 4500,
  oscillator: { type: 'triangle', frequency: 10000 },
  compressor: { threshold: -50, knee: 40, ratio: 12, attack: 0, release: 0.25 },
};

// An API that is missing or refuses to work, with a message fit to show on the page.
class Unavailable extends Error {}

export async function sha256(text) {
  const subtle = globalThis.crypto && crypto.subtle;
  if (!subtle) return null; // Only exposed on HTTPS and localhost.
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

// ---- Audio -----------------------------------------------------------------

// Renders into memory with OfflineAudioContext, so no sound is played, no device
// is opened and the result does not depend on timing, unlike a live AudioContext.
export function renderAudio() {
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!Ctx) throw new Unavailable('This browser has no OfflineAudioContext.');
  const { sampleRate, length, oscillator: o, compressor: c } = AUDIO_SETTINGS;
  return new Promise((resolve, reject) => {
    const ctx = new Ctx(1, length, sampleRate);
    const osc = ctx.createOscillator();
    osc.type = o.type;
    osc.frequency.value = o.frequency;
    const comp = ctx.createDynamicsCompressor();
    for (const key of Object.keys(c)) comp[key].value = c[key];
    osc.connect(comp);
    comp.connect(ctx.destination);
    osc.start(0);
    const timer = setTimeout(() => reject(new Unavailable('Audio rendering did not finish within 5 seconds.')), 5000);
    ctx.oncomplete = e => { clearTimeout(timer); resolve(e.renderedBuffer.getChannelData(0).slice()); };
    const rendering = ctx.startRendering(); // Older Safari returns undefined here.
    if (rendering && rendering.catch) rendering.catch(err => { clearTimeout(timer); reject(err); });
  });
}

const audioWindow = samples => samples.subarray(AUDIO_SETTINGS.windowStart);
const samplesToString = samples => Array.from(samples, String).join(',');

async function readAudio() {
  const first = await renderAudio();
  const second = await renderAudio();
  const hashed = audioWindow(first);
  let min = Infinity, max = -Infinity, sum = 0;
  for (const v of hashed) { if (v < min) min = v; if (v > max) max = v; sum += Math.abs(v); }
  const raw = samplesToString(hashed);
  const identical = raw === samplesToString(audioWindow(second));
  const flat = Math.abs(max - min) < 1e-6;
  const result = {
    status: 'ok', raw,
    value: `Sum of ${hashed.length} rendered samples: ${sum}`,
    detail: { samples: first, windowSamples: hashed, min, max, sum, flat, identical },
  };
  if (flat) {
    result.status = 'blocked';
    result.note = 'The rendered audio came back flat, so the browser appears to be blocking this.';
  } else if (!identical) {
    result.status = 'randomized';
    result.note = 'Two renders in a row gave different samples. The browser is probably adding noise on purpose.';
  }
  return result;
}

export async function getAudioFingerprint() {
  const hash = await sha256(samplesToString(audioWindow(await renderAudio())));
  if (!hash) throw new Unavailable('SHA-256 needs HTTPS or localhost.');
  return hash;
}

// ---- Canvas ----------------------------------------------------------------

function drawCanvas() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Unavailable('This browser did not provide a 2D canvas.');
  canvas.width = 200;
  canvas.height = 50;
  ctx.textBaseline = 'top';
  ctx.font = '16px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(0, 0, 200, 50);
  ctx.fillStyle = '#069';
  ctx.fillText('Hello, canvas fingerprint!', 2, 15);
  return { canvas, ctx };
}

function rollingHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export function getCanvasFingerprint() {
  return rollingHash(drawCanvas().canvas.toDataURL());
}

function readCanvas() {
  const { canvas } = drawCanvas();
  const raw = canvas.toDataURL();
  const identical = raw === drawCanvas().canvas.toDataURL();
  // The bottom band has no text, so every pixel should be exactly the fill colour.
  const band = drawCanvas().ctx.getImageData(0, 40, 200, 10).data;
  let wrongPixels = 0;
  for (let i = 0; i < band.length; i += 4) {
    if (band[i] !== 255 || band[i + 1] !== 102 || band[i + 2] !== 0) wrongPixels++;
  }
  const bandPixels = band.length / 4;
  const result = {
    status: 'ok', raw,
    value: `32-bit hash of the image: ${rollingHash(raw)}`,
    detail: { canvas, identical, wrongPixels, bandPixels, legacyHash: rollingHash(raw) },
  };
  if (wrongPixels === bandPixels) {
    result.status = 'blocked';
    result.note = 'The image read back does not match what was drawn, so the browser appears to be blocking or replacing it.';
  } else if (!identical) {
    result.status = 'randomized';
    result.note = 'Two reads of the same drawing differ. The browser is probably adding noise on purpose.';
  } else if (wrongPixels > 0) {
    result.status = 'randomized';
    result.note = `${wrongPixels} pixels of a solid colour area came back changed. The browser is probably adding noise on purpose.`;
  }
  return result;
}

// ---- Passive signals -------------------------------------------------------

function readWebGL() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) throw new Unavailable('WebGL is missing or turned off in this browser.');
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const detail = {
    version: gl.getParameter(gl.VERSION),
    shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    vendor: gl.getParameter(gl.VENDOR),
    renderer: gl.getParameter(gl.RENDERER),
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    debugInfoExtension: Boolean(info),
    unmaskedVendor: info ? gl.getParameter(info.UNMASKED_VENDOR_WEBGL) : null,
    unmaskedRenderer: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : null,
  };
  const lose = gl.getExtension('WEBGL_lose_context');
  if (lose) lose.loseContext(); // Browsers cap live WebGL contexts; repeat runs add up.
  const value = `${detail.unmaskedVendor || detail.vendor} / ${detail.unmaskedRenderer || detail.renderer}`;
  const result = { status: 'ok', raw: value, value, detail };
  if (!info) result.note = 'The browser hides the detailed GPU name, so this is the generic value it chooses to report.';
  return result;
}

function readScreen() {
  const { width, height, colorDepth, availWidth, availHeight } = window.screen;
  if (!width || !height) throw new Unavailable('This browser did not report a screen size.');
  const ratio = window.devicePixelRatio;
  const value = `${width} × ${height}, ${colorDepth}-bit colour, pixel ratio ${ratio}`;
  return {
    status: 'ok', raw: value, value,
    detail: { width, height, colorDepth, availWidth, availHeight, devicePixelRatio: ratio,
      innerWidth: window.innerWidth, innerHeight: window.innerHeight },
  };
}

function formatOffset(minutesBehindUtc) {
  const total = -minutesBehindUtc;
  const pad = n => String(Math.floor(Math.abs(n))).padStart(2, '0');
  return `UTC${total < 0 ? '−' : '+'}${pad(total / 60)}:${pad(total % 60)}`;
}

function readTimezone() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!zone) throw new Unavailable('This browser did not report a time zone.');
  const offset = new Date().getTimezoneOffset();
  const result = {
    status: 'ok',
    raw: zone, // The name, not the offset, so daylight saving does not change the hash.
    value: `${zone} (${formatOffset(offset)} now)`,
    detail: { zone, offsetMinutes: offset },
  };
  if (zone === 'UTC' || zone === 'Etc/UTC') {
    result.note = 'UTC may be your real setting, or a browser hiding it. Tor Browser and Firefox resistFingerprinting both report UTC.';
  }
  return result;
}

function readLanguage() {
  const nav = window.navigator;
  const list = nav.languages && nav.languages.length ? Array.from(nav.languages) : (nav.language ? [nav.language] : []);
  if (!list.length) throw new Unavailable('This browser did not report a language.');
  const value = list.join(', ');
  return { status: 'ok', raw: value, value, detail: { language: nav.language, languages: list } };
}

function readConcurrency() {
  const cores = window.navigator.hardwareConcurrency;
  if (typeof cores !== 'number') throw new Unavailable('This browser does not expose hardwareConcurrency.');
  return { status: 'ok', raw: String(cores), value: `${cores} logical processors`, detail: { hardwareConcurrency: cores } };
}

export const FONTS = [
  'Arial', 'Arial Black', 'Avenir Next', 'Calibri', 'Cambria', 'Candara', 'Cantarell', 'Comic Sans MS',
  'Consolas', 'Courier New', 'DejaVu Sans', 'Fira Code', 'Futura', 'Georgia', 'Gill Sans', 'Helvetica',
  'Helvetica Neue', 'Hiragino Sans', 'Impact', 'Liberation Sans', 'Lucida Grande', 'Menlo', 'Microsoft YaHei',
  'Monaco', 'Noto Sans', 'Optima', 'Palatino', 'Roboto', 'Segoe UI', 'Source Code Pro', 'Tahoma',
  'Times New Roman', 'Trebuchet MS', 'Ubuntu', 'Verdana',
];

// Text is measured in each named font with a generic fallback. A font that is
// missing measures exactly like the fallback; one that is installed does not.
function readFonts() {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) throw new Unavailable('Fonts are measured on a 2D canvas, which this browser did not provide.');
  const sample = 'mmmmmmmmlliWW@#0';
  const measure = font => { ctx.font = font; return ctx.measureText(sample).width; };
  const generics = ['monospace', 'serif', 'sans-serif'];
  const baseline = generics.map(g => measure(`72px ${g}`));
  const present = name => generics.some((g, i) => measure(`72px "${name}", ${g}`) !== baseline[i]);
  const found = FONTS.filter(present);
  const raw = found.join(', ');
  return {
    status: 'ok', raw,
    value: found.length ? `${found.length} of ${FONTS.length} tested: ${raw}` : `None of the ${FONTS.length} tested fonts were detected.`,
    detail: { found, missing: FONTS.filter(f => !found.includes(f)), baseline: Object.fromEntries(generics.map((g, i) => [g, baseline[i]])), controlFontDetected: present('No Such Font 7f3a') },
  };
}

// ---- The signal list -------------------------------------------------------

export const SIGNALS = [
  { id: 'audio', name: 'Audio', read: readAudio,
    what: 'A short tone is calculated in memory and run through a compressor. No sound plays and the microphone is not used.',
    why: 'Tiny floating-point differences come from the browser’s audio code, the operating system and the CPU.' },
  { id: 'canvas', name: 'Canvas', read: readCanvas,
    what: 'A line of text is drawn on a hidden canvas and its exact pixels are read back.',
    why: 'Fonts, text smoothing, the operating system and the graphics stack all change the pixels slightly.' },
  { id: 'webgl', name: 'WebGL renderer', read: readWebGL,
    what: 'The graphics hardware name that the browser reports to 3D web content.',
    why: 'It depends on your GPU and driver, and some browsers report it in more detail than others.' },
  { id: 'screen', name: 'Screen', read: readScreen,
    what: 'Screen size, colour depth and how many device pixels make up one CSS pixel.',
    why: 'Displays and scaling settings vary, and the value changes when you move to another monitor.' },
  { id: 'timezone', name: 'Time zone', read: readTimezone,
    what: 'The time zone name your system is set to.',
    why: 'It narrows down where you are, and changes when you travel and update your clock.' },
  { id: 'language', name: 'Language', read: readLanguage,
    what: 'The languages your browser prefers, in order.',
    why: 'The combination and the order are personal settings, and unusual mixes stand out.' },
  { id: 'cores', name: 'Hardware concurrency', read: readConcurrency,
    what: 'How many logical CPU processors the browser reports.',
    why: 'It differs between device models, though many devices share the same number.' },
  { id: 'fonts', name: 'Fonts by measurement', read: readFonts,
    what: 'Text is measured in common font names to see which ones change its width. No list of fonts is requested.',
    why: 'Operating systems ship different fonts, and installed apps add more.' },
];

// One signal failing never affects the others.
export async function readSignal(signal) {
  let result;
  try {
    result = await signal.read();
  } catch (err) {
    result = {
      status: 'unavailable', raw: 'unavailable', value: 'Not available',
      note: err instanceof Unavailable ? err.message : 'This browser does not support this, or blocked it.',
      error: String(err),
    };
  }
  result.hash = result.status === 'unavailable' ? null : await sha256(result.raw).catch(() => null);
  return result;
}

// results: { signalId: result }. Hashes every signal's raw value together, naming
// missing ones, so the result is reproducible for the same set of values.
export function combineResults(results) {
  const ids = SIGNALS.map(s => s.id);
  if (ids.every(id => results[id].status === 'unavailable')) return Promise.resolve(null);
  return sha256(ids.map(id => `${id}=${results[id].raw}`).join('\n')).catch(() => null);
}

export async function getCombinedFingerprint() {
  const audio = await getAudioFingerprint();
  const canvas = getCanvasFingerprint();
  return { audio, canvas, combined: audio + '_' + canvas };
}

// ---- Clipboard -------------------------------------------------------------

// Returns true if the text reached the clipboard by either route.
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch { /* Missing or refused: try the older route. */ }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
  const previous = document.activeElement;
  document.body.append(area);
  area.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  area.remove();
  if (previous && previous.focus) previous.focus();
  return copied;
}
