<script setup>

import { computed, ref } from 'vue';

import baseline from '../data/dictionary.json';

import SearchModeToggle from '../components/dictionary/SearchModeToggle.vue';

import DictionaryResult from '../components/dictionary/DictionaryResult.vue';

import { searchMacehualli, searchOccidente } from '../features/dictionary/search';

import { identifyBaseline, combineDictionary, createEntry, exportEdits, hideEntry, importEdits, loadEdits, normalizeEntry, resetEdits, restoreEntry, saveEdits, updateEntry } from '../services/dictionaryEdits';



const query = ref('');

const mode = ref('occidente');

const language = ref('Both');

const limit = ref(20);

const edits = ref(loadEdits());

const error = ref('');

const notice = ref('');

const editingId = ref(null);

const formOpen = ref(false);

const form = ref(normalizeEntry());

const showManagement = ref(false);

const importFile = ref(null);

const baselineMap = new Map(identifyBaseline(baseline).map((entry) => [entry.id, entry]));

const entries = computed(() => combineDictionary(baseline, edits.value));

const results = computed(() => {

  if (!query.value.trim()) return [];

  return mode.value === 'macehualli'

    ? searchMacehualli(entries.value, query.value, limit.value)

    : searchOccidente(entries.value, query.value, language.value, limit.value);

});

const changedCount = computed(() => Object.keys(edits.value.overrides).length);

const hiddenEntries = computed(() => edits.value.hidden.map((id) => ({ id, entry: baselineMap.get(id) })).filter((item) => item.entry));

const editedEntries = computed(() => Object.keys(edits.value.overrides).map((id) => ({ id, entry: edits.value.overrides[id] })).filter((item) => baselineMap.has(item.id)));



function commit(next, message) {

  error.value = ''; notice.value = '';

  try { const saved = saveEdits(next); edits.value = saved; notice.value = message; return true; }

  catch (e) { error.value = `No se pudieron guardar los cambios: ${e.message}`; return false; }

}

function newEntry() { editingId.value = null; form.value = normalizeEntry(); formOpen.value = true; error.value = ''; }

function editEntry(entry) { editingId.value = entry.id; form.value = normalizeEntry(entry); formOpen.value = true; error.value = ''; }

function cancelForm() { formOpen.value = false; editingId.value = null; }

function saveForm() {

  if (!form.value.nahuatl.trim()) { error.value = 'Escribe una palabra en náhuatl.'; return; }

  const original = editingId.value && baselineMap.get(editingId.value);

  // The original source text is an immutable reference for bundled entries.

  const values = { ...form.value, raw_entry: original ? original.raw_entry : form.value.raw_entry };

  if ((values.part_of_speech || '').trim().toLowerCase() !== 'tlach') {
    values.transitivity = 'unknown';
  }

  const next = editingId.value ? updateEntry(edits.value, editingId.value, values) : createEntry(edits.value, values);

  if (commit(next, editingId.value ? 'Entrada actualizada.' : 'Entrada añadida.')) {

    cancelForm(); query.value = values.nahuatl; mode.value = 'macehualli';

  }

}

function deleteEntry(entry) {

  const message = entry.isAdded ? '¿Eliminar esta entrada personal?' : '¿Ocultar esta entrada del diccionario? Podrás restaurarla después.';

  if (window.confirm(message)) commit(hideEntry(edits.value, entry.id), entry.isAdded ? 'Entrada eliminada.' : 'Entrada oculta.');

}

function setTransitivity(entry, value) {

  if ((entry.part_of_speech || '').trim().toLowerCase() !== 'tlach') return;

  if (!['transitive', 'intransitive', 'unknown'].includes(value)) return;

  // Preserve all editable fields, including definitions, source text and notes.

  const next = updateEntry(edits.value, entry.id, { ...entry, transitivity: value });

  commit(next, `Transitividad guardada: ${value === 'transitive' ? 'transitivo' : value === 'intransitive' ? 'intransitivo' : 'sin clasificar'}.`);

}

function restore(id) { commit(restoreEntry(edits.value, id), 'Entrada original restaurada.'); }

function resetAll() {

  if (!window.confirm('¿Descartar TODOS los cambios locales (nuevas entradas, modificaciones y entradas ocultas)? Exporta una copia primero.')) return;

  if (!window.confirm('Confirmación final: ¿restablecer el diccionario original?')) return;

  if (commit(resetEdits(), 'Diccionario original restaurado.')) cancelForm();

}

function downloadBackup() {

  const blob = new Blob([exportEdits(edits.value)], { type: 'application/json;charset=utf-8' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a'); a.href = url; a.download = `nahuatl-dictionary-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

}

async function uploadBackup(event) {

  const file = event.target.files?.[0];

  event.target.value = '';

  if (!file) return;

  if (!window.confirm('¿Reemplazar todos los cambios locales con los de esta copia de seguridad?')) return;

  try { const next = importEdits(await file.text(), baseline); commit(next, 'Copia de seguridad importada.'); }

  catch (e) { error.value = `No se pudo importar: ${e.message}`; }

}

</script>



<template>

  <section>

    <h1>{{ $t("dictionary.title") }}</h1>

    <p class="muted">{{ $t("dictionary.intro") }}</p>

    <div class="dictionary-toolbar">

      <button type="button" @click="newEntry">+ {{ $t("dictionary.addEntry") }}</button>

      <button type="button" @click="showManagement = !showManagement">{{ showManagement ? $t("dictionary.closeManagement") : $t("dictionary.manage") }}</button>

    </div>

    <p v-if="error" class="dictionary-alert" role="alert">{{ error }}</p>

    <p v-if="notice" class="dictionary-notice" role="status">{{ notice }}</p>



    <div v-if="showManagement" class="card">

      <h2>{{ $t("dictionary.myChanges") }}</h2>

      <p>{{ edits.added.length }} entradas nuevas · {{ changedCount }} editadas · {{ edits.hidden.length }} ocultas</p>

      <p class="muted">Las modificaciones se almacenan en localStorage. Exporta copias regularmente: limpiar los datos del navegador puede borrar tus cambios.</p>

      <div class="dictionary-actions">

        <button type="button" @click="downloadBackup">Exportar copia JSON</button>

        <label class="dictionary-import">Importar copia JSON <input ref="importFile" type="file" accept=".json,application/json" @change="uploadBackup" /></label>

        <button type="button" class="dictionary-danger" @click="resetAll">Restablecer todo al original</button>

      </div>

      <details v-if="edits.added.length"><summary>Entradas nuevas ({{ edits.added.length }})</summary>

        <div v-for="entry in edits.added" :key="entry.id" class="dictionary-management-row">

          <span>{{ entry.nahuatl }}</span><button type="button" @click="editEntry(entry)">Editar</button><button type="button" @click="deleteEntry({ ...entry, isAdded: true })">Eliminar</button>

        </div>

      </details>

      <details v-if="editedEntries.length"><summary>Entradas modificadas ({{ editedEntries.length }})</summary>

        <div v-for="item in editedEntries" :key="item.id" class="dictionary-management-row">

          <span>{{ item.entry.nahuatl }}</span><button type="button" @click="editEntry({ ...item.entry, id: item.id })">Editar</button><button type="button" @click="restore(item.id)">Restaurar</button>

        </div>

      </details>

      <details v-if="hiddenEntries.length"><summary>Entradas ocultas ({{ hiddenEntries.length }})</summary>

        <div v-for="item in hiddenEntries" :key="item.id" class="dictionary-management-row">

          <span>{{ item.entry.nahuatl }}</span><button type="button" @click="restore(item.id)">Restaurar</button>

        </div>

      </details>

    </div>



    <div v-if="formOpen" class="card dictionary-editor">

      <h2>{{ editingId ? 'Editar entrada' : 'Nueva entrada' }}</h2>

      <form @submit.prevent="saveForm">

        <div class="dictionary-editor-grid">

          <label>Náhuatl *<input v-model="form.nahuatl" required /></label>

          <label>Homónimo<input v-model="form.homonym_number" /></label>

          <label>Parte de la oración<input v-model="form.part_of_speech" /></label>

          <label>Clase verbal<input v-model="form.class" /></label>

          <label>Marcador de argumento<input v-model="form.argument_marker" /></label>

          <div v-if="(form.part_of_speech || '').trim().toLowerCase() === 'tlach'">

            <label>Transitividad (clasificación manual)

              <select v-model="form.transitivity">

                <option value="">Sin clasificar</option>

                <option value="transitive">Transitivo</option>

                <option value="intransitive">Intransitivo</option>

                <option value="unknown">Desconocido</option>

              </select>

            </label>

          </div>

          <label>Forma secundaria<input v-model="form.secondary_form" /></label>

          <label>Forma poseída<input v-model="form.possessed_form" /></label>

          <label>Página<input v-model="form.page" /></label>

          <label class="dictionary-wide">Español<textarea v-model="form.spanish" rows="2"></textarea></label>

          <label class="dictionary-wide">English<textarea v-model="form.english" rows="2"></textarea></label>

          <label class="dictionary-wide">Referencia cruzada<input v-model="form.cross_reference" /></label>

          <label class="dictionary-wide">Notas<textarea v-model="form.notes" rows="2"></textarea></label>

          <label v-if="!editingId || editingId.startsWith('custom:')" class="dictionary-wide">Texto original o fuente (opcional)<textarea v-model="form.raw_entry" rows="3"></textarea></label>

        </div>

        <p v-if="editingId?.startsWith('base:')" class="muted">La entrada original IDIEZ se conserva sin cambios y se muestra en «Mostrar más».</p>

        <div class="dictionary-actions"><button type="submit">Guardar entrada</button><button type="button" @click="cancelForm">Cancelar</button></div>

      </form>

    </div>



    <div class="card">

      <SearchModeToggle v-model="mode" />

      <div class="form-grid">

        <label>Buscar<input v-model="query" type="search" :placeholder="mode === 'macehualli' ? 'p. ej. tlacua, atl, chihua' : 'p. ej. agua, carry water'" /></label>

        <label v-if="mode === 'occidente'">Definiciones<select v-model="language"><option>Both</option><option>Spanish</option><option>English</option></select></label>

        <label>Resultados<select v-model.number="limit"><option :value="10">10</option><option :value="20">20</option><option :value="50">50</option><option :value="100">100</option></select></label>

      </div>

    </div>

    <p class="muted">{{ query ? `${results.length} resultado(s)` : `${entries.length.toLocaleString()} entradas disponibles (${baseline.length.toLocaleString()} originales)` }}</p>

    <DictionaryResult v-for="(result, index) in results" :key="result.entry.id" :result="result" :index="index" :mode="mode" @edit="editEntry" @delete="deleteEntry" @restore="entry => restore(entry.id)" @set-transitivity="setTransitivity" />

  </section>

</template>



<style scoped>

.dictionary-toolbar,.dictionary-actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin:14px 0; }

button { cursor:pointer; border:1px solid #aabbb1; background:#f4f8f5; color:#234b39; padding:9px 12px; border-radius:8px; }

button:hover { background:#e4efe8; }

.dictionary-danger { color:#8c2c2c; border-color:#d6a9a9; }

.dictionary-alert { color:#8c2c2c; font-weight:650; }

.dictionary-notice { color:#276044; }

.dictionary-editor-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; }

.dictionary-wide { grid-column:1/-1; }

.dictionary-import { display:inline-flex; align-items:center; gap:8px; padding:9px 12px; border:1px solid #aabbb1; border-radius:8px; cursor:pointer; }

.dictionary-import input { width:190px; padding:0; border:0; }

.dictionary-management-row { display:flex; align-items:center; gap:10px; border-bottom:1px solid #ddd; padding:8px 0; }

.dictionary-management-row span { flex:1; overflow-wrap:anywhere; }

details { margin:14px 0; }


:global([data-theme="dark"]) button { background:var(--action-bg); color:var(--action-text); border-color:var(--border); }
:global([data-theme="dark"]) button:hover { background:#3c5445; }
:global([data-theme="dark"]) .dictionary-danger, :global([data-theme="dark"]) .dictionary-alert { color:#ffb6b6; }
:global([data-theme="dark"]) .dictionary-notice { color:#a5ddba; }
</style>
