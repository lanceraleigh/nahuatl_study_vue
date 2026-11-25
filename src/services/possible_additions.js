
import nahuatl_corpus from "../data/nahuatl_corpus";
import dictionary from "../data/dictionary";
import { deconjugate } from "../features/morphology/deconjugate.js";
import { normalize } from "../features/dictionary/normalize.js";

export function ignoreMacrons(word) {
  return word.normalize("NFD").replace(/\p{M}/gu, "");
}

export function comparisonKey(word) {
  return ignoreMacrons(normalize(word));
}

export function logNahuatlCorpus(argument) {
  if (!argument) {
    console.log("nahuatl_corpus", nahuatl_corpus);
  } else if (argument === "deconjugated") {
    console.log(
      "deconjugated_corpus",
      deconjugateCorpus(nahuatl_corpus)
    );
  }
}

export function deconjugateCorpus(corpus) {
  const results = new Map();

  const dictionaryWords = new Set(
    dictionary.map(entry => comparisonKey(entry.nahuatl))
  );

  for (const entry of corpus) {
    const word = normalize(entry.word);
    const key = comparisonKey(word);

    if (!key) continue;

    // Only deconjugate if the word is absent from the dictionary.
    const root = dictionaryWords.has(key)
      ? word
      : deconjugate(word) || word;

    const rootKey = comparisonKey(root);

    if (!rootKey) continue;

    // Deduplicate while ignoring diacritics.
    if (results.has(rootKey)) {
      const existing = results.get(rootKey);

      existing.count += entry.count;
      existing.forms.push(entry.word);
    } else {
      results.set(rootKey, {
        word: root,
        count: entry.count,
        forms: [entry.word]
      });
    }
  }

  return Array.from(results.values())
    .filter(entry => entry.count > 10)
    .sort((a, b) => b.count - a.count);
}

export function compareCorpusToDictionary() {
  const deconjugatedCorpus = deconjugateCorpus(nahuatl_corpus);

  const corpusWords = new Set(
    deconjugatedCorpus.map(entry => comparisonKey(entry.word))
  );

  const dictionaryWords = new Set(
    dictionary.map(entry => comparisonKey(entry.nahuatl))
  );

  const missingFromDictionary = [...corpusWords]
    .filter(word => !dictionaryWords.has(word));

  const missingFromCorpus = [...dictionaryWords]
    .filter(word => !corpusWords.has(word));

  console.log("Deconjugated corpus:", deconjugatedCorpus);
  console.log("Corpus words:", corpusWords);
  console.log("Dictionary words:", dictionaryWords);
  console.log("Missing from dictionary:", missingFromDictionary);
  console.log("Missing from corpus:", missingFromCorpus);

  return { missingFromDictionary, missingFromCorpus };
}
