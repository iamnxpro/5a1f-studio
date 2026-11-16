import { ArrowUpRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { MemberCard } from "@/components/ui/MemberCard";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { site, teamMembers } from "@/lib/contentLoader";

export function AboutSection() {
  const { t, language } = useLanguage();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="zone-paper border-b border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
        <Reveal>
          <div className="grid gap-8 border-b border-[var(--color-border)] pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="overline text-[var(--color-accent)]">{t("about.label")}</p>
              <h2
                id="about-title"
                className="font-heading mt-4 max-w-[13ch] text-[length:var(--text-3xl)]"
              >
                {t("about.title")}
              </h2>
            </div>
            <p className="max-w-2xl text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-secondary)] lg:pt-2">
              {t("about.body")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-8">
          <blockquote className="relative overflow-hidden border border-[var(--color-accent-strong)] bg-[var(--color-accent)] p-7 text-[var(--color-fg-inverse)] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -end-10 -top-12 font-heading text-[12rem] leading-none text-[color-mix(in_srgb,var(--brand-paper)_8%,transparent)]"
            >
              ”
            </div>
            <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
              <Quote
                size={34}
                strokeWidth={1}
                aria-hidden="true"
                className="text-[var(--color-neon-primary)]"
              />
              <div>
                <p className="font-heading max-w-3xl text-[length:clamp(1.6rem,3vw,2.6rem)] leading-[1.22] text-[var(--color-fg-inverse)]">
                  {t("about.quote")}
                </p>
                <footer className="mt-5 font-display text-[9px] tracking-[0.2em] text-[var(--color-fg-inverse-muted)]">
                  {site.studioFullName[language]}
                </footer>
              </div>
            </div>
          </blockquote>
        </Reveal>

        <div className="mt-16 border-t border-[var(--color-border)] pt-10">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="overline text-[var(--color-accent)]">{t("about.teamLabel")}</p>
                <h3 className="font-heading mt-3 text-[length:var(--text-2xl)]">
                  {t("about.teamTitle")}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-fg-secondary)]">
                  {t("about.teamSubtitle")}
                </p>
              </div>

              <Link
                to="/team"
                className="group inline-flex items-center gap-2 self-start border-b border-[var(--color-accent)] pb-1 text-[11px] font-bold text-[var(--color-accent)] transition-colors hover:border-[var(--color-highlight-strong)] hover:text-[var(--color-highlight-strong)] md:self-auto"
              >
                {t("common.viewAll")}
                <ArrowUpRight
                  size={13}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                />
              </Link>
            </div>
          </Reveal>

          {teamMembers.length > 0 && (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <Reveal key={member.id} delay={index * 0.05}>
                  <MemberCard member={member} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
