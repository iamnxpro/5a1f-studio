import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "5a1f:motion";

type MotionContextValue = {
  motionEnabled: boolean;
  isPaused: boolean;
  toggleMotion: () => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

function systemPrefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasStoredPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function readInitialMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "off") return false;
    if (stored === "on") return true;
  } catch {
    /* ignore */
  }
  return !systemPrefersReduced();
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [motionEnabled, setMotionEnabled] = useState<boolean>(readInitialMotion);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
  }, [motionEnabled]);

  // Pause ambient loops when the tab is hidden. Components can read `isPaused`;
  // CSS animations are paused globally through html[data-paused="true"].
  useEffect(() => {
    const update = () => {
      const paused = document.hidden;
      setIsPaused(paused);
      document.documentElement.dataset.paused = paused ? "true" : "false";
    };

    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // If the visitor never chose a preference, keep following the OS setting.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      if (!hasStoredPreference()) {
        setMotionEnabled(!query.matches);
      }
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const toggleMotion = useCallback(() => {
    setMotionEnabled((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<MotionContextValue>(
    () => ({ motionEnabled, isPaused, toggleMotion }),
    [motionEnabled, isPaused, toggleMotion],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionContextValue {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used inside <MotionProvider>");
  }
  return context;
}
