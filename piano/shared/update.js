// Keeps the tools fresh without a manual refresh:
// 1. registers the network-first service worker (../sw.js, scope /piano/);
// 2. when the page loads or comes back into view, compares its built-in version
//    (<meta name="app-version">, stamped by scripts/deploy.sh) with version.json
//    and reloads once if a newer version is live.
(function () {
  'use strict';
  const here = document.currentScript.src;
  const meta = document.querySelector('meta[name="app-version"]');
  const current = meta ? meta.content : 'dev';
  if (current === 'dev' || location.protocol !== 'https:') return; // local development

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(new URL('../sw.js', here)).catch(() => { /* unsupported or blocked */ });
  }

  const versionUrl = new URL('../version.json', here);
  async function check() {
    try {
      const res = await fetch(versionUrl, { cache: 'no-store' });
      const { version } = await res.json();
      if (typeof version !== 'string' || version === current) return;
      // Reload at most once per version, so a stale cache can never cause a reload loop.
      const key = 'piano.reloadedFor';
      let last = null;
      try { last = sessionStorage.getItem(key); } catch (e) { /* unavailable */ }
      if (last === version) return;
      try { sessionStorage.setItem(key, version); } catch (e) { /* unavailable */ }
      location.reload();
    } catch (e) { /* offline */ }
  }
  check();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
})();
