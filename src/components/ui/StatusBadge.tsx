import { useLanguage } from "@/contexts/LanguageContext";
import { statusTranslationKey } from "@/lib/presentation";
import { cn } from "@/lib/utils";
import type { WorkStatus } from "@/types/content";

type StatusBadgeProps = {
  status: WorkStatus;
  tone?: "dark" | "light";
  className?: string;
};

const DARK_STYLES: Record<WorkStatus, string> = {
  available:
    "border-[color-mix(in_srgb,var(--color-neon-primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-neon-primary)_11%,transparent)] text-[var(--color-neon-primary)]",
  coming_soon:
    "border-[color-mix(in_srgb,var(--color-neon-secondary)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-neon-secondary)_11%,transparent)] text-[var(--color-neon-secondary)]",
  beta:
    "border-[color-mix(in_srgb,var(--brand-paper)_30%,transparent)] bg-[color-mix(in_srgb,var(--brand-paper)_8%,transparent)] text-[var(--color-fg-inverse)]",
  in_development:
    "border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--brand-paper)_5%,transparent)] text-[var(--color-fg-inverse-muted)]",
};

const LIGHT_STYLES: Record<WorkStatus, string> = {
  available: "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-fg-inverse)]",
  coming_soon:
    "border-[var(--color-highlight-strong)] bg-[color-mix(in_srgb,var(--color-highlight)_10%,transparent)] text-[var(--color-highlight-strong)]",
  beta: "border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-primary)]",
  in_development:
    "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-secondary)]",
};

export function StatusBadge({ status, tone = "dark", className }: StatusBadgeProps) {
  const { t, isRTL } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-[10px] font-bold leading-none",
        !isRTL && "tracking-[0.1em] uppercase",
        tone === "dark" ? DARK_STYLES[status] : LIGHT_STYLES[status],
        className,
      )}
    >
      {t(statusTranslationKey(status))}
    </span>
  );
}
