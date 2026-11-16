import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";
import { StudioLogo } from "@/components/ui/StudioLogo";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/lib/contentLoader";

export function Hero() {
  const { t, language, isRTL } = useLanguage();
  const brandParts = t("hero.brandNote")
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  const ctaLabel = isRTL
    ? "text-[12px] font-bold"
    : "font-display text-[10px] font-bold tracking-[0.18em] uppercase";

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="zone-void relative overflow-hidden border-b border-[var(--color-void-border)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 8%, rgba(111,227,161,0.15), transparent 44%), radial-gradient(circle at 88% 88%, rgba(255,122,92,0.11), transparent 42%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,245,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(242,245,238,0.18) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
          maskImage: "radial-gradient(circle at 55% 45%, black, transparent 76%)",
          WebkitMaskImage: "radial-gradient(circle at 55% 45%, black, transparent 76%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-[var(--section-pad-x)] pb-[clamp(58px,8vw,112px)] pt-[clamp(50px,8vw,104px)]">
        <div className="grid gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="min-w-0">
            <Reveal>
              <p className="overline flex items-center gap-2.5 text-[var(--color-neon-primary)]">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-[var(--color-neon-primary)] shadow-[var(--glow-primary)]"
                />
                {t("hero.eyebrow")}
              </p>

              <h1
                id="hero-title"
                className="font-heading mt-6 max-w-[14ch] text-[length:clamp(3rem,7.4vw,6.7rem)] leading-[0.96] text-[var(--color-fg-inverse)]"
              >
                <span className="block">{t("hero.titleLine1")}</span>
                <span className="mt-1 block text-[var(--color-neon-secondary)]">
                  {t("hero.titleLine2")}
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-inverse-muted)]">
                {t("hero.tagline")}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/#games"
                  className={`group inline-flex min-h-12 items-center justify-center gap-3 border border-[var(--color-neon-primary)] bg-[var(--color-neon-primary)] px-5 py-3 text-[var(--color-void)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-neon-primary)_86%,var(--brand-paper))] ${ctaLabel}`}
                >
                  {t("hero.ctaExplore")}
                  <ArrowDown
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </Link>

                <Link
                  to="/#join"
                  className={`group inline-flex min-h-12 items-center justify-center gap-3 border border-[var(--color-void-border)] px-5 py-3 text-[var(--color-fg-inverse)] transition-colors hover:border-[var(--color-neon-secondary)] hover:text-[var(--color-neon-secondary)] ${ctaLabel}`}
                >
                  {t("hero.ctaJoin")}
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                  />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[var(--color-void-border)] pt-5">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--color-fg-inverse)]">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-[var(--color-neon-secondary)]"
                  />
                  {t("hero.status")}
                </span>
                <span className="font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-inverse-muted)]">
                  {site.studioFullName[language]}
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.14} className="min-w-0">
            <div
              aria-hidden="true"
              className="relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[460px]"
            >
              <span className="absolute inset-0 rounded-full border border-[var(--color-void-border)]" />
              <span className="absolute inset-[6%] rounded-full border border-dashed border-[color-mix(in_srgb,var(--color-neon-primary)_24%,transparent)]" />

              <span className="orbit-spin absolute inset-[6%] rounded-full">
                <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-neon-primary)] shadow-[var(--glow-primary)]" />
              </span>

              <span className="absolute inset-[19%] rounded-full border border-[color-mix(in_srgb,var(--color-neon-secondary)_23%,transparent)]" />
              <span className="orbit-spin-reverse absolute inset-[19%] rounded-full">
                <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--color-neon-secondary)] shadow-[var(--glow-secondary)]" />
              </span>

              <span className="absolute inset-x-0 top-1/2 h-px bg-[color-mix(in_srgb,var(--brand-paper)_9%,transparent)]" />
              <span className="absolute bottom-0 left-1/2 top-0 w-px bg-[color-mix(in_srgb,var(--brand-paper)_9%,transparent)]" />

              <div className="absolute inset-[30%] grid place-items-center border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void-raised)_88%,transparent)] p-4 text-center backdrop-blur-sm">
                <div>
                  <StudioLogo imgClassName="mx-auto h-8 w-auto" />
                  <span className="mt-4 flex items-center justify-center gap-1.5">
                    <span className="size-1 rounded-full bg-[var(--color-neon-primary)]" />
                    <span className="size-1 rounded-full bg-[var(--color-fg-inverse-muted)]" />
                    <span className="size-1 rounded-full bg-[var(--color-neon-secondary)]" />
                  </span>
                </div>
              </div>

              {brandParts[0] && (
                <span className="absolute start-0 top-[13%] border border-[var(--color-void-border)] bg-[var(--color-void)] px-2.5 py-1 font-display text-[8px] tracking-[0.16em] text-[var(--color-fg-inverse-muted)]">
                  {brandParts[0]}
                </span>
              )}
              {brandParts[1] && (
                <span className="absolute end-0 top-[43%] border border-[var(--color-void-border)] bg-[var(--color-void)] px-2.5 py-1 font-display text-[8px] tracking-[0.16em] text-[var(--color-fg-inverse-muted)]">
                  {brandParts[1]}
                </span>
              )}
              {brandParts[2] && (
                <span className="absolute bottom-[4%] start-[14%] border border-[var(--color-void-border)] bg-[var(--color-void)] px-2.5 py-1 font-display text-[8px] tracking-[0.16em] text-[var(--color-fg-inverse-muted)]">
                  {brandParts[2]}
                </span>
              )}

              <span className="absolute end-[6%] top-[6%] size-7 border-e border-t border-[color-mix(in_srgb,var(--color-neon-primary)_40%,transparent)]" />
              <span className="absolute bottom-[6%] start-[6%] size-7 border-b border-s border-[color-mix(in_srgb,var(--color-neon-secondary)_40%,transparent)]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
