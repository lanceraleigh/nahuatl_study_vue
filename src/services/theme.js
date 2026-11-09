import { ref } from "vue";

const KEY = "nahuatl-theme";
const saved = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
export const isDark = ref(saved === "dark" || (saved !== "light" && systemDark));

function applyTheme() {
  document.documentElement.dataset.theme = isDark.value ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark.value ? "#171e1a" : "#315c49");
}
export function toggleTheme() {
  isDark.value = !isDark.value;
  try { localStorage.setItem(KEY, isDark.value ? "dark" : "light"); } catch { /* Storage unavailable */ }
  applyTheme();
}
applyTheme();
