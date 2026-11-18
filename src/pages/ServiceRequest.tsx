import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { site } from "@/lib/contentLoader";
import { whatsappHref } from "@/lib/presentation";

export default function ServiceRequest() {
  const { t, language } = useLanguage();

  usePageMeta({
    title: `${t("services.label")} — ${site.studioFullName[language]}`,
    description: t("services.subtitle"),
  });

  return (
    <div className="zone-paper relative min-h-[70vh]">
      <div className="paper-noise" aria-hidden="true" />

      <div className="relative">
        <PageHeader
          label={t("services.label")}
          title={t("services.title")}
          subtitle={t("services.subtitle")}
        />

        <section className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-10">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <Reveal>
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="text-[11px] font-bold text-[var(--color-accent)]">
                  {t("services.label")}
                </p>
                <p className="mt-3 max-w-xl text-[12px] leading-[1.85] text-[var(--color-fg-secondary)]">
                  {t("services.subtitle")}
                </p>
              </div>

              <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-5">
                <p className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-accent)]">
                  <ShieldCheck size={15} aria-hidden="true" />
                  {t("services.privacyNoticeTitle")}
                </p>
                <p className="mt-3 text-[12px] leading-[1.85] text-[var(--color-fg-secondary)]">
                  {t("services.privacyNotice")}
                </p>
              </div>

              <div className="mt-8 grid gap-2">
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-[12px] font-bold text-[var(--color-accent)]"
                >
                  <Mail size={14} aria-hidden="true" />
                  <span className="truncate">{site.email}</span>
                </a>
                <a
                  href={whatsappHref(site.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[12px] font-bold text-[var(--color-accent)]"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  {t("contact.whatsapp")}
                </a>
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
                    {site.studioName} / {t("services.label")}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-accent)]">
                    <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
                    {t("hero.status")}
                  </span>
                </div>
                <ServiceRequestForm />
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
