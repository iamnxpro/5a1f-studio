import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  label: string;
  title: string;
  subtitle?: string;
  tone?: "paper" | "void";
  aside?: ReactNode;
  className?: string;
};

/** Shared editorial header for the secondary pages. */
export function PageHeader({
  label,
  title,
  subtitle,
  tone = "paper",
  aside,
  className,
}: PageHeaderProps) {
  const dark = tone === "void";

  return (
    <header
      className={cn(
        "mx-auto max-w-[1440px] px-[var(--section-pad-x)] pt-[clamp(52px,8vw,104px)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-8 border-b pb-8 sm:flex-row sm:items-end sm:justify-between",
          dark
            ? "border-[var(--color-void-border)]"
            : "border-[var(--color-border)]",
        )}
      >
        <div className="min-w-0 max-w-3xl">
          <p
            className={cn(
              "overline",
              dark
                ? "text-[var(--color-neon-primary)]"
                : "text-[var(--color-accent)]",
            )}
          >
            {label}
          </p>
          <h1
            className={cn(
              "font-heading mt-4 text-[length:clamp(2.5rem,5.4vw,4.8rem)]",
              dark ? "text-[var(--color-fg-inverse)]" : "text-[var(--color-fg-primary)]",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-5 max-w-2xl text-[length:var(--text-md)] leading-[var(--leading-body)]",
                dark
                  ? "text-[var(--color-fg-inverse-muted)]"
                  : "text-[var(--color-fg-secondary)]",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </header>
  );
}
