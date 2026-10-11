<script setup>

import { computed, reactive } from "vue";


const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
});


const answers = reactive({});

const checked = reactive({});


function normalize(text) {
  return String(text ?? "")
    .trim()
    .toLowerCase();
}


function check(index) {
  checked[index] = true;
}


function correct(question, index) {
  if (!checked[index]) {
    return null;
  }

  return (
    normalize(answers[index])
    ===
    normalize(question.answer)
  );
}

</script>


<template>

<div class="activity">

  <h3>
    {{ activity.instruction }}
  </h3>


  <div
    v-for="(question, index) in activity.questions"
    :key="index"
    class="question"
  >

    <div class="prompt">
      {{ index + 1 }}.
      {{ question.prompt }}
    </div>


    <input
      v-model="answers[index]"
      @keyup.enter="check(index)"
      autocomplete="off"
    >


    <button
      type="button"
      @click="check(index)"
    >
      Revisar
    </button>


    <span
      v-if="checked[index]"
      class="feedback"
    >

      <template v-if="correct(question, index)">
        ✓ Cualli
      </template>

      <template v-else>
        ✗ Inténtalo otra vez
      </template>

    </span>

  </div>

</div>

</template>


<style scoped>

.activity {
  margin-top: 1.5rem;
}


.question {
  display: grid;

  grid-template-columns:
    minmax(150px, 1fr)
    minmax(180px, 2fr)
    auto
    minmax(100px, auto);

  align-items: center;

  gap: 0.75rem;

  margin: 0.8rem 0;
}


input {
  padding: 0.6rem;
  font: inherit;
}


button {
  padding: 0.6rem 0.9rem;
}


.feedback {
  font-weight: 600;
}


@media (max-width: 700px) {

  .question {
    grid-template-columns: 1fr;
  }

}

</style>