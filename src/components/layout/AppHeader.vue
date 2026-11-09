<script setup>
import { isDark, toggleTheme } from "../../services/theme";
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
      <RouterLink to="/diccionario">Diccionario</RouterLink>
      <!-- <RouterLink to="/traductor-conjugador">Conjugador</RouterLink> -->
      <RouterLink to="/tareas">Tareas</RouterLink>
      <!-- <RouterLink to="/cartas">Cartas</RouterLink> -->
      <RouterLink to="/notas">Notas</RouterLink>
      <RouterLink to="/instalar">Instalar aplicación</RouterLink>
      <select id="language-select" name="language">
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
      <button type="button" class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'" :aria-pressed="isDark" :title="isDark ? 'Modo claro' : 'Modo oscuro'">{{ isDark ? "☀️" : "🌙" }} <span>{{ isDark ? "Claro" : "Oscuro" }}</span></button>
    </nav>
    
  </header>
</template>
