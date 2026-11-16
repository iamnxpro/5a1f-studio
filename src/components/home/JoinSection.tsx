import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { JoinForm } from "@/components/home/JoinForm";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/lib/contentLoader";

export function JoinSection() {
  const { t, language } = useLanguage();

  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="border-b border-[var(--color-border)] bg-[var(--color-bg-sunken)]"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Reveal>
            <p className="overline text-[var(--color-accent)]">{t("join.label")}</p>
            <h2
              id="join-title"
              className="font-heading mt-4 max-w-[14ch] text-[length:var(--text-3xl)]"
            >
              {t("join.title")}
            </h2>
            <p className="mt-5 max-w-xl text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-secondary)]">
              {t("join.subtitle")}
            </p>

            <div className="mt-8 border-t border-[var(--color-border)] pt-6">
              <p className="text-[11px] font-bold text-[var(--color-fg-primary)]">
                {t("join.fields.role")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {site.joinForm.roles.map((role) => (
                  <li
                    key={role.id}
                    className="border border-[var(--color-border-strong)] bg-[var(--color-bg-primary)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-fg-secondary)]"
                  >
                    {role.label[language]}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-5">
              <p className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-accent)]">
                <ShieldCheck size={15} aria-hidden="true" />
                {t("join.privacyNoticeTitle")}
              </p>
              <p className="mt-3 text-[12px] leading-[1.85] text-[var(--color-fg-secondary)]">
                {t("join.privacyNotice")}
              </p>
              <Link
                to="/privacy"
                className="mt-3 inline-block border-b border-[var(--color-border-strong)] pb-0.5 text-[11px] font-bold text-[var(--color-accent)] transition-colors hover:border-[var(--color-highlight-strong)] hover:text-[var(--color-highlight-strong)]"
              >
                {t("footer.privacy")}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-5 sm:p-7">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--color-accent),var(--color-highlight))]"
              />
              <div className="mb-6 flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
                <span className="font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-secondary)]">
                  {site.studioName} / {t("join.label")}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-accent)]">
                  <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
                  {t("hero.status")}
                </span>
              </div>
              <JoinForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
