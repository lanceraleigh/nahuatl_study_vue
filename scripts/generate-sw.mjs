import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

const root = new URL('../dist/', import.meta.url).pathname;
const base = '/nahuatl_study_vue/';
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(e => e.isDirectory() ? walk(join(dir,e.name)) : [join(dir,e.name)]));
  return files.flat();
}
const files = (await walk(root)).filter(f => !f.endsWith('.map') && !f.endsWith('/sw.js'));
const assets = files.map(f => base + relative(root, f).split(sep).join('/'));
const digest = createHash('sha256');
for (const file of files.sort()) { digest.update(relative(root,file)); digest.update(await readFile(file)); }
const version = digest.digest('hex').slice(0,16);
const sw = `/* Generated at build time; do not edit dist/sw.js */
const CACHE = 'nahuatl-app-${version}';
const BASE = ${JSON.stringify(base)};
const FILES = ${JSON.stringify(assets)};
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // An incomplete download must not be presented as an offline-ready install.
    await cache.addAll(FILES.map(path => new Request(path, {cache: 'reload'})));
    const clients = await self.clients.matchAll({type:'window',includeUncontrolled:true});
    if (!clients.length) await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('nahuatl-app-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(request, {ignoreSearch: request.mode === 'navigate'});
    if (hit) return hit;
    if (request.mode === 'navigate') {
      const shell = await cache.match(BASE + 'index.html');
      if (shell) return shell;
    }
    // Do not cache arbitrary requests, API calls, or failed responses.
    return fetch(request);
  })());
});
`;
await writeFile(join(root,'sw.js'), sw);
console.log(`Offline service worker generated: ${files.length} files, version ${version}`);
