<script setup>
import { computed, ref } from "vue";
import { entryKind, verbTable, nounForms, adjectiveNote } from "../../features/morphology/dictionaryMorphology";
const props = defineProps({ entry: { type: Object, required: true } });
const kind = computed(() => entryKind(props.entry));
const tense = ref("present");
const object = ref("none");
const animate = ref(false);
const suffix = ref("");
const pluralPossessed = ref(false);
const forms = computed(() => kind.value === "noun" ? nounForms(props.entry, {animate: animate.value, possessedSuffix: suffix.value, pluralPossessed: pluralPossessed.value}) : null);
const verbRows = computed(() => kind.value === "verb" ? verbTable(props.entry, tense.value, object.value) : []);
const transitive = computed(() => props.entry.part_of_speech === "tlat" || String(props.entry.argument_marker || "").includes("nic"));
</script>

<template>
  <section class="dictionary-morphology">
    <h3>Morfología · Huasteca Veracruzana</h3>
    <template v-if="kind === 'verb'">
      <p class="muted">Conjugación generada con el conjugador existente (clase {{ entry.class }}). Revise formas irregulares y marcadores de objeto.</p>
      <div class="morph-controls">
        <label>Tiempo
          <select v-model="tense">
            <option value="present">Presente</option><option value="preterite">Pretérito</option>
            <option value="future">Futuro</option><option value="imperfect">Imperfecto</option>
            <option value="conditional">Condicional</option>
          </select>
        </label>
        <label v-if="transitive">Objeto
          <select v-model="object">
            <option value="none">Sin marcador (ilustrativo)</option>
            <option value="1sg">me</option><option value="2sg">te</option>
            <option value="3sg">lo/la</option><option value="1pl">nos</option>
            <option value="2pl">a ustedes</option><option value="3pl">los/las</option>
          </select>
        </label>
      </div>
      <p v-if="transitive && object === 'none'" class="muted">Aviso: un verbo transitivo normalmente requiere marcación de objeto. Seleccione un objeto para obtener una forma más completa.</p>
      <table class="morph-table"><thead><tr><th>Persona</th><th>Forma</th></tr></thead>
        <tbody><tr v-for="row in verbRows" :key="row.subject"><td>{{ row.label }}</td><td><strong>{{ row.form }}</strong></td></tr></tbody>
      </table>
      <p v-if="entry.secondary_form"><strong>Forma documentada:</strong> {{ entry.secondary_form }}</p>
    </template>
    <template v-else-if="kind === 'noun' && forms">
      <p><strong>Raíz propuesta:</strong> {{ forms.stem }} · <strong>Absolutivo:</strong> -{{ forms.ending }}</p>
      <label class="morph-check"><input type="checkbox" v-model="animate" /> Sustantivo animado (mostrar plural -meh)</label>
      <p v-if="forms.plural"><strong>Plural orientativo:</strong> {{ forms.plural }}</p>
      <div class="morph-controls">
        <label>Sufijo posesivo (depende del lema)
          <select v-model="suffix"><option value="">-Ø</option><option value="uh">-uh</option><option value="hui">-hui</option></select>
        </label>
        <label class="morph-check"><input type="checkbox" v-model="pluralPossessed" /> Referente poseído plural (-huan)</label>
      </div>
      <table class="morph-table"><thead><tr><th>Poseedor</th><th>Forma orientativa</th></tr></thead>
        <tbody><tr v-for="form in forms.possessed" :key="form.label"><td>{{ form.label }}</td><td>{{ form.form }}</td></tr></tbody>
      </table>
      <p v-if="forms.attestedPossessed"><strong>Forma poseída registrada:</strong> {{ forms.attestedPossessed }}</p>
      <p class="muted">{{ forms.warning }}</p>
    </template>
    <template v-else>
      <p class="muted">{{ adjectiveNote(entry) }}</p>
      <p class="muted">La clasificación disponible no permite identificar este lema con seguridad como sustantivo, adjetivo o verbo conjugable. No se generan formas sin verificación.</p>
    </template>
  </section>
</template>

<style scoped>
.dictionary-morphology { margin-top: 1rem; border-top: 1px solid var(--border, #ccc); padding-top: .75rem; }
.morph-controls { display: flex; flex-wrap: wrap; gap: .75rem; margin: .75rem 0; }
.morph-controls label { display: flex; flex-direction: column; gap: .3rem; }
.morph-check { display: flex !important; flex-direction: row !important; align-items: center; gap: .4rem; margin: .6rem 0; }
.morph-table { width: 100%; border-collapse: collapse; margin: .75rem 0; }
.morph-table th, .morph-table td { text-align: left; border-bottom: 1px solid var(--border, #ddd); padding: .4rem; }
</style>
