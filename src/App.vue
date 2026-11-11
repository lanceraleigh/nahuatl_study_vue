<script setup>
import { offlineReady, updateAvailable, isOnline, applyUpdate } from "./services/offline";
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";

</script>

<template>
  <AppHeader />
  <div class="offline-status" role="status" aria-live="polite">
    <span v-if="!isOnline">{{ $t("install.offlineStatus") }} · {{ offlineReady ? $t("install.offlineAvailable") : $t("install.offlineNotConfirmed") }}</span>
    <span v-else-if="offlineReady">{{ $t("install.offlineAvailable") }}</span>
    <span v-if="updateAvailable" class="offline-update">{{ $t("install.updateAvailable") }} <button type="button" @click="applyUpdate">{{ $t("install.updateNow") }}</button></span>
  </div>
  <main class="app-shell">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped>
.offline-status { display:flex; flex-wrap:wrap; gap: .75rem; align-items:center; justify-content:center; font-size:.8rem; padding:.25rem .75rem; color:#315c49; }
.offline-update { display:inline-flex; gap:.5rem; align-items:center; }
.offline-update button { border:1px solid currentColor; border-radius:.35rem; background:transparent; color:inherit; cursor:pointer; padding:.2rem .5rem; }

:global([data-theme="dark"]) .offline-status { color:var(--accent); }
</style>
