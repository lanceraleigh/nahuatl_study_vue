
import rules from "../../data/morphology/rules.json";
import { conjugate } from "./conjugate.js";

// Adjust the conjugate.js import to match your existing module.
// This reverses the implemented conjugation rules.

const TENSES = ["present", "future", "imperfect", "conditional", "preterite"];
const CLASSES = [1, 2, 3, 4];
const VOWELS = ["a", "e", "i", "o"];

function ending(verbClass, tense, plural, preteriteVariant = "short") {
  if (tense === "present") return plural ? "h" : "";
  if (tense === "future") return plural ? "zceh" : "z";
  if (tense === "imperfect") return plural ? "yayah" : "yaya";
  if (tense === "conditional") return plural ? "zquiah" : "zquia";

  if (tense === "preterite") {
    if (plural) return "queh";
    if (verbClass === 1) return "c";
    if (verbClass === 2 || verbClass === 4) return "qui";
    return preteriteVariant === "qui" ? "qui" : "";
  }

  return "";
}

function reverseClass2(stem) {
  const bases = new Set([stem]);

  const inverses = [
    [/uh$/u, "hu"],
    [/uc$/u, "cu"],
    [/x$/u, "y"],
    [/c$/u, "qu"],
    [/z$/u, "c"],
    [/n$/u, "m"]
  ];

  for (const [pattern, replacement] of inverses) {
    if (pattern.test(stem)) {
      bases.add(stem.replace(pattern, replacement));
    }
  }

  const candidates = new Set();

  for (const base of bases) {
    candidates.add(base);

    for (const vowel of VOWELS) {
      candidates.add(base + vowel);
    }
  }

  return [...candidates];
}

function class3Roots(stem) {
  const candidates = new Set([stem]);

  if (/[io]$/u.test(stem)) {
    candidates.add(stem + "a");
  }

  return [...candidates];
}

function reverseStem(stem, verbClass, tense) {
  if (tense === "preterite") {
    if (verbClass === 2) {
      return reverseClass2(stem);
    }

    if (verbClass === 3 || verbClass === 4) {
      if (!stem.endsWith("h")) return [];

      const base = stem.slice(0, -1);

      if (verbClass === 4) return [base];

      return class3Roots(base);
    }
  }

  if (
    verbClass === 3 &&
    ["future", "imperfect", "conditional"].includes(tense)
  ) {
    return class3Roots(stem);
  }

  return [stem];
}

function valuesOrAll(value, values) {
  return value === undefined || value === null
    ? values
    : [value];
}

/**
 * Reverse conjugation rules and return verified root candidates.
 *
 * Options:
 *   subject
 *   object
 *   tense
 *   verbClass
 *   preteriteVariant
 *   knownRoots
 */
export function deconjugate(form, options = {}) {
  if (typeof form !== "string" || !form.length) {
    throw new TypeError("form must be a nonempty string");
  }

  const subjects = valuesOrAll(
    options.subject,
    Object.keys(rules.subjects)
  );

  const objects = valuesOrAll(
    options.object,
    Object.keys(rules.objects)
  );

  const tenses = valuesOrAll(options.tense, TENSES);

  const classes = valuesOrAll(
    options.verbClass,
    CLASSES
  ).map(Number);

  const variants = valuesOrAll(
    options.preteriteVariant,
    ["short", "qui"]
  );

  const knownRoots = options.knownRoots == null
    ? null
    : new Set(options.knownRoots);

  const analyses = [];
  const seen = new Set();

  for (const subject of subjects) {
    const subjectInfo = rules.subjects[subject];

    if (!subjectInfo) {
      throw new Error(`Unknown subject: ${subject}`);
    }

    const subjectPrefix = subjectInfo.prefix;

    if (!form.startsWith(subjectPrefix)) continue;

    const afterSubject = form.slice(subjectPrefix.length);

    for (const object of objects) {
      const objectInfo = rules.objects[object];

      if (!objectInfo) {
        throw new Error(`Unknown object: ${object}`);
      }

      const prefixes = objectInfo.prefix === "AUTO3"
        ? ["c", "qu", "qui"]
        : [objectInfo.prefix];

      for (const objectPrefix of new Set(prefixes)) {
        if (!afterSubject.startsWith(objectPrefix)) continue;

        const afterObject = afterSubject.slice(
          objectPrefix.length
        );

        for (const tense of tenses) {
          if (!TENSES.includes(tense)) {
            throw new Error(`Unknown tense: ${tense}`);
          }

          for (const verbClass of classes) {
            if (!CLASSES.includes(verbClass)) {
              throw new Error(
                `Unknown verb class: ${verbClass}`
              );
            }

            const activeVariants = tense === "preterite"
              ? variants
              : ["short"];

            for (const preteriteVariant of activeVariants) {
              const suffix = ending(
                verbClass,
                tense,
                subjectInfo.plural,
                preteriteVariant
              );

              if (!afterObject.endsWith(suffix)) continue;

              const stem = suffix
                ? afterObject.slice(0, -suffix.length)
                : afterObject;

              for (const root of reverseStem(
                stem,
                verbClass,
                tense
              )) {
                if (!root) continue;

                if (knownRoots && !knownRoots.has(root)) {
                  continue;
                }

                const input = {
                  root,
                  verbClass,
                  subject,
                  object,
                  tense,
                  preteriteVariant
                };

                // Only retain candidates that regenerate the input.
                if (conjugate(input).form !== form) continue;

                const key = JSON.stringify(input);

                if (seen.has(key)) continue;

                seen.add(key);

                analyses.push({
                  ...input,
                  stem,
                  subjectPrefix,
                  objectPrefix,
                  suffix
                });
              }
            }
          }
        }
      }
    }
  }

  // Shortest root first, alphabetical order for ties.
  const compareRoots = (a, b) =>
    [...a].length - [...b].length ||
    (a < b ? -1 : a > b ? 1 : 0);

  const roots = [
    ...new Set(analyses.map(a => a.root))
  ].sort(compareRoots);

  analyses.sort((a, b) =>
    compareRoots(a.root, b.root)
  );

  return roots[0];
  // return {
    
    // form,
    // primary: roots[0] ?? null,
    // secondary: roots[1] ?? null,
    // tertiary: roots[2] ?? null,
    // alternatives: roots.slice(1),
    // analyses,
    // roots,
    // ambiguous: roots.length > 1
  // };
}

/** Return the shortest verified root. */
export function recoverRoot(form, options = {}) {
  return deconjugate(form, options).primary;
}

/** Analyze multiple conjugated forms. */
export function deconjugateMany(forms, options = {}) {
  return forms.map(form => deconjugate(form, options));
}
