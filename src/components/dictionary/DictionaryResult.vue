<script setup>
defineProps({
  result: { type: Object, required: true },
  index: { type: Number, required: true },
  mode: { type: String, required: true }
});
</script>

<template>
  <article class="card result-card">
    <h2>
      {{ index + 1 }}. {{ result.entry.nahuatl }}
      <small v-if="result.entry.homonym_number">
        ({{ result.entry.homonym_number }})
      </small>
    </h2>

    <p class="muted">
      {{ result.entry.part_of_speech || "" }}
      <span v-if="result.entry.class"> · clase {{ result.entry.class }}</span>
    </p>

    <p><strong>Español:</strong> {{ result.entry.spanish || "—" }}</p>
    <p><strong>English:</strong> {{ result.entry.english || "—" }}</p>

    <p v-if="mode === 'macehualli'" class="muted">{{ result.matchType }}</p>

    <details v-else>
      <summary>Detalles de clasificación</summary>
      <p class="muted">
        Mejor coincidencia: {{ result.language }} ·
        palabras: {{ result.matchedCount }}/{{ result.totalWords }} ·
        frase exacta: {{ result.exactPhrase ? "sí" : "no" }}
      </p>
    </details>
  </article>
</template>
