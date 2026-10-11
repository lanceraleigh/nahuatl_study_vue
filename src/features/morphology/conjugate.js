import rules from "../../data/morphology/rules.json";


function class3Stem(root) {
  return /(?:ia|oa)$/u.test(root)
    ? root.slice(0, -1)
    : root;
}


function class2PreteriteStem(root) {
  let stem = root.replace(/[aeio]$/u, "");

  const changes = [
    [/hu$/u, "uh"],
    [/cu$/u, "uc"],
    [/y$/u, "x"],
    [/qu$/u, "c"],
    [/c$/u, "z"],
    [/m$/u, "n"]
  ];

  for (const [pattern, replacement] of changes) {
    if (pattern.test(stem)) {
      return stem.replace(pattern, replacement);
    }
  }

  return stem;
}


export function tenseStem(root, verbClass, tense) {

  if (tense === "preterite") {

    if (verbClass === 1) {
      return root;
    }

    if (verbClass === 2) {
      return class2PreteriteStem(root);
    }

    if (verbClass === 3) {
      return class3Stem(root) + "h";
    }

    if (verbClass === 4) {
      return root + "h";
    }
  }


  if (
    ["future", "imperfect", "conditional"].includes(tense)
    && verbClass === 3
  ) {
    return class3Stem(root);
  }


  return root;
}


function ending(
  verbClass,
  tense,
  plural,
  preteriteVariant = "short"
) {

  if (tense === "present") {
    return plural ? "h" : "";
  }


  if (tense === "future") {
    return plural ? "zceh" : "z";
  }


  if (tense === "imperfect") {
    return plural ? "yayah" : "yaya";
  }


  if (tense === "conditional") {
    return plural ? "zquiah" : "zquia";
  }


  if (tense === "preterite") {

    if (plural) {
      return "queh";
    }

    if (verbClass === 1) {
      return "c";
    }

    if (verbClass === 2 || verbClass === 4) {
      return "qui";
    }

    if (verbClass === 3) {
      return preteriteVariant === "qui"
        ? "qui"
        : "";
    }
  }


  return "";
}


function thirdPersonObject(subject, following) {

  /*
    IDIEZ:

    After ni-/ti-:
        c- before a, o, and consonants
        qu- before e and i

    After Ø-/in-:
        qui-
  */

  if (
    subject === "3sg"
    || subject === "3pl"
    || subject === "2pl"
  ) {
    return "qui";
  }


  if (/^[ei]/u.test(following)) {
    return "qu";
  }


  return "c";
}


export function conjugate({
  root,
  verbClass,
  subject = "1sg",
  object = "none",
  tense = "present",
  preteriteVariant = "short"
}) {

  const subjectInfo = rules.subjects[subject];

  if (!subjectInfo) {
    throw new Error(`Unknown subject: ${subject}`);
  }


  const stem = tenseStem(
    root,
    Number(verbClass),
    tense
  );


  const objectInfo = rules.objects[object];

  if (!objectInfo) {
    throw new Error(`Unknown object: ${object}`);
  }


  const objectPrefix =
    objectInfo.prefix === "AUTO3"
      ? thirdPersonObject(subject, stem)
      : objectInfo.prefix;


  const suffix = ending(
    Number(verbClass),
    tense,
    subjectInfo.plural,
    preteriteVariant
  );


  const form =
    subjectInfo.prefix
    + objectPrefix
    + stem
    + suffix;


  return {
    form,

    parts: [
      {
        type: "subject",
        value: subjectInfo.prefix || "Ø"
      },

      ...(object !== "none"
        ? [{
            type: "object",
            value: objectPrefix
          }]
        : []),

      {
        type: "stem",
        value: stem
      },

      {
        type: "tense/number",
        value: suffix || "Ø"
      }
    ]
  };
}


export function paradigm(options) {

  return Object.keys(rules.subjects).map(subject => ({
    subject,

    label:
      rules.subjects[subject].label,

    ...conjugate({
      ...options,
      subject
    })
  }));
}