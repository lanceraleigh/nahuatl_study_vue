<script setup>

import { reactive } from "vue";


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


function check(itemIndex, partIndex) {

  const key =
    `${itemIndex}-${partIndex}`;

  checked[key] = true;
}


function correct(
  part,
  itemIndex,
  partIndex
) {

  const key =
    `${itemIndex}-${partIndex}`;


  if (!checked[key]) {
    return null;
  }


  return (
    normalize(answers[key])
    ===
    normalize(part.answer)
  );
}

</script>


<template>

<div class="activity">

  <h3>
    {{ activity.instruction }}
  </h3>


  <div
    v-for="(item, itemIndex) in activity.items"
    :key="itemIndex"
    class="sequence"
  >

    <template
      v-for="(part, partIndex) in item.parts"
      :key="partIndex"
    >

      <span v-if="part.text">
        {{ part.text }}
      </span>


      <span
        v-else-if="part.blank"
        class="blank"
      >

        <input
          v-model="
            answers[
              `${itemIndex}-${partIndex}`
            ]
          "
          @keyup.enter="
            check(itemIndex, partIndex)
          "
        >


        <button
          type="button"
          @click="
            check(itemIndex, partIndex)
          "
        >
          ✓
        </button>


        <small
          v-if="
            checked[
              `${itemIndex}-${partIndex}`
            ]
          "
        >

          {{
            correct(
              part,
              itemIndex,
              partIndex
            )
              ? "Cualli"
              : "Inténtalo otra vez"
          }}

        </small>

      </span>

    </template>

  </div>

</div>

</template>


<style scoped>

.sequence {
  display: flex;
  flex-wrap: wrap;

  align-items: center;

  gap: 0.4rem;

  font-size: 1.15rem;

  margin: 1rem 0;
}


.blank {
  display: inline-flex;

  align-items: center;

  gap: 0.3rem;
}


input {
  width: 140px;

  padding: 0.4rem;

  font: inherit;
}


button {
  padding: 0.4rem 0.6rem;
}


small {
  font-size: 0.75rem;
}

</style>