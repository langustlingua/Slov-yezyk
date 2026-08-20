// Офлайн-кэш приложения. Меняй CACHE при обновлении файлов, чтобы телефон забрал новую версию.
const CACHE = 'slovencina-v1';
const FILES = ["index.html", "grammar.html", "urok1.html", "urok2.html", "urok3.html", "urok4.html", "urok5.html", "icon-192.png", "icon-512.png", "manifest.json"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
