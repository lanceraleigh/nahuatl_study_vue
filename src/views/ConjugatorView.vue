<script setup>

import { computed, ref } from "vue";

import verbs from "../data/morphology/verbs.json";
import rules from "../data/morphology/rules.json";

import {
  conjugate,
  paradigm
} from "../features/morphology/conjugate";


const selectedRoot = ref("nehnemi");

const subject = ref("1sg");

const object = ref("none");

const tense = ref("present");


const verb = computed(() =>
  verbs.find(
    v => v.root === selectedRoot.value
  ) ?? verbs[0]
);


const result = computed(() =>
  conjugate({
    root: verb.value.root,
    verbClass: verb.value.class,
    subject: subject.value,

    object:
      verb.value.transitive
        ? object.value
        : "none",

    tense: tense.value
  })
);


const rows = computed(() =>
  paradigm({
    root: verb.value.root,
    verbClass: verb.value.class,

    object:
      verb.value.transitive
        ? object.value
        : "none",

    tense: tense.value
  })
);

</script>


<template>

<section>

  <h1>
    Conjugador — Huasteca Veracruzana
  </h1>


  <p>
    Conjugador basado en la gramática de IDIEZ.
    Esta primera versión incluye las clases
    regulares 1–4.
  </p>


  <div class="controls">


    <label>

      Verbo

      <select
        v-model="selectedRoot"
        @change="object = 'none'"
      >

        <option
          v-for="v in verbs"
          :key="v.root"
          :value="v.root"
        >

          {{ v.root }}
          —
          {{ v.es }}
          (clase {{ v.class }})

        </option>

      </select>

    </label>


    <label>

      Tiempo / modo

      <select v-model="tense">

        <option value="present">
          presente
        </option>

        <option value="preterite">
          pretérito
        </option>

        <option value="future">
          futuro
        </option>

        <option value="imperfect">
          imperfecto
        </option>

        <option value="conditional">
          condicional
        </option>

      </select>

    </label>


    <label>

      Sujeto

      <select v-model="subject">

        <option
          v-for="(item, key) in rules.subjects"
          :key="key"
          :value="key"
        >

          {{ item.label }}

        </option>

      </select>

    </label>


    <label v-if="verb.transitive">

      Objeto específico

      <select v-model="object">

        <option
          v-for="(item, key) in rules.objects"
          :key="key"
          :value="key"
        >

          {{ item.label }}

        </option>

      </select>

    </label>


  </div>


  <article class="answer">

    <div class="form">

      {{ result.form }}

    </div>


    <div class="analysis">

      <span
        v-for="(part, index) in result.parts"
        :key="index"
      >

        <strong>
          {{ part.value }}
        </strong>

        <small>
          {{ part.type }}
        </small>

      </span>

    </div>

  </article>


  <h2>
    Paradigma completo
  </h2>


  <table>

    <thead>

      <tr>

        <th>
          Sujeto
        </th>

        <th>
          Forma
        </th>

        <th>
          Análisis
        </th>

      </tr>

    </thead>


    <tbody>

      <tr
        v-for="row in rows"
        :key="row.subject"
      >

        <td>
          {{ row.label }}
        </td>

        <td>
          <strong>
            {{ row.form }}
          </strong>
        </td>

        <td>

          {{
            row.parts
              .map(part => part.value)
              .join(" + ")
          }}

        </td>

      </tr>

    </tbody>

  </table>


  <details>

    <summary>
      Regla de la clase {{ verb.class }}
    </summary>

    <p>
      {{ rules.classes[String(verb.class)] }}
    </p>

  </details>


  <p class="warning">

    Esta es la versión 1. Todavía no incluye
    reflexivos, objetos indefinidos,
    direccionales, incorporación nominal,
    purposivo ni verbos irregulares.

  </p>


</section>

</template>


<style scoped>

.controls {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
  margin: 1.25rem 0;
}


label {
  display: grid;
  gap: 0.35rem;
  font-weight: 600;
}


select {
  padding: 0.65rem;
  font: inherit;
}


.answer {
  padding: 1.25rem;
  border: 1px solid #bbb;
  border-radius: 12px;
  margin: 1.25rem 0;
}


.form {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
}


.analysis {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}


.analysis span {
  display: grid;
  text-align: center;
  padding: 0.45rem 0.65rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}


.analysis small {
  opacity: 0.65;
}


table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}


th,
td {
  text-align: left;
  padding: 0.55rem;
  border-bottom: 1px solid #ddd;
}


.warning {
  margin-top: 1rem;
  font-size: 0.9rem;
  opacity: 0.75;
}

</style>