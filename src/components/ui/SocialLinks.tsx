import { Link2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mediaUrl } from "@/lib/contentLoader";
import { isConfiguredHref, isExternalHref, cn } from "@/lib/utils";
import type { SocialLink } from "@/types/content";

type SocialLinksProps = {
  links: readonly SocialLink[];
  tone?: "dark" | "light";
  showLabels?: boolean;
  limit?: number;
  className?: string;
  size?: "sm" | "md";
};

/** Renders only configured links; empty studio channels stay invisible. */
export function SocialLinks({
  links,
  tone = "light",
  showLabels = false,
  limit,
  className,
  size = "sm",
}: SocialLinksProps) {
  const { language, t } = useLanguage();
  const visible = links.filter((link) => isConfiguredHref(link.href));
  const sliced = typeof limit === "number" ? visible.slice(0, limit) : visible;

  if (sliced.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {sliced.map((link) => {
        const icon = mediaUrl(link.icon);
        const label = link.label[language];
        const external = isExternalHref(link.href);
        const compact = !showLabels;

        return (
          <li key={link.id}>
            <a
              href={link.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={
                compact
                  ? `${label}${external ? ` (${t("a11y.openInNewTab")})` : ""}`
                  : undefined
              }
              className={cn(
                "group inline-flex items-center justify-center border transition-colors",
                compact
                  ? size === "md"
                    ? "size-10"
                    : "size-8"
                  : "min-h-8 gap-2 px-2.5 py-1.5 text-[11px] font-semibold leading-none",
                tone === "dark"
                  ? "border-[var(--color-void-border)] text-[var(--color-fg-inverse-muted)] hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]"
                  : "border-[var(--color-border)] text-[var(--color-fg-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
              )}
            >
              {icon ? (
                <img
                  src={icon}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "shrink-0 object-contain opacity-80 transition-opacity group-hover:opacity-100",
                    compact ? "size-4" : "size-3.5",
                  )}
                />
              ) : (
                <Link2
                  size={compact ? 15 : 13}
                  aria-hidden="true"
                  className="shrink-0"
                />
              )}
              {showLabels ? <span>{label}</span> : <span className="sr-only">{label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
