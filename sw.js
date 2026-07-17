/* Service Worker أساسي — الحد الأدنى المطلوب لتفعيل خاصية "تثبيت التطبيق" (PWA)
   لا يقوم بتخزين مؤقت عدواني حتى لا يعرض نسخة قديمة من الموقع أثناء التطوير المستمر. */
const CACHE_NAME = 'cdsa-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* شبكة أولاً، وعند تعذّر الاتصال نرجع لنسخة مخزّنة إن وُجدت (دعم أساسي لوضع عدم الاتصال) */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
