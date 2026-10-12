const CACHE='gunum-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});

// Önce ağ (güncel sürüm), ağ yoksa önbellek: uygulama çevrimdışı da açılır.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok&&new URL(e.request.url).origin===location.origin){const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k))}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():self.clients.openWindow('./')));
});
