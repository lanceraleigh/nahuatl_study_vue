<script setup>
import { computed, ref } from "vue";
import dictionary from "../data/dictionary.json";
import SearchModeToggle from "../components/dictionary/SearchModeToggle.vue";
import DictionaryResult from "../components/dictionary/DictionaryResult.vue";
import { searchMacehualli, searchOccidente } from "../features/dictionary/search";

const query = ref("");
const mode = ref("occidente");
const language = ref("Both");
const limit = ref(20);

const results = computed(() => {
  if (!query.value.trim()) return [];

  return mode.value === "macehualli"
    ? searchMacehualli(dictionary, query.value, limit.value)
    : searchOccidente(dictionary, query.value, language.value, limit.value);
});
</script>

<template>
  <section>
    <h1>Diccionario</h1>
    <p class="muted">
      Búsqueda del diccionario IDIEZ de náhuatl de la Huasteca Veracruzana.
    </p>

    <div class="card">
      <SearchModeToggle v-model="mode" />

      <div class="form-grid">
        <label>
          Buscar
          <input
            v-model="query"
            type="search"
            :placeholder="mode === 'macehualli'
              ? 'p. ej. tlacua, atl, chihua'
              : 'p. ej. agua, carry water'"
          />
        </label>

        <label v-if="mode === 'occidente'">
          Definiciones
          <select v-model="language">
            <option>Both</option>
            <option>Spanish</option>
            <option>English</option>
          </select>
        </label>

        <label>
          Resultados
          <select v-model.number="limit">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </label>
      </div>
    </div>

    <p class="muted">
      {{ query ? `${results.length} resultado(s)` : `${dictionary.length.toLocaleString()} entradas cargadas` }}
    </p>

    <DictionaryResult
      v-for="(result, index) in results"
      :key="`${result.entry.nahuatl}-${result.entry.homonym_number}-${index}`"
      :result="result"
      :index="index"
      :mode="mode"
    />
  </section>
</template>
