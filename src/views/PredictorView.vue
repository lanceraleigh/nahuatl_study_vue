<script setup>
import { computed, ref } from "vue";
import { predictNext, splitCurrentInput } from "../features/predictor/ngramPredictor";
import modelInfo from "../data/language-model/model-info.json";

const text = ref("");

const state = computed(() => splitCurrentInput(text.value));
const predictions = computed(() =>
  predictNext(state.value.context, state.value.prefix, 8)
);

function choose(word) {
  const { context, prefix } = state.value;
  if (prefix) {
    text.value = context + word + " ";
  } else {
    text.value = text.value + (text.value && !/\s$/u.test(text.value) ? " " : "") + word + " ";
  }
}
</script>

<template>
  <section>
    <h1>Predictor de texto</h1>
    <p>
      Modelo trigram de palabras con retroceso a bigramas y unigramas.
      Primer corpus: Huasteca Veracruzana / Chicontepec.
    </p>

    <textarea
      v-model="text"
      rows="8"
      placeholder="Xihcuilo nican..."
      style="width:100%; padding:1rem; font:inherit;"
    />

    <div class="prediction-row">
      <button
        v-for="item in predictions"
        :key="item.word"
        type="button"
        class="prediction"
        @click="choose(item.word)"
      >
        {{ item.word }}
        <small>{{ item.level }}</small>
      </button>
    </div>

    <details>
      <summary>Acerca del modelo</summary>
      <p>
        {{ modelInfo.tokens.toLocaleString() }} tokens,
        {{ modelInfo.sentences.toLocaleString() }} oraciones retenidas,
        {{ modelInfo.vocabulary.toLocaleString() }} tipos.
      </p>
      <p>
        La limpieza del corpus es automática y conservadora; todavía necesita
        revisión humana antes de considerarse un corpus lingüístico definitivo.
      </p>
    </details>
  </section>
</template>

<style scoped>
.prediction-row {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  margin: 1rem 0;
}
.prediction {
  padding: .65rem .9rem;
  cursor: pointer;
}
.prediction small {
  display: block;
  opacity: .65;
  font-size: .7rem;
}
</style>
