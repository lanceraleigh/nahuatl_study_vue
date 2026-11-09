import { ref } from 'vue';

export const offlineReady = ref(false);
export const updateAvailable = ref(false);
export const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);
let registration;
let refreshing = false;

export function installOfflineSupport() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  window.addEventListener('online', () => { isOnline.value = true; registration?.update().catch(console.warn); });
  window.addEventListener('offline', () => { isOnline.value = false; });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {scope: import.meta.env.BASE_URL})
    .then(reg => {
      registration = reg;
      offlineReady.value = Boolean(navigator.serviceWorker.controller || reg.active);
      updateAvailable.value = Boolean(reg.waiting && navigator.serviceWorker.controller);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            if (navigator.serviceWorker.controller) updateAvailable.value = true;
            else offlineReady.value = true;
          }
        });
      });
      const check = () => { if (navigator.onLine) reg.update().catch(console.warn); };
      window.addEventListener('focus', check);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
      check();
    }).catch(err => console.error('Offline installation failed:', err));
}

export function applyUpdate() {
  registration?.waiting?.postMessage({type:'SKIP_WAITING'});
}
