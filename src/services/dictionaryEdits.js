// Personal dictionary overlay. The bundled IDIEZ dictionary is never mutated.
const STORAGE_KEY = 'nahuatl-study-dictionary-edits-v2';
const FIELDS = ['nahuatl','homonym_number','part_of_speech','class','argument_marker','transitivity','secondary_form','possessed_form','spanish','english','cross_reference','notes','page','raw_entry'];
const emptyState = () => ({ version: 2, added: [], overrides: {}, hidden: [] });
const asText = (value) => typeof value === 'string' ? value : '';

// FNV-1a, deterministic across browsers. Include original entry content, not array position.
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
export function baselineId(entry) {
  return `base:${hash([entry.nahuatl, entry.homonym_number, entry.raw_entry].map(asText).join('\u0000'))}`;
}
export function identifyBaseline(baseline) {
  const seen = new Map();
  return baseline.map((entry) => {
    const base = baselineId(entry);
    const occurrence = (seen.get(base) || 0) + 1;
    seen.set(base, occurrence);
    return { ...entry, id: occurrence === 1 ? base : `${base}:${occurrence}` };
  });
}
export function normalizeEntry(entry = {}) {
  return Object.fromEntries(FIELDS.map((key) => [key, asText(entry[key])]));
}
function validState(value) {
  if (!value || value.version !== 2 || !Array.isArray(value.added) || !Array.isArray(value.hidden) || !value.overrides || typeof value.overrides !== 'object' || Array.isArray(value.overrides)) throw new Error('Formato de copia de seguridad no válido (se requiere versión 2).');
  if (value.added.length > 50000 || value.hidden.length > 50000 || Object.keys(value.overrides).length > 50000) throw new Error('La copia contiene demasiadas entradas.');
  const added = value.added.map((item) => {
    if (typeof item?.id !== 'string' || !item.id.startsWith('custom:')) throw new Error('Identificador de entrada nueva no válido.');
    return { id: item.id, ...normalizeEntry(item) };
  });
  if (new Set(added.map((x) => x.id)).size !== added.length) throw new Error('La copia tiene identificadores duplicados.');
  const overrides = {};
  for (const [id, item] of Object.entries(value.overrides)) {
    if (!id.startsWith('base:') || !item || typeof item !== 'object') throw new Error('Modificación no válida.');
    overrides[id] = normalizeEntry(item);
  }
  return { version: 2, added, overrides, hidden: [...new Set(value.hidden.filter((id) => typeof id === 'string' && id.startsWith('base:')))] };
}
export function loadEdits() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? validState(JSON.parse(raw)) : emptyState(); }
  catch (error) { console.warn('No se pudo leer la copia local del diccionario:', error); return emptyState(); }
}
export function saveEdits(state) {
  const validated = validState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validated)); // May throw on quota/private browsing.
  return validated;
}
export function combineDictionary(baseline, state) {
  const hidden = new Set(state.hidden);
  return [
    ...identifyBaseline(baseline)
      .filter((entry) => !hidden.has(entry.id))
      .map((entry) => state.overrides[entry.id] ? { ...entry, ...state.overrides[entry.id], id: entry.id, isEdited: true } : entry),
    ...state.added.map((entry) => ({ ...entry, isAdded: true }))
  ];
}
export function createEntry(state, values) {
  const id = `custom:${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  return { ...state, added: [...state.added, { ...normalizeEntry(values), id }] };
}
export function updateEntry(state, id, values) {
  const entry = normalizeEntry(values);
  if (id.startsWith('custom:')) return { ...state, added: state.added.map((item) => item.id === id ? { ...entry, id } : item) };
  return { ...state, overrides: { ...state.overrides, [id]: entry } };
}
export function hideEntry(state, id) {
  if (id.startsWith('custom:')) return { ...state, added: state.added.filter((item) => item.id !== id) };
  return { ...state, hidden: [...new Set([...state.hidden, id])] };
}
export function restoreEntry(state, id) {
  const overrides = { ...state.overrides }; delete overrides[id];
  return { ...state, overrides, hidden: state.hidden.filter((item) => item !== id) };
}
export function resetEdits() { return emptyState(); }
export function exportEdits(state) { return JSON.stringify(validState(state), null, 2); }
export function importEdits(json, baseline) {
  const state = validState(JSON.parse(json));
  const ids = new Set(identifyBaseline(baseline).map((entry) => entry.id));
  const unknown = [...Object.keys(state.overrides), ...state.hidden].filter((id) => !ids.has(id));
  if (unknown.length) throw new Error(`La copia contiene ${unknown.length} identificadores de otra versión del diccionario. No se importó.`);
  return state;
}
