<script setup>
import { isDark, toggleTheme } from "../../services/theme";
import LanguageSelector from "./LanguageSelector.vue";

</script>
<template>
  <header class="site-header">
    <RouterLink class="brand" to="/">
      <img 
      src="../../img/IDIEZ_logo_no_text.png" 
      alt="IDIEZ"
      height="30px"
      />
    </RouterLink>
    <nav>
      <RouterLink to="/diccionario">{{ $t("nav.dictionary") }}</RouterLink>
      <!-- <RouterLink to="/traductor-conjugador">Conjugador</RouterLink> -->
      <RouterLink to="/tareas">{{ $t("nav.tasks") }}</RouterLink>
      <!-- <RouterLink to="/cartas">Cartas</RouterLink> -->
      <RouterLink to="/notas">{{ $t("nav.notes") }}</RouterLink>
      <RouterLink to="/instalar">{{ $t("nav.install") }}</RouterLink>
      <LanguageSelector />
      <button type="button" class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? $t('nav.lightTheme') : $t('nav.darkTheme')" :aria-pressed="isDark" :title="isDark ? $t('nav.lightTheme') : $t('nav.darkTheme')">{{ isDark ? "☀️" : "🌙" }} <span>{{ isDark ? $t("nav.lightTheme") : $t("nav.darkTheme") }}</span></button>
    </nav>
    
  </header>
</template>
