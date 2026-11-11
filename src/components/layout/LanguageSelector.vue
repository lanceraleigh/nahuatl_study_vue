
<script setup>
import { useLanguage } from "../../composables/useLanguage.js";

const { currentLanguage, setLanguage } = useLanguage();
</script>

<template>
  <div class="language-selector">
    <label for="site-language">{{ $t("common.language") }}</label>

    <select
      id="site-language"
      :value="currentLanguage"
      @change="setLanguage($event.target.value)"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="pt-BR">Português (Brasil)</option>
    </select>
  </div>
</template>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-selector select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
