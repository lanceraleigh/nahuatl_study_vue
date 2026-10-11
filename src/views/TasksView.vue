<script setup>

import { ref } from "vue";

import { unit1 }
  from "../data/tasks/unit1";

import ShortAnswerTask
  from "../components/tasks/ShortAnswerTask.vue";

import FillSequenceTask
  from "../components/tasks/FillSequenceTask.vue";


const selectedSection =
  ref(unit1.sections[0]);


function componentFor(type) {

  if (type === "short-answer") {
    return ShortAnswerTask;
  }


  if (type === "fill-sequence") {
    return FillSequenceTask;
  }


  return null;
}

</script>


<template>

<section>

  <header class="unit-header">

    <div class="unit-number">
      UNIDAD {{ unit1.number }}
    </div>


    <h1>
      {{ unit1.titleNahuatl }}
    </h1>


    <p>
      {{ unit1.titleEnglish }}
    </p>

  </header>


  <div class="task-layout">


    <nav class="sections">

      <h2>
        Contenido
      </h2>


      <button
        v-for="section in unit1.sections"
        :key="section.id"

        :class="{
          active:
            selectedSection.id
            === section.id
        }"

        @click="
          selectedSection = section
        "
      >

        <strong>
          {{ section.number }}
        </strong>

        {{ section.title }}

      </button>

    </nav>


    <main class="lesson">

      <div class="section-number">

        {{ selectedSection.number }}

      </div>


      <h2>

        {{ selectedSection.title }}

      </h2>


      <p>

        {{ selectedSection.description }}

      </p>


      <component

        v-for="activity
          in selectedSection.activities"

        :key="activity.id"

        :is="
          componentFor(activity.type)
        "

        :activity="activity"

      />

    </main>


  </div>

</section>

</template>


<style scoped>

.unit-header {
  border-bottom: 1px solid #ccc;

  padding-bottom: 1rem;

  margin-bottom: 1.5rem;
}


.unit-number {
  font-size: 0.8rem;

  font-weight: 700;

  letter-spacing: 0.08em;

  opacity: 0.65;
}


.unit-header h1 {
  margin-bottom: 0.2rem;
}


.task-layout {
  display: grid;

  grid-template-columns:
    minmax(190px, 250px)
    minmax(0, 1fr);

  gap: 2rem;
}


.sections {
  border-right: 1px solid #ddd;

  padding-right: 1rem;
}


.sections button {
  display: block;

  width: 100%;

  text-align: left;

  padding: 0.75rem;

  margin-bottom: 0.4rem;

  border: 0;

  border-radius: 8px;

  cursor: pointer;
}


.sections button.active {
  font-weight: 700;
}


.sections strong {
  display: block;

  font-size: 0.75rem;

  opacity: 0.65;
}


.section-number {
  font-weight: 700;

  opacity: 0.6;
}


.lesson {
  max-width: 850px;
}


@media (max-width: 750px) {

  .task-layout {
    grid-template-columns: 1fr;
  }


  .sections {
    border-right: 0;

    border-bottom: 1px solid #ddd;

    padding-bottom: 1rem;
  }

}

</style>