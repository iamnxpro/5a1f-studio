import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { StudioLogo } from "@/components/ui/StudioLogo";
import { useLanguage } from "@/contexts/LanguageContext";
import { mediaUrl, site, studioSocial } from "@/lib/contentLoader";
import { FOOTER_NAV } from "@/lib/navigation";

export function Footer() {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();
  const channels = studioSocial.filter(
    (link) => link.href.trim().length > 0 && link.id !== "email",
  );
  const email = site.email.trim();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-sunken)] text-[var(--color-fg-primary)]">
      <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="inline-flex border border-[var(--color-border-strong)] bg-[var(--brand-void)] px-4 py-3">
              <StudioLogo imgClassName="h-8 w-auto max-w-[150px]" />
            </span>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-fg-secondary)]">
              {t("footer.tagline")}
            </p>
            <p className="mt-4 font-display text-[9px] tracking-[0.2em] text-[var(--color-fg-secondary)]">
              {t("footer.madeWith")}
            </p>
          </div>

          <nav aria-label={t("a11y.footerNav")}>
            <p className="overline text-[var(--color-accent)]">{t("footer.pages")}</p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-block py-1 text-sm font-semibold text-[var(--color-fg-secondary)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="overline text-[var(--color-accent)]">{t("footer.channels")}</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`https://wa.me/${site.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-[var(--color-fg-secondary)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {t("contact.whatsapp")}
                  <span className="sr-only">({t("a11y.openInNewTab")})</span>
                  <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
                </a>
              </li>

              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-[var(--color-fg-secondary)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {t("contact.email")}
                    <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
                  </a>
                </li>
              )}

              {channels.map((link) => {
                const icon = mediaUrl(link.icon);
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 py-1 text-sm font-semibold text-[var(--color-fg-secondary)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {icon && <img src={icon} alt="" className="size-4 opacity-70" />}
                      {link.label[language]}
                      <span className="sr-only">({t("a11y.openInNewTab")})</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-fg-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.studioFullName[language]} — {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="inline-block py-1.5 font-semibold transition-colors hover:text-[var(--color-accent)]"
            >
              {t("footer.privacy")}
            </Link>
            <span className="font-display text-[10px] tracking-[0.2em]">
              {site.studioName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
