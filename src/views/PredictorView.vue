<script setup>
import { ref, computed } from "vue";
import dictionary from "../data/dictionary.json";
import { predictWords } from "../features/predictor/predict";

const text = ref("");
const lastToken = computed(() => text.value.trim().split(/\s+/).at(-1) || "");
const suggestions = computed(() => predictWords(dictionary, lastToken.value));
</script>

<template>
  <section>
    <h1>Predictor de texto</h1>
    <p class="muted">Prototipo web del motor de predicción. El teclado del sistema será un proyecto móvil separado.</p>
    <div class="card">
      <textarea v-model="text" rows="7" placeholder="Escribe en náhuatl…"></textarea>
      <div class="chips">
        <span v-for="item in suggestions" :key="item.nahuatl" class="chip">{{ item.nahuatl }}</span>
      </div>
    </div>
  </section>
</template>
