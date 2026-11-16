import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { soundEngine } from "@/audio/soundEngine";

const STORAGE_KEY = "5a1f:audio";

type AudioContextValue = {
  muted: boolean;
  unlocked: boolean;
  toggleMuted: () => void;
  enter: (withIntro?: boolean) => Promise<boolean>;
  playClick: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

function readInitialMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "muted";
  } catch {
    return false;
  }
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(readInitialMuted);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    soundEngine.setMuted(muted);
    try {
      window.localStorage.setItem(STORAGE_KEY, muted ? "muted" : "on");
    } catch {
      /* ignore blocked storage */
    }
  }, [muted]);

  const enter = useCallback(async (withIntro = true) => {
    const success = await soundEngine.unlock();
    setUnlocked(success);
    if (success && withIntro) {
      soundEngine.playIntroWhoosh();
    }
    return success;
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((current) => !current);
  }, []);

  const playClick = useCallback(() => {
    soundEngine.playClickConfirm();
  }, []);

  // One delegated hover listener for the whole document: every anchor, button
  // and role=button gets the micro-tick, without wiring each component.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lastHovered: Element | null = null;

    const findTarget = (event: PointerEvent): Element | null => {
      const target = event.target;
      return target instanceof Element
        ? target.closest("a,button,[role='button']")
        : null;
    };

    const handleOver = (event: PointerEvent) => {
      const element = findTarget(event);
      if (element && element !== lastHovered) {
        lastHovered = element;
        soundEngine.playHoverTick();
      }
    };

    const handleOut = (event: PointerEvent) => {
      const element = findTarget(event);
      if (element && element === lastHovered) {
        lastHovered = null;
      }
    };

    document.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("pointerout", handleOut, { passive: true });

    return () => {
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
    };
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({ muted, unlocked, toggleMuted, enter, playClick }),
    [muted, unlocked, toggleMuted, enter, playClick],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used inside <AudioProvider>");
  }
  return context;
}
