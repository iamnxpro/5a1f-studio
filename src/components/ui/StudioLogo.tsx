import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mediaUrl, site } from "@/lib/contentLoader";
import { cn } from "@/lib/utils";

type StudioLogoProps = {
  className?: string;
  /** Height / width utilities for the wide wordmark, e.g. `h-9 w-auto`. */
  imgClassName?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

/**
 * Loads `site.logo` (content/media/logo.svg) and renders it at its natural
 * aspect ratio. If the file is missing or fails to decode, the 5A1F monogram
 * badge is shown instead, so the UI never displays a broken image.
 */
export function StudioLogo({
  className,
  imgClassName,
  showWordmark = false,
  wordmarkClassName,
}: StudioLogoProps) {
  const { t } = useLanguage();
  const src = mediaUrl(site.logo);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={t("a11y.logoAlt")}
          loading="eager"
          decoding="async"
          className={cn("h-9 w-auto max-w-[180px] object-contain", imgClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="inline-flex h-9 shrink-0 items-center border border-[var(--color-border-inverse)] bg-[var(--brand-void)] px-3 font-display text-[10px] leading-none tracking-[0.16em] text-[var(--color-fg-inverse)]">
          {site.studioName}
        </span>
      )}

      {showWordmark && (
        <span className={cn("font-display text-sm tracking-[0.2em]", wordmarkClassName)}>
          {site.studioName}
        </span>
      )}
    </span>
  );
}
