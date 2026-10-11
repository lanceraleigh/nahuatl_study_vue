import unigrams from "../../data/language-model/unigrams.json";
import bigrams from "../../data/language-model/bigrams.json";
import trigrams from "../../data/language-model/trigrams.json";

const WORD_RE = /[\p{L}\p{M}'’-]+/gu;

export function modelTokens(text) {
  return (String(text ?? "").toLowerCase().match(WORD_RE) || [])
    .map((word) => word.replaceAll("’", "'"));
}

function unigramPredictions(limit = 8) {
  const total = unigrams.reduce((sum, x) => sum + x.c, 0) || 1;
  return unigrams.slice(0, limit).map((x) => ({
    word: x.w, probability: x.c / total, count: x.c, level: "unigram"
  }));
}

function candidatesForContext(tokens) {
  const previous1 = tokens.at(-1);
  const previous2 = tokens.at(-2);

  if (previous1 && previous2) {
    const key = `${previous2}\t${previous1}`;
    if (trigrams[key]?.length) {
      return trigrams[key].map((x) => ({
        word: x.w, probability: x.p, count: x.c, level: "trigram"
      }));
    }
  }

  if (previous1 && bigrams[previous1]?.length) {
    return bigrams[previous1].map((x) => ({
      word: x.w, probability: x.p, count: x.c, level: "bigram"
    }));
  }

  return unigramPredictions(20);
}

/**
 * Predict the next word.
 * `contextText` contains completed words.
 * `prefix` is the currently typed partial word, if any.
 */
export function predictNext(contextText, prefix = "", limit = 8) {
  const tokens = modelTokens(contextText);
  const q = String(prefix ?? "").toLowerCase().replaceAll("’", "'");
  let candidates = candidatesForContext(tokens);

  if (q) candidates = candidates.filter((x) => x.word.startsWith(q));
  if (!candidates.length && q) {
    candidates = unigrams
      .filter((x) => x.w.startsWith(q))
      .slice(0, limit)
      .map((x) => ({word:x.w, probability:0, count:x.c, level:"prefix"}));
  }

  return candidates.filter((x) => x.word !== "</s>").slice(0, limit);
}

export function splitCurrentInput(text) {
  const raw = String(text ?? "");
  const endsWithSpace = /\s$/u.test(raw);
  const words = modelTokens(raw);

  if (endsWithSpace || !words.length) {
    return { context: raw, prefix: "" };
  }

  const prefix = words.at(-1);
  const index = raw.toLowerCase().lastIndexOf(prefix);
  return {
    context: index >= 0 ? raw.slice(0, index) : "",
    prefix
  };
}
