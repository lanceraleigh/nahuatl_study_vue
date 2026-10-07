const PREFIX = "nahuatl-study:";

export function saveLocal(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function loadLocal(key, fallback = null) {
  const raw = localStorage.getItem(PREFIX + key);
  if (raw == null) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
