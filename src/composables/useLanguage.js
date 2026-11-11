
import { ref } from "vue";
import { siteLanguageDictionary } from "../services/siteLanguageDictionary.js";

const SUPPORTED_LANGUAGES = ["en", "es", "pt-BR"];
const STORAGE_KEY = "siteLanguage";

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
  } catch {
    // Continue with the default language.
  }

  return "en";
}

// Shared reactive state across the entire application
const currentLanguage = ref(getInitialLanguage());

export function useLanguage() {
  function setLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) return;

    currentLanguage.value = language;

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Language still changes for the current session.
    }

    document.documentElement.lang = language;
  }

  function t(key, params = {}) {
    const entry = key.split(".").reduce(
      (obj, part) => obj?.[part],
      siteLanguageDictionary
    );

    const translation =
      entry?.[currentLanguage.value] ??
      entry?.en ??
      key;

    if (typeof translation !== "string") return key;

    return translation.replace(
      /\{(\w+)\}/g,
      (match, name) =>
        params[name] !== undefined
          ? String(params[name])
          : match
    );
  }

  return {
    currentLanguage,
    setLanguage,
    t
  };
}
