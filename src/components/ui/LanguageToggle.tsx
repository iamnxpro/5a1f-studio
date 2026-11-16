import { Globe2 } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
  tone?: "light" | "dark";
};

/** Instant RTL/LTR switch — no reload, scroll position preserved. */
export function LanguageToggle({ className, tone = "light" }: LanguageToggleProps) {
  const { t, toggleLanguage } = useLanguage();
  const { playClick } = useAudio();

  return (
    <button
      type="button"
      onClick={() => {
        playClick();
        toggleLanguage();
      }}
      aria-label={`${t("common.language")} — ${t("a11y.toggleLanguage")}`}
      className={cn(
        "inline-flex items-center gap-2 border-b py-1.5 text-[11px] font-bold tracking-[0.06em] transition-colors",
        tone === "dark"
          ? "border-[var(--color-void-border)] text-[var(--color-fg-inverse-muted)] hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]"
          : "border-[var(--color-border-strong)] text-[var(--color-fg-primary)] hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]",
        className,
      )}
    >
      <Globe2 size={15} aria-hidden="true" />
      <span>{t("common.language")}</span>
    </button>
  );
}
