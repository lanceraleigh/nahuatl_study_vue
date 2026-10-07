<script setup>
import { ref, watch } from "vue";
import { loadLocal, saveLocal } from "../services/storage";

const notes = ref(loadLocal("notes", ""));
watch(notes, (value) => saveLocal("notes", value));
</script>

<template>
  <section>
    <h1>Notas / apuntes</h1>
    <div class="card">
      <textarea v-model="notes" rows="18" placeholder="Escribe tus apuntes aquí…"></textarea>
      <p class="muted">Se guardan en este navegador.</p>
    </div>
  </section>
</template>
