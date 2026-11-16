import { CheckCircle2, CircleAlert, Gamepad2, Users, Wrench } from "lucide-react";
import { StudioLogo } from "@/components/ui/StudioLogo";
import { TeamAvatar } from "@/components/ui/TeamAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { games, site, software, teamMembers } from "@/lib/contentLoader";

/**
 * PHASE 1 VERIFICATION PAGE (temporary).
 * Proves the extracted design tokens, the bilingual engine and the content
 * loader. It is replaced by the real Home composition in Phase 3.
 */

const palette = [
  { token: "--brand-paper", value: "#f5f0e5" },
  { token: "--brand-paper-deep", value: "#e8dfcf" },
  { token: "--brand-ink", value: "#222420" },
  { token: "--brand-olive", value: "#254f43" },
  { token: "--brand-coral", value: "#cf6248" },
  { token: "--brand-void", value: "#0c100e" },
  { token: "--brand-void-raised", value: "#121915" },
  { token: "--brand-void-card", value: "#16201a" },
  { token: "--brand-neon-primary", value: "#6fe3a1" },
  { token: "--brand-neon-secondary", value: "#ff7a5c" },
  { token: "--brand-olive-soft", value: "#d8e0d0" },
  { token: "--brand-ink-faint", value: "#67675d" },
];

export default function FoundationPage() {
  const { t, language, dir } = useLanguage();

  const counters = [
    { icon: Users, value: teamMembers.length, label: t("foundation.teamCount") },
    { icon: Gamepad2, value: games.length, label: t("foundation.gamesCount") },
    { icon: Wrench, value: software.length, label: t("foundation.softwareCount") },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-fg-primary)]">
      <div className="paper-noise" aria-hidden="true" />

      <div>
        {/* ---------------------------------------------------------- hero ---- */}
        <section className="zone-void relative overflow-hidden border-b border-[var(--color-void-border)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle at 22% 18%, rgba(111,227,161,0.16), transparent 46%), radial-gradient(circle at 82% 82%, rgba(255,122,92,0.12), transparent 42%)",
            }}
          />
          <div className="relative mx-auto flex max-w-[1440px] flex-col gap-12 px-[var(--section-pad-x)] py-[var(--section-pad-y)] md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="overline flex items-center gap-2 text-[var(--color-neon-primary)]">
                <span className="size-2 rounded-full bg-[var(--color-neon-primary)] shadow-[var(--glow-primary)]" />
                {t("foundation.label")}
              </p>
              <h1 className="font-heading mt-6 text-[length:var(--text-display)] text-[var(--color-fg-inverse)]">
                {t("foundation.title")}
              </h1>
              <p className="mt-6 max-w-xl text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-inverse-muted)]">
                {t("foundation.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="border border-[color-mix(in_srgb,var(--color-neon-primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-neon-primary)_10%,transparent)] px-3 py-2 text-[11px] font-bold text-[var(--color-neon-primary)]">
                  {t("hero.status")}
                </span>
                <span className="font-display text-[10px] tracking-[0.16em] text-[var(--color-fg-inverse-muted)]">
                  {site.studioName} — {t("hero.brandNote")}
                </span>
              </div>
            </div>

            <div className="shrink-0 md:ps-10">
              <StudioLogo imgClassName="h-16 w-auto drop-shadow-[0_0_28px_rgba(111,227,161,0.18)] md:h-20" />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- palette ---- */}
        <section className="zone-paper px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="overline text-[var(--color-accent)]">{t("foundation.paletteTitle")}</p>
                <h2 className="font-heading mt-3 text-[length:var(--text-3xl)]">
                  {t("foundation.paletteTitle")}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {t("foundation.paletteNote")}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3 lg:grid-cols-6">
              {palette.map((entry) => (
                <div key={entry.token} className="bg-[var(--color-bg-elevated)] p-3">
                  <div
                    className="h-20 w-full border border-black/10"
                    style={{ background: `var(${entry.token})` }}
                  />
                  <p className="mt-3 font-display text-[9px] tracking-[0.08em] text-[var(--color-fg-muted)]">
                    {entry.token}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase">{entry.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- typography ---- */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-sunken)] px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-5 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="overline text-[var(--color-accent)]">{t("foundation.typeTitle")}</p>
                <h2 className="font-heading mt-3 text-[length:var(--text-3xl)]">
                  {t("foundation.typeTitle")}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {t("foundation.typeNote")}
              </p>
            </div>

            <div className="grid gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
              <article className="bg-[var(--color-bg-elevated)] p-6">
                <p className="font-display text-[10px] tracking-[0.14em] text-[var(--color-fg-muted)]">
                  INTER — UI
                </p>
                <p className="mt-5 text-4xl" style={{ fontFamily: "var(--font-sans)" }}>
                  Aa 0123
                </p>
                <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                  {t("foundation.latinReady")}
                </p>
              </article>

              <article className="bg-[var(--color-bg-elevated)] p-6">
                <p className="font-display text-[10px] tracking-[0.14em] text-[var(--color-fg-muted)]">
                  DM SERIF DISPLAY — HEADINGS
                </p>
                <p
                  className="mt-5 text-4xl tracking-[-0.03em]"
                  style={{ fontFamily: "var(--font-serif-en)" }}
                >
                  Studio
                </p>
                <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                  {t("foundation.latinReady")}
                </p>
              </article>

              <article className="bg-[var(--color-bg-elevated)] p-6">
                <p className="font-display text-[10px] tracking-[0.14em] text-[var(--color-fg-muted)]">
                  ORBITRON — DISPLAY / NUMBERS
                </p>
                <p className="font-display mt-5 text-3xl tracking-[0.06em]">5A1F 2026</p>
                <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                  {t("foundation.latinReady")}
                </p>
              </article>
            </div>

            <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <p className="overline text-[var(--color-highlight)]">
                {t("foundation.arabicPending")}
              </p>
              <p
                lang="ar"
                dir="rtl"
                className="mt-4 text-3xl leading-snug"
                style={{ fontFamily: "var(--font-arabic-serif)" }}
              >
                {teamMembers.map((member) => member.name.ar).join(" · ")}
              </p>
              <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                {t("a11y.toggleLanguage")} · {language.toUpperCase()} · {dir.toUpperCase()}
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- content engine ---- */}
        <section className="zone-void px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="overline text-[var(--color-neon-primary)]">
                  {t("foundation.contentTitle")}
                </p>
                <h2 className="font-heading mt-3 text-[length:var(--text-3xl)] text-[var(--color-fg-inverse)]">
                  {t("foundation.contentTitle")}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[var(--color-fg-inverse-muted)]">
                {t("foundation.contentNote")}
              </p>
            </div>

            <div className="mt-10 grid gap-px border border-[var(--color-void-border)] bg-[var(--color-void-border)] sm:grid-cols-3">
              {counters.map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-[var(--color-void-raised)] p-6">
                  <Icon
                    size={22}
                    aria-hidden="true"
                    className="text-[var(--color-neon-primary)]"
                  />
                  <p className="font-display mt-4 text-4xl text-[var(--color-fg-inverse)]">
                    {String(value).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-fg-inverse-muted)]">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <TeamAvatar
                    member={member}
                    className="size-12 border-[var(--color-neon-primary)]/40"
                  />
                  <div>
                    <p className="text-sm font-bold text-[var(--color-fg-inverse)]">
                      {member.name[language]}
                    </p>
                    <p className="text-xs text-[var(--color-fg-inverse-muted)]">
                      {member.role[language]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 border-t border-[var(--color-void-border)] pt-8 sm:grid-cols-2">
              <p className="flex items-center gap-2 text-sm text-[var(--color-fg-inverse)]">
                <CheckCircle2
                  size={16}
                  aria-hidden="true"
                  className="text-[var(--color-neon-primary)]"
                />
                {t("foundation.latinReady")}
              </p>
              <p className="flex items-center gap-2 text-sm text-[var(--color-fg-inverse)]">
                <CircleAlert
                  size={16}
                  aria-hidden="true"
                  className="text-[var(--color-neon-secondary)]"
                />
                {t("foundation.arabicPending")}
              </p>
            </div>
            <p className="mt-4 text-xs text-[var(--color-fg-inverse-muted)]">
              {t("foundation.fontsNote")}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
