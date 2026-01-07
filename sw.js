const CACHE_NAME = "muhur-v2";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/js/swisseph.js",
  "/js/panchang-engine.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/swisseph.wasm"
];

const DYNAMIC_CACHE = "muhur-dynamic-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key=>{if(key!==CACHE_NAME && key!==DYNAMIC_CACHE) return caches.delete(key)}))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if(url.pathname.endsWith(".wasm") || url.pathname.includes("/ephe/")){
    event.respondWith(fetch(event.request));
    return;
  }

  if(event.request.url.endsWith(".pdf") || event.request.url.endsWith(".png")){
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache=>
        fetch(event.request).then(response=>{cache.put(event.request,response.clone()); return response})
        .catch(()=>caches.match(event.request))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>{
      return cached || fetch(event.request).then(response=>{
        if(event.request.method==="GET" && response.status===200 && response.type==="basic"){
          caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone()));
        }
        return response;
      });
    }).catch(()=>{
      if(event.request.mode==="navigate") return caches.match("/index.html");
    })
  );
});
