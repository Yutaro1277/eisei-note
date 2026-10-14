const CACHE="eisei-note-v3";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","questions.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET")return;
  const url=new URL(req.url); if(url.origin!==location.origin)return;
  // network-first for everything same-origin (questions/app updates), cache fallback for offline
  e.respondWith(fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req.url.split("?")[0]===req.url?req:new Request(url.origin+url.pathname),cp))}return res})
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
});
