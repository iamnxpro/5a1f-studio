import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const { t } = useLanguage();

  const sections = [
    { title: t("privacy.dataTitle"), body: t("privacy.dataBody") },
    { title: t("privacy.cookiesTitle"), body: t("privacy.cookiesBody") },
    { title: t("privacy.contactTitle"), body: t("privacy.contactBody") },
  ];

  return (
    <div className="zone-paper relative">
      <div className="paper-noise" aria-hidden="true" />

      <article className="relative mx-auto max-w-3xl px-[var(--section-pad-x)] py-[clamp(56px,9vw,120px)]">
        <p className="overline text-[var(--color-accent)]">{t("privacy.label")}</p>
        <h1 className="font-heading mt-4 text-[length:var(--text-display)]">
          {t("privacy.title")}
        </h1>
        <p className="mt-6 text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-secondary)]">
          {t("privacy.intro")}
        </p>

        <div className="mt-12 space-y-10 border-t border-[var(--color-border)] pt-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-[length:var(--text-2xl)]">{section.title}</h2>
              <p className="mt-3 text-[length:var(--text-base)] leading-[var(--leading-body)] text-[var(--color-fg-secondary)]">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <Link
          to="/"
          className="mt-14 inline-flex items-center gap-2 border-b border-[var(--color-accent)] pb-1 text-sm font-bold text-[var(--color-accent)] transition-colors hover:text-[var(--color-highlight)] hover:border-[var(--color-highlight)]"
        >
          <ArrowLeft size={16} aria-hidden="true" className="rtl:rotate-180" />
          {t("privacy.back")}
        </Link>
      </article>
    </div>
  );
}
