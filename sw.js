/* Service Worker — mạng trước, bộ nhớ đệm dự phòng (mở được khi mất mạng) */
const CACHE = 'trunghieu-v3-1';
const SHELL = [
  './', 'index.html', 'manifest.json', 'favicon.ico',
  'css/app.css', 'css/tinhtien.css', 'css/v3.css',
  'js/tinhtien.js', 'js/app.js', 'js/taichinh.js', 'js/hanhchinh.js', 'js/pwa.js',
  'js/v3/datahub.js', 'js/v3/ai-engine.js', 'js/v3/dashboard.js', 'js/v3/ai-ui.js', 'js/v3/shell.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/logo-copper.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const cdn = /cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(url.hostname);
  if (url.origin !== self.location.origin && !cdn) return; // không chạm Google Sheet / Ollama / API
  e.respondWith(
    fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(m => m || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
