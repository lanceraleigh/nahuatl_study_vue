import { paradigm } from "./conjugate";

const POSSESSORS = [
  ["no", "mi"], ["mo", "tu"], ["i", "su (él/ella)"],
  ["to", "nuestro"], ["inmo", "su (ustedes)"], ["inin", "su (ellos)"], ["te", "de alguien"]
];

export function entryKind(entry) {
  const tag = String(entry.part_of_speech || "").trim().toLowerCase();
  if (["tlach", "tlat"].includes(tag) && /^[1-4]$/.test(String(entry.class || ""))) return "verb";
  // IDIEZ uses tlap for nouns and quen for many non-noun words; do not
  // misclassify adverbs/pronouns as adjectives from a broad tag.
  if (tag === "tlap") return "noun";
  return "unclassified";
}

export function verbTable(entry, tense = "present", object = "none") {
  if (entryKind(entry) !== "verb") return [];
  const transitive = String(entry.argument_marker || "").includes("nic") || entry.part_of_speech === "tlat";
  return paradigm({ root: entry.nahuatl, verbClass: Number(entry.class), tense,
    object: transitive ? object : "none" });
}

export function nounForms(entry, { animate = false, possessedSuffix = "", pluralPossessed = false } = {}) {
  const word = String(entry.nahuatl || "").trim();
  if (!word) return null;
  // Some lexicalized endings and irregular stems cannot be inferred safely.
  let stem = word;
  let ending = "Ø";
  if (word.endsWith("tli")) { stem = word.slice(0, -3); ending = "tli"; }
  else if (word.endsWith("lli")) { stem = word.slice(0, -2); ending = "li"; }
  else if (word.endsWith("tl")) { stem = word.slice(0, -2); ending = "tl"; }
  else if (word.endsWith("in")) { stem = word.slice(0, -2); ending = "in"; }
  const suffix = possessedSuffix === "uh" ? "uh" : possessedSuffix === "hui" ? "hui" : "";
  return {
    stem, ending,
    plural: animate ? stem + "meh" : null,
    possessed: POSSESSORS.map(([prefix, label]) => ({
      label, form: prefix + stem + (pluralPossessed ? "huan" : suffix)
    })),
    attestedPossessed: entry.possessed_form || "",
    warning: "Formas regulares orientativas, no verificadas para este lema. Algunos sustantivos cambian la raíz o requieren -uh/-hui; consulte la entrada original y la gramática de IDIEZ. El plural -meh se aplica tradicionalmente a nombres animados."
  };
}

export function adjectiveNote(entry) {
  return "En náhuatl no hay concordancia de género masculino/femenino como en español. La función predicativa y las formas plurales dependen de la construcción y del tipo de palabra; no se infiere automáticamente un paradigma de este lema.";
}
