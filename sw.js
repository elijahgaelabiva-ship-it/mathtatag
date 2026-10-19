// MathBayan offline support. Serves saved copies first, then refreshes them in the background.
// Change the version below whenever files change, so old copies are replaced.
const V="mathbayan-1.2";
const FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "fizzle-fox.webp", "draco-dragon.webp", "astro-fox.webp", "glimmer-dragon.webp", "byte-robot-puppy.webp", "sprinkle-unicorn.webp"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>null)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&r.ok&&new URL(e.request.url).origin===location.origin){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>hit||(e.request.mode==="navigate"?caches.match("index.html"):undefined));
    return hit||net;
  }));
});
