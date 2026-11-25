
import { normalize, tokenize } from "./normalize";
import "../morphology/conjugate";
import "../morphology/dictionaryMorphology";
import "../morphology/deconjugate";
import { deconjugate } from "../morphology/deconjugate";

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function nahuatlSpecificNormalization(text) {
  return text;
}

// Normalize without removing accents or macrons.
function normalizeWithAccents(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFC")
    .trim()
    .replace(/^\p{P}+|\p{P}+$/gu, "")
    .trim();
}

// Separate the headword from its homonym number.
function parseHeadword(text) {
  const value = String(text ?? "").trim();
  const match = value.match(/\s*\((\d+)\)$/u);

  return {
    headword: match
      ? value.slice(0, match.index).trim()
      : value,
    homonymNumber: match
      ? Number(match[1])
      : 0
  };
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
    const regex = new RegExp(
      "\\b" + escapeRegex(word) + "\\b",
      "u"
    );

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

  const firstStart = Math.min(
    ...matches.map(m => m.start)
  );

  const lastEnd = Math.max(
    ...matches.map(m => m.end)
  );

  const matchedCharacters = matches.reduce(
    (sum, m) => sum + m.word.length,
    0
  );

  const positionScore =
    1 - firstStart / Math.max(d.length, 1);

  const coverageScore = Math.min(
    matchedCharacters / Math.max(d.length, 1),
    1
  );

  const span = Math.max(lastEnd - firstStart, 1);

  const proximityScore = Math.min(
    matchedCharacters / span,
    1
  );

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

export function searchOccidente(
  dictionary,
  query,
  language = "Both",
  limit = 20
) {
  const columns =
    language === "Both"
      ? [["Spanish", "spanish"], ["English", "english"]]
      : [[language, language.toLowerCase()]];

  const results = [];

  for (const entry of dictionary) {
    const possible = [];

    for (const [label, column] of columns) {
      const score = scoreDefinition(entry[column], query);

      if (score) {
        possible.push({
          language: label,
          ...score
        });
      }
    }

    if (!possible.length) continue;

    possible.sort(compareScores);

    results.push({
      entry,
      ...possible[0]
    });
  }

  results.sort(compareScores);

  return results.slice(0, limit);
}

export function searchMacehualli(
  dictionary,
  query,
  limit = 20
) {
  // Accent-insensitive input for matching.
  const q = normalize(query);

  // Accent-sensitive input for ranking.
  const qAccented = normalizeWithAccents(query);

  if (!q) return [];

  const root = normalize(deconjugate(q));
  const results = [];

  function getMatch(headword, searchTerm, offset = 0) {
    if (!searchTerm) return null;

    if (headword === searchTerm) {
      return {
        rank: 1 + offset,
        matchType: "Coincidencia exacta"
      };
    }

    if (headword.startsWith(searchTerm)) {
      return {
        rank: 3 + offset,
        matchType: "Comienza con"
      };
    }

    if (headword.includes(searchTerm)) {
      return {
        rank: 5 + offset,
        matchType: "Contiene"
      };
    }

    return null;
  }

  for (const entry of dictionary) {
    // Separate homonym numbers before normalization.
    const parsed = parseHeadword(entry.nahuatl);

    const headword = normalize(parsed.headword);

    const headwordAccented = normalizeWithAccents(
      parsed.headword
    );

    if (!headword) continue;

    // Match against the original input.
    const originalMatch = getMatch(headword, q);

    // Match against the deconjugated input.
    const rootMatch =
      root && root !== q
        ? getMatch(headword, root, 1)
        : null;

    // Select the strongest available match.
    const bestMatch =
      originalMatch && rootMatch
        ? originalMatch.rank <= rootMatch.rank
          ? originalMatch
          : rootMatch
        : originalMatch || rootMatch;

    if (!bestMatch) continue;

    // Check accent agreement without excluding
    // accent-insensitive matches.
    let accentMatch = false;

    switch (bestMatch.rank) {
      case 1:
        accentMatch = headwordAccented === qAccented;
        break;

      case 3:
        accentMatch = headwordAccented.startsWith(
          qAccented
        );
        break;

      case 5:
        accentMatch = headwordAccented.includes(
          qAccented
        );
        break;
    }

    // Support both separate homonym metadata and
    // numbers included in the headword itself.
    const homonymNumber =
      Number(entry.homonym_number) ||
      parsed.homonymNumber;

    results.push({
      entry,
      rank: bestMatch.rank,
      matchType: bestMatch.matchType,
      accentMatch,
      homonymNumber,
      headword,
      headwordAccented
    });
  }

  results.sort((a, b) =>
    // 1. Match type and deconjugation priority.
    a.rank - b.rank ||

    // 2. Accent agreement.
    Number(b.accentMatch) - Number(a.accentMatch) ||

    // 3. Headword length.
    a.headword.length - b.headword.length ||

    // 4. Alphabetical order.
    a.headword.localeCompare(b.headword) ||

    // 5. Group identical accented headwords.
    a.headwordAccented.localeCompare(
      b.headwordAccented
    ) ||

    // 6. Numerical homonym order.
    a.homonymNumber - b.homonymNumber
  );

  return results.slice(0, limit);
}
