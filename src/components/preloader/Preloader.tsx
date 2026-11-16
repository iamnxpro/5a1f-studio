import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { StudioLogo } from "@/components/ui/StudioLogo";
import { useAudio } from "@/contexts/AudioContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMotion } from "@/contexts/MotionContext";
import { usePreloadProgress } from "@/hooks/usePreloadProgress";
import { site } from "@/lib/contentLoader";
import { cn } from "@/lib/utils";

type PreloaderProps = {
  onFinished: () => void;
};

/**
 * Cinematic first-load gate.
 * Progress is real (images decoded + fonts loaded). The Enter button only
 * appears at 100%, and the AudioContext is created from that same click so
 * nothing can autoplay before the visitor opts in.
 */
export function Preloader({ onFinished }: PreloaderProps) {
  const { t, language, isRTL } = useLanguage();
  const { motionEnabled } = useMotion();
  const { enter, playClick } = useAudio();
  const { progress, ready } = usePreloadProgress();

  const [leaving, setLeaving] = useState(false);
  const [entering, setEntering] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  const finish = (withIntro: boolean) => {
    if (entering || leaving) return;
    setEntering(true);

    void enter(withIntro).finally(() => {
      if (!withIntro) playClick();
      setLeaving(true);
      window.setTimeout(onFinished, motionEnabled ? 620 : 0);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("preloader.initializing")}
      className={cn(
        "fixed inset-0 z-[var(--z-preloader)] overflow-hidden bg-[var(--color-void)] text-[var(--color-fg-inverse)] transition-opacity duration-[var(--duration-smooth)]",
        leaving ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(111,227,161,0.13), transparent 45%), radial-gradient(circle at 84% 86%, rgba(255,122,92,0.10), transparent 42%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,245,238,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(242,245,238,0.16) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at center, black, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 72%)",
        }}
      />

      <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-10">
        <span className="absolute start-6 top-6 font-display text-[9px] tracking-[0.3em] text-[var(--color-fg-inverse-muted)]">
          {site.studioName}
        </span>
        <span className="absolute bottom-6 end-6 font-display text-[9px] tracking-[0.24em] text-[var(--color-fg-inverse-muted)]">
          {site.studioFullName[language]}
        </span>

        <div className="flex w-full max-w-md flex-col items-center text-center">
          <div className="preloader-float relative">
            <span
              aria-hidden="true"
              className="absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(111,227,161,0.18),transparent_66%)] blur-2xl"
            />
            <span aria-hidden="true" className="preloader-scan absolute inset-x-0 top-0 h-px bg-[var(--color-neon-primary)]" />
            <StudioLogo imgClassName="relative h-14 w-auto drop-shadow-[0_0_28px_rgba(111,227,161,0.18)] sm:h-16" />
          </div>

          <p className="overline mt-12 text-[var(--color-neon-primary)]">
            {t("preloader.assets")}
          </p>
          <h1 className="font-heading mt-3 text-[length:var(--text-3xl)] text-[var(--color-fg-inverse)]">
            {t("preloader.initializing")}
          </h1>

          <div className="mt-10 w-full">
            <div className="flex items-baseline justify-between" dir="ltr">
              <span className="font-display text-[11px] tracking-[0.18em] text-[var(--color-fg-inverse)] tabular-nums">
                {String(Math.min(progress, 100)).padStart(3, "0")}%
              </span>
              <Loader2
                size={13}
                aria-hidden="true"
                className={cn(
                  "text-[var(--color-neon-secondary)]",
                  ready ? "opacity-0" : "animate-spin",
                )}
              />
            </div>

            <div
              role="progressbar"
              aria-label={t("preloader.assets")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="mt-2 h-[2px] w-full overflow-hidden bg-[var(--color-void-border)]"
            >
              <div
                className="h-full w-full bg-[linear-gradient(90deg,var(--color-neon-primary),var(--color-neon-secondary))]"
                style={{
                  transform: `scaleX(${progress / 100})`,
                  transformOrigin: isRTL ? "right" : "left",
                  transition: "transform 320ms var(--ease-out)",
                }}
              />
            </div>
          </div>

          <div className="mt-10 flex min-h-32 flex-col items-center gap-3">
            {ready ? (
              <button
                ref={enterRef}
                type="button"
                onClick={() => finish(true)}
                disabled={entering}
                className="preloader-enter group inline-flex min-w-[15rem] items-center justify-center gap-3 border border-[var(--color-neon-primary)] bg-[color-mix(in_srgb,var(--color-neon-primary)_9%,transparent)] px-6 py-4 font-display text-[11px] tracking-[0.2em] text-[var(--color-neon-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-neon-primary)_16%,transparent)] disabled:opacity-60"
              >
                {t("preloader.enter")}
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </button>
            ) : (
              <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-fg-inverse-muted)]">
                {t("preloader.assets")}…
              </p>
            )}

            <button
              type="button"
              onClick={() => finish(false)}
              disabled={entering}
              className="border-b border-transparent px-3 py-1.5 text-[11px] font-bold text-[var(--color-fg-inverse-muted)] transition-colors hover:border-[var(--color-neon-secondary)] hover:text-[var(--color-fg-inverse)] disabled:opacity-50"
            >
              {t("preloader.skip")}
            </button>

            <p className="text-[11px] text-[var(--color-fg-inverse-muted)]">
              {t("preloader.hint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
