<script setup>
import DictionaryMorphology from "./DictionaryMorphology.vue";
defineProps({
  result: { type: Object, required: true },
  index: { type: Number, required: true },
  mode: { type: String, required: true }
});
defineEmits(['edit', 'delete', 'restore', 'set-transitivity']);
</script>

<template>
  <article class="card result-card">
    <div class="dictionary-result-header">
      <h2>{{ index + 1 }}. {{ result.entry.nahuatl }}
        <small v-if="result.entry.homonym_number">({{ result.entry.homonym_number }})</small>
      </h2>
      <span v-if="result.entry.isAdded" class="dictionary-status">Nueva</span>
      <span v-else-if="result.entry.isEdited" class="dictionary-status">Editada</span>
    </div>
    <p class="muted">{{ result.entry.part_of_speech || '' }}<span v-if="result.entry.class"> · clase {{ result.entry.class }}</span></p>
    <p><strong>Español:</strong> {{ result.entry.spanish || '—' }}</p>
    <p><strong>English:</strong> {{ result.entry.english || '—' }}</p>
    <div v-if="/^(tlach)/i.test(result.entry.part_of_speech || '') || result.entry.transitivity" class="transitivity-control">
      <strong>Transitividad:</strong>
      <button type="button" :aria-pressed="result.entry.transitivity === 'transitive'" :class="{ selected: result.entry.transitivity === 'transitive' }" @click="$emit('set-transitivity', result.entry, 'transitive')">Transitivo</button>
      <button type="button" :aria-pressed="result.entry.transitivity === 'intransitive'" :class="{ selected: result.entry.transitivity === 'intransitive' }" @click="$emit('set-transitivity', result.entry, 'intransitive')">Intransitivo</button>
      <button v-if="result.entry.transitivity === 'transitive' || result.entry.transitivity === 'intransitive'" type="button" @click="$emit('set-transitivity', result.entry, 'unknown')">Quitar clasificación</button>
      <small class="muted">Clasificación manual guardada localmente.</small>
    </div>
    <p v-if="mode === 'macehualli'" class="muted">{{ result.matchType }}</p>
    <details>
      <summary>Mostrar más · entrada original y clasificación</summary>
      <p v-if="mode !== 'macehualli'" class="muted">Mejor coincidencia: {{ result.language }} · palabras: {{ result.matchedCount }}/{{ result.totalWords }} · frase exacta: {{ result.exactPhrase ? 'sí' : 'no' }}</p>
      <p v-if="result.entry.page"><strong>Página:</strong> {{ result.entry.page }}</p>
      <p v-if="result.entry.argument_marker"><strong>Marcador de argumento:</strong> {{ result.entry.argument_marker }}</p>
      <p v-if="result.entry.secondary_form"><strong>Forma secundaria:</strong> {{ result.entry.secondary_form }}</p>
      <p v-if="result.entry.possessed_form"><strong>Forma poseída:</strong> {{ result.entry.possessed_form }}</p>
      <p v-if="result.entry.cross_reference"><strong>Referencia:</strong> {{ result.entry.cross_reference }}</p>
      <p v-if="result.entry.notes"><strong>Notas:</strong> {{ result.entry.notes }}</p>
      <DictionaryMorphology :entry="result.entry" />
      <p v-if="result.entry.raw_entry"><strong>Entrada original (conservada):</strong> {{ result.entry.raw_entry }}</p>
      <p v-else class="muted">Sin texto original (entrada personal).</p>
    </details>
    <div class="dictionary-actions">
      <button type="button" @click="$emit('edit', result.entry)">Editar</button>
      <button v-if="result.entry.isEdited" type="button" @click="$emit('restore', result.entry)">Restaurar original</button>
      <button type="button" class="dictionary-danger" @click="$emit('delete', result.entry)">{{ result.entry.isAdded ? 'Eliminar' : 'Ocultar' }}</button>
    </div>
  </article>
</template>

<style scoped>
.transitivity-control { display:flex; flex-wrap:wrap; gap:.45rem; align-items:center; margin:.8rem 0; }
.transitivity-control button { border:1px solid #9aada2; border-radius:8px; padding:.35rem .65rem; cursor:pointer; }
.transitivity-control button.selected { background:#205a42; color:white; border-color:#205a42; }
</style>
