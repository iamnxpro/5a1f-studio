import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/** Neon hairline pinned to the bottom of the navbar, 0 → 100% of the page. */
export function ScrollProgress() {
  const { t, isRTL } = useLanguage();
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const root = document.documentElement;
      const maximum = root.scrollHeight - window.innerHeight;
      const value =
        maximum > 0
          ? Math.round(Math.min(1, Math.max(0, window.scrollY / maximum)) * 100)
          : 0;

      setProgress((current) => (current === value ? current : value));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <div
      role="progressbar"
      aria-label={t("a11y.scrollProgress")}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--color-void-border)]"
    >
      <div
        className="h-full w-full bg-[linear-gradient(90deg,var(--color-neon-primary),var(--color-neon-secondary))]"
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: isRTL ? "right" : "left",
        }}
      />
    </div>
  );
}
