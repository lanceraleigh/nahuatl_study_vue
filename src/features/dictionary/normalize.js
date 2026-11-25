export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\p{P}/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text) {
  return normalize(text).match(/[\p{L}\p{N}]+/gu) || [];
}