const CACHE_NAME = "muhur-v3";
const STATIC = [
  "/muhur/",
  "/muhur/index.html",
  "/muhur/js/swisseph.js",
  "/muhur/js/panchang-engine.js",
  "/muhur/manifest.json"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(STATIC)));
});

self.addEventListener("fetch", e=>{
  if(e.request.url.endsWith(".wasm") || e.request.url.includes("/ephe/")){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r=>r || fetch(e.request))
  );
});
