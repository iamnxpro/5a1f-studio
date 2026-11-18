import { ArrowUpRight, Film } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TeamAvatar } from "@/components/ui/TeamAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { mediaUrl, productions, site, teamMembers } from "@/lib/contentLoader";
import { hasContent, padIndex } from "@/lib/presentation";
import { cn, isConfiguredHref } from "@/lib/utils";
import type { Production } from "@/types/content";

function ProductionArt({
  production,
  index,
  featured,
}: {
  production: Production;
  index: number;
  featured: boolean;
}) {
  const { language, t } = useLanguage();
  const cover = mediaUrl(production.cover);
  const title = hasContent(production.title[language])
    ? production.title[language]
    : t("common.projectUntitled");
  const formats = production.formats
    .map((format) => format[language])
    .filter(hasContent);

  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-[var(--color-void-border)] bg-[var(--color-void-raised)]",
        featured ? "min-h-[260px] lg:min-h-[360px]" : "aspect-[16/9]",
      )}
    >
      {cover ? (
        <img
          src={cover}
          alt={title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                index % 2 === 0
                  ? "radial-gradient(circle at 24% 22%, rgba(111,227,161,0.19), transparent 44%), radial-gradient(circle at 82% 84%, rgba(255,122,92,0.13), transparent 40%)"
                  : "radial-gradient(circle at 78% 18%, rgba(255,122,92,0.2), transparent 44%), radial-gradient(circle at 20% 84%, rgba(111,227,161,0.12), transparent 42%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(242,245,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(242,245,238,0.2) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
            }}
          />
          <span className="absolute -bottom-3 start-4 font-display text-[clamp(5rem,13vw,9rem)] leading-none text-[color-mix(in_srgb,var(--brand-paper)_8%,transparent)]">
            {padIndex(index)}
          </span>
          <Film
            size={featured ? 62 : 42}
            strokeWidth={1}
            className="absolute bottom-5 end-5 text-[color-mix(in_srgb,var(--color-neon-primary)_60%,transparent)]"
          />
          {formats[0] && (
            <span className="absolute bottom-5 start-4 max-w-[55%] truncate font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-inverse-muted)]">
              {formats[0]}
            </span>
          )}
        </div>
      )}

      <div className="absolute end-3 top-3 z-10">
        <StatusBadge status={production.status} />
      </div>
      {hasContent(production.year) && (
        <span className="absolute start-3 top-3 z-10 border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void)_82%,transparent)] px-2 py-1 font-display text-[9px] tracking-[0.16em] text-[var(--color-fg-inverse-muted)]">
          {production.year}
        </span>
      )}
    </div>
  );
}

function ProductionCard({
  production,
  index,
  featured,
}: {
  production: Production;
  index: number;
  featured: boolean;
}) {
  const { t, language } = useLanguage();
  const title = hasContent(production.title[language])
    ? production.title[language]
    : t("common.projectUntitled");
  const tagline = hasContent(production.tagline[language]) ? production.tagline[language] : undefined;
  const description = hasContent(production.description[language])
    ? production.description[language]
    : undefined;
  const formats = production.formats
    .map((format) => format[language])
    .filter(hasContent);
  const links = production.links.filter(
    (link) => isConfiguredHref(link.href) && hasContent(link.label[language]),
  );

  return (
    <article
      className={cn(
        "group flex h-full flex-col border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void-raised)_72%,transparent)] transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--color-neon-primary)_38%,transparent)]",
        featured && "lg:grid lg:grid-cols-[1.08fr_0.92fr]",
      )}
    >
      <ProductionArt production={production} index={index} featured={featured} />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col p-5 sm:p-6",
          featured && "lg:justify-between lg:p-8",
        )}
      >
        <div>
          {formats.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {formats.map((format) => (
                <li
                  key={format}
                  className="border border-[var(--color-void-border)] px-2 py-1 text-[10px] font-semibold text-[var(--color-fg-inverse-muted)]"
                >
                  {format}
                </li>
              ))}
            </ul>
          )}

          <h2
            className={cn(
              "font-heading mt-4 text-[var(--color-fg-inverse)]",
              featured
                ? "text-[length:clamp(2rem,3.6vw,3.3rem)]"
                : "text-[length:var(--text-2xl)]",
            )}
          >
            {title}
          </h2>

          <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
            {tagline ?? description ?? t("productions.comingSoonNote")}
          </p>

          {featured && description && tagline && (
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
              {description}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-void-border)] pt-4">
          <span className="font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-inverse-muted)]">
            {site.studioName} / {production.year}
          </span>

          {links.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border-b border-[var(--color-neon-primary)] pb-0.5 text-[11px] font-bold text-[var(--color-neon-primary)] transition-colors hover:border-[var(--color-neon-secondary)] hover:text-[var(--color-neon-secondary)]"
                  >
                    {link.label[language]}
                    <span className="sr-only">({t("a11y.openInNewTab")})</span>
                    <ArrowUpRight size={12} aria-hidden="true" className="rtl:-scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-[10px] font-semibold text-[var(--color-fg-inverse-muted)]">
              {t("productions.comingSoonNote")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProductionsPage() {
  const { t, language } = useLanguage();
  const lead = teamMembers.find((member) => member.id === "abdulsamad");
  const featured = productions.find((item) => item.featured) ?? productions[0];
  const rest = featured ? productions.filter((item) => item.id !== featured.id) : productions;

  usePageMeta({
    title: `${t("productions.label")} — ${site.studioFullName[language]}`,
    description: t("productions.subtitle"),
  });

  return (
    <div className="zone-void min-h-[70vh]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,245,238,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(242,245,238,0.16) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative">
        <PageHeader
          tone="void"
          label={t("productions.label")}
          title={t("productions.title")}
          subtitle={t("productions.subtitle")}
          aside={
            lead && (
              <div className="flex items-center gap-3 border border-[var(--color-void-border)] p-3">
                <TeamAvatar
                  member={lead}
                  className="size-10 border-[var(--color-void-border)]"
                />
                <div>
                  <p className="overline text-[var(--color-neon-primary)]">
                    {t("productions.byAbdulSamad")}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--color-fg-inverse-muted)]">
                    {lead.name[language]} · {lead.role[language]}
                  </p>
                </div>
              </div>
            )
          }
        />

        <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-10">
          <Reveal>
            <p className="mb-8 max-w-3xl border-s-2 border-[var(--color-neon-primary)] ps-4 text-[12px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
              {t("productions.attribution")}
            </p>
          </Reveal>

          {productions.length === 0 || !featured ? (
            <Reveal>
              <div className="border border-dashed border-[var(--color-void-border)] p-8 sm:p-12">
                <Film
                  size={26}
                  aria-hidden="true"
                  className="text-[var(--color-neon-primary)]"
                />
                <p className="mt-5 max-w-lg text-[var(--color-fg-inverse-muted)]">
                  {t("productions.empty")}
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-6">
              <Reveal>
                <ProductionCard production={featured} index={productions.indexOf(featured)} featured />
              </Reveal>
              <div className="grid gap-5 md:grid-cols-2">
                {rest.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.06}>
                    <ProductionCard
                      production={item}
                      index={productions.indexOf(item)}
                      featured={false}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
