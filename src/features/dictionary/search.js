import { normalize, tokenize } from "./normalize";

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreDefinition(definition, query) {
  const d = normalize(definition);
  const words = tokenize(query);
  if (!d || !words.length) return null;

  const phrasePattern = new RegExp(
    "\\b" + words.map(escapeRegex).join("\\s+") + "\\b",
    "u"
  );
  const exactPhrase = phrasePattern.test(d);

  const matches = [];
  for (const word of words) {
    const regex = new RegExp("\\b" + escapeRegex(word) + "\\b", "u");
    const match = regex.exec(d);
    if (match) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        word
      });
    }
  }

  if (!matches.length) return null;

  const matchedCount = matches.length;
  const wordMatchScore = matchedCount / words.length;
  const allWordsMatch = matchedCount === words.length;
  const firstStart = Math.min(...matches.map((m) => m.start));
  const lastEnd = Math.max(...matches.map((m) => m.end));
  const matchedCharacters = matches.reduce((sum, m) => sum + m.word.length, 0);

  const positionScore = 1 - firstStart / Math.max(d.length, 1);
  const coverageScore = Math.min(matchedCharacters / Math.max(d.length, 1), 1);
  const span = Math.max(lastEnd - firstStart, 1);
  const proximityScore = Math.min(matchedCharacters / span, 1);

  const continuousScore =
    coverageScore * 0.35 +
    proximityScore * 0.30 +
    positionScore * 0.20 +
    wordMatchScore * 0.15;

  return {
    exactPhrase,
    allWordsMatch,
    matchedCount,
    totalWords: words.length,
    wordMatchScore,
    coverageScore,
    proximityScore,
    positionScore,
    continuousScore
  };
}

function compareScores(a, b) {
  const keys = [
    "exactPhrase",
    "allWordsMatch",
    "wordMatchScore",
    "continuousScore",
    "coverageScore",
    "proximityScore",
    "positionScore"
  ];

  for (const key of keys) {
    const av = Number(a[key]);
    const bv = Number(b[key]);
    if (av !== bv) return bv - av;
  }
  return 0;
}

export function searchOccidente(dictionary, query, language = "Both", limit = 20) {
  const columns =
    language === "Both"
      ? [["Spanish", "spanish"], ["English", "english"]]
      : [[language, language.toLowerCase()]];

  const results = [];

  for (const entry of dictionary) {
    const possible = [];

    for (const [label, column] of columns) {
      const score = scoreDefinition(entry[column], query);
      if (score) possible.push({ language: label, ...score });
    }

    if (!possible.length) continue;
    possible.sort(compareScores);
    results.push({ entry, ...possible[0] });
  }

  results.sort(compareScores);
  return results.slice(0, limit);
}

export function searchMacehualli(dictionary, query, limit = 20) {
  const q = normalize(query);
  if (!q) return [];

  const results = [];

  for (const entry of dictionary) {
    const headword = normalize(entry.nahuatl);
    if (!headword) continue;

    let rank;
    let matchType;

    if (headword === q) {
      rank = 1;
      matchType = "Coincidencia exacta";
    } else if (headword.startsWith(q)) {
      rank = 2;
      matchType = "Comienza con";
    } else if (headword.includes(q)) {
      rank = 3;
      matchType = "Contiene";
    } else {
      continue;
    }

    results.push({ entry, rank, matchType });
  }

  results.sort((a, b) =>
    a.rank - b.rank ||
    a.entry.nahuatl.length - b.entry.nahuatl.length ||
    a.entry.nahuatl.localeCompare(b.entry.nahuatl)
  );

  return results.slice(0, limit);
}
