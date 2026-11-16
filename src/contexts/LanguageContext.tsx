import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { translations, site } from "@/lib/contentLoader";
import type { Language, TranslationTree } from "@/types/content";

const STORAGE_KEY = "5a1f:language";
const warnedKeys = new Set<string>();

type LanguageContextValue = {
  language: Language;
  dir: "rtl" | "ltr";
  isRTL: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === "ar" || value === "en";
}

function detectInitialLanguage(): Language {
  if (typeof window === "undefined") return site.defaultLanguage;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    /* storage can be blocked — ignore */
  }

  const browser = window.navigator.language?.toLowerCase() ?? "";
  if (browser.startsWith("ar")) return "ar";

  return site.defaultLanguage;
}

function readPath(tree: TranslationTree, path: string): string | undefined {
  let node: TranslationTree | string = tree;

  for (const segment of path.split(".")) {
    if (typeof node === "string") return undefined;
    const next: string | TranslationTree | undefined = node[segment];
    if (next === undefined) return undefined;
    node = next;
  }

  return typeof node === "string" ? node : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);
  const pendingScroll = useRef<number | null>(null);

  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";

  // Reflect the active language on <html> and persist it. No reload happens,
  // so the scroll position is preserved; we still restore it after the reflow
  // caused by an RTL <-> LTR switch.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = dir;

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore */
    }

    if (pendingScroll.current !== null) {
      const y = pendingScroll.current;
      pendingScroll.current = null;
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
    }
  }, [language, dir]);

  const setLanguage = useCallback((next: Language) => {
    pendingScroll.current = window.scrollY;
    setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      pendingScroll.current = window.scrollY;
      return current === "ar" ? "en" : "ar";
    });
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const primary = readPath(translations[language], path);
      const fallback = readPath(
        translations[language === "ar" ? "en" : "ar"],
        path,
      );
      let value = primary ?? fallback;

      if (value === undefined) {
        if (import.meta.env.DEV && !warnedKeys.has(path)) {
          warnedKeys.add(path);
          console.warn(`[i18n] Missing translation key: "${path}"`);
        }
        value = import.meta.env.DEV ? `⟦${path}⟧` : path;
      }

      if (vars) {
        for (const [key, replacement] of Object.entries(vars)) {
          value = value.replaceAll(`{${key}}`, String(replacement));
        }
      }

      return value;
    },
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      dir,
      isRTL: dir === "rtl",
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, dir, setLanguage, toggleLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return context;
}
