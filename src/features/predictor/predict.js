import { normalize } from "../dictionary/normalize";

export function predictWords(dictionary, prefix, limit = 8) {
  const q = normalize(prefix);
  if (!q) return [];

  return dictionary
    .filter((entry) => normalize(entry.nahuatl).startsWith(q))
    .sort((a, b) => a.nahuatl.length - b.nahuatl.length)
    .slice(0, limit);
}
