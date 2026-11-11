
import { installOfflineSupport } from "./services/offline";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

import { siteLanguageDictionary } from "./services/siteLanguageDictionary.js";
import { useLanguage } from "./composables/useLanguage.js";

const app = createApp(App);

const { t, currentLanguage } = useLanguage();

// Original dictionary remains available
app.config.globalProperties.$siteLanguageDictionary =
  siteLanguageDictionary;

// Global translation function
app.config.globalProperties.$t = t;

// Set the initial document language
document.documentElement.lang = currentLanguage.value;

app.use(router);
app.mount("#app");

installOfflineSupport();
