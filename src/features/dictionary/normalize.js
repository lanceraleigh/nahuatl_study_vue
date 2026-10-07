export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function tokenize(text) {
  return normalize(text).match(/[\p{L}\p{N}_]+/gu) || [];
}
