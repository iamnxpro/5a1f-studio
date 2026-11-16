import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { site } from "@/lib/contentLoader";

export default function NotFound() {
  const { t, language } = useLanguage();

  usePageMeta({
    title: `${t("notFound.title")} — ${site.studioFullName[language]}`,
    description: t("notFound.body"),
    noindex: true,
  });

  return (
    <div className="zone-void grid min-h-[70vh] place-items-center px-[var(--section-pad-x)] py-20">
      <div className="max-w-lg text-center">
        <p className="font-display text-[11px] tracking-[0.2em] text-[var(--color-neon-secondary)]">
          404
        </p>
        <h1 className="font-heading mt-4 text-[length:var(--text-3xl)] text-[var(--color-fg-inverse)]">
          {t("notFound.title")}
        </h1>
        <p className="mt-4 text-[var(--color-fg-inverse-muted)]">{t("notFound.body")}</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 border-b border-[var(--color-neon-primary)] pb-1 text-sm font-bold text-[var(--color-neon-primary)]"
        >
          <ArrowLeft size={16} aria-hidden="true" className="rtl:rotate-180" />
          {t("notFound.back")}
        </Link>
      </div>
    </div>
  );
}
