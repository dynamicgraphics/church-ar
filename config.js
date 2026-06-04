/* Shared configuration helpers for the Church AR Wayfinder.
 *
 * A "config" is: { title: string, signs: [ {marker, label, angle, color} ] }
 *   marker : integer 0-63  -> which printed barcode marker this sign is attached to
 *   label  : destination text shown in AR ("Sanctuary", "Restrooms" ...)
 *   angle  : degrees 0-359, direction the arrow points (0 = toward marker top)
 *   color  : hex color of the arrow
 *
 * Config can come from three places, in priority order:
 *   1. the URL hash  (#cfg=<base64 json>)   -> lets you share a complete setup as a link
 *   2. a bundled config.json next to these files (optional, for a fixed install)
 *   3. the browser's localStorage            -> what the editor saves while you work
 */
const ChurchAR = (() => {
  const LS_KEY = 'churchAR.config';

  const DEFAULT = {
    title: 'Our Church',
    site: '',   // full hosted URL of viewer.html, e.g. https://yourchurch.up.railway.app/viewer.html
    signs: [
      { marker: 0, label: 'Sanctuary',  angle: 0,   color: '#1565c0' },
      { marker: 1, label: 'Restrooms',  angle: 270, color: '#2e7d32' },
      { marker: 2, label: 'Nursery',    angle: 90,  color: '#ad1457' },
      { marker: 3, label: 'Fellowship Hall', angle: 180, color: '#ef6c00' }
    ]
  };

  function clean(cfg) {
    if (!cfg || typeof cfg !== 'object') return { ...DEFAULT };
    const signs = Array.isArray(cfg.signs) ? cfg.signs : [];
    return {
      title: String(cfg.title || 'Our Church'),
      site: typeof cfg.site === 'string' ? cfg.site.trim() : '',
      signs: signs
        .filter(s => s && Number.isFinite(+s.marker))
        .map(s => ({
          marker: Math.max(0, Math.min(63, parseInt(s.marker, 10))),
          label: String(s.label || ''),
          angle: ((parseInt(s.angle, 10) || 0) % 360 + 360) % 360,
          color: /^#[0-9a-fA-F]{6}$/.test(s.color) ? s.color : '#1565c0'
        }))
    };
  }

  // base64 <-> JSON that survives URLs and unicode labels
  function encode(cfg) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(clean(cfg)))));
  }
  function decode(b64) {
    try { return clean(JSON.parse(decodeURIComponent(escape(atob(b64))))); }
    catch (e) { return null; }
  }

  function fromHash() {
    const m = location.hash.match(/cfg=([^&]+)/);
    return m ? decode(m[1]) : null;
  }

  function fromLocal() {
    try { return clean(JSON.parse(localStorage.getItem(LS_KEY))); }
    catch (e) { return null; }
  }

  function saveLocal(cfg) {
    localStorage.setItem(LS_KEY, JSON.stringify(clean(cfg)));
  }

  // Try hash, then a bundled config.json, then localStorage, then defaults.
  async function load() {
    const fromUrl = fromHash();
    if (fromUrl) return fromUrl;
    try {
      const res = await fetch('config.json', { cache: 'no-store' });
      if (res.ok) return clean(await res.json());
    } catch (e) { /* no bundled config - fine */ }
    return fromLocal() || { ...DEFAULT };
  }

  // Read a deep-link parameter from anywhere in the URL (query OR hash).
  // Lets a QR code carry ?go=3 even alongside a #cfg=... payload.
  function param(name) {
    const m = location.href.match(new RegExp('[?#&]' + name + '=([^&]+)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  // Build the URL a QR code should point at.
  //   go    : optional marker number to pre-announce a destination
  //   embed : carry the whole setup in the link so it works without a hosted config.json
  function viewerUrl(cfg, opts) {
    opts = opts || {};
    const base = (cfg.site && cfg.site.trim())
      ? cfg.site.trim()
      : (location.href.replace(/[^/]*$/, '') + 'viewer.html');
    let url = base;
    if (opts.go !== null && opts.go !== undefined && opts.go !== '') {
      url += (url.indexOf('?') >= 0 ? '&' : '?') + 'go=' + encodeURIComponent(opts.go);
    }
    if (opts.embed !== false) url += '#cfg=' + encode(cfg);
    return url;
  }

  function viewerLink(cfg) { return viewerUrl(cfg, { embed: true }); }

  return { DEFAULT, clean, encode, decode, fromHash, fromLocal, saveLocal, load,
           param, viewerUrl, viewerLink };
})();
