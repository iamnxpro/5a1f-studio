import { ArrowUpRight, Code2, Wrench } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TeamAvatar } from "@/components/ui/TeamAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { mediaUrl, site, software, teamMembers } from "@/lib/contentLoader";
import { cleanList, hasContent, padIndex } from "@/lib/presentation";
import { isConfiguredHref } from "@/lib/utils";
import type { Software } from "@/types/content";

function ToolArt({ tool, index }: { tool: Software; index: number }) {
  const cover = mediaUrl(tool.cover);

  return (
    <div className="relative min-h-[220px] overflow-hidden border-b border-[var(--color-void-border)] bg-[var(--color-void-raised)] lg:min-h-full lg:border-b-0 lg:border-e">
      {cover ? (
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 24%, rgba(111,227,161,0.18), transparent 44%), radial-gradient(circle at 78% 82%, rgba(255,122,92,0.12), transparent 40%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(242,245,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(242,245,238,0.18) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(circle at 50% 50%, black, transparent 76%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 76%)",
            }}
          />
          <span className="absolute -bottom-4 start-5 font-display text-[clamp(4.5rem,11vw,7rem)] leading-none text-[color-mix(in_srgb,var(--brand-paper)_8%,transparent)]">
            {padIndex(index)}
          </span>
          <Code2
            size={44}
            strokeWidth={1}
            className="absolute bottom-6 end-6 text-[color-mix(in_srgb,var(--color-neon-primary)_62%,transparent)]"
          />
        </div>
      )}
      <div className="absolute end-3 top-3">
        <StatusBadge status={tool.status} />
      </div>
    </div>
  );
}

function ToolCard({ tool, index }: { tool: Software; index: number }) {
  const { t, language } = useLanguage();
  const name = hasContent(tool.name) ? tool.name : t("common.projectUntitled");
  const tagline = hasContent(tool.tagline[language]) ? tool.tagline[language] : undefined;
  const description = hasContent(tool.description[language])
    ? tool.description[language]
    : undefined;
  const specs = tool.specs.filter(
    (spec) => hasContent(spec.label[language]) && hasContent(spec.value),
  );
  const links = tool.links.filter(
    (link) => isConfiguredHref(link.href) && hasContent(link.label[language]),
  );
  const platforms = cleanList(tool.platforms);

  return (
    <article className="group grid border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void-raised)_72%,transparent)] transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--color-neon-primary)_38%,transparent)] lg:grid-cols-[0.72fr_1.28fr]">
      <ToolArt tool={tool} index={index} />

      <div className="min-w-0 p-5 sm:p-7">
        <h2 className="font-heading text-[length:var(--text-2xl)] text-[var(--color-fg-inverse)]">
          {name}
        </h2>

        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
          {tagline ?? description ?? t("common.inDevelopment")}
        </p>

        {tagline && description && (
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
            {description}
          </p>
        )}

        {(platforms.length > 0 || specs.length > 0) && (
          <div className="mt-6 grid gap-5 border-t border-[var(--color-void-border)] pt-5 sm:grid-cols-2">
            {platforms.length > 0 && (
              <div>
                <p className="overline text-[var(--color-neon-primary)]">
                  {t("games.platforms")}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {platforms.map((platform) => (
                    <li
                      key={platform}
                      className="border border-[var(--color-void-border)] px-2 py-1 text-[10px] font-semibold text-[var(--color-fg-inverse-muted)]"
                    >
                      {platform}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {specs.length > 0 && (
              <div>
                <p className="overline text-[var(--color-neon-primary)]">
                  {t("software.specs")}
                </p>
                <dl className="mt-3 grid gap-2">
                  {specs.map((spec) => (
                    <div
                      key={spec.label[language]}
                      className="flex items-baseline justify-between gap-4 border-b border-[var(--color-void-border)] pb-1.5 text-[11px]"
                    >
                      <dt className="text-[var(--color-fg-inverse-muted)]">
                        {spec.label[language]}
                      </dt>
                      <dd className="font-display text-[var(--color-fg-inverse)]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-void-border)] pt-4">
          <span className="font-display text-[9px] tracking-[0.16em] text-[var(--color-fg-inverse-muted)]">
            {site.studioName}
          </span>

          {links.length > 0 ? (
            <ul className="flex flex-wrap gap-4">
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
                    <ArrowUpRight
                      size={12}
                      aria-hidden="true"
                      className="rtl:-scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-[10px] font-semibold text-[var(--color-fg-inverse-muted)]">
              {t("games.comingSoonNote")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SoftwarePage() {
  const { t, language } = useLanguage();
  const amin = teamMembers.find((member) => member.id === "amin");

  usePageMeta({
    title: `${t("software.title")} — ${site.studioFullName[language]}`,
    description: t("software.subtitle"),
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
          label={t("software.label")}
          title={t("software.title")}
          subtitle={t("software.subtitle")}
          aside={
            amin && (
              <div className="flex items-center gap-3 border border-[var(--color-void-border)] p-3">
                <TeamAvatar
                  member={amin}
                  className="size-10 border-[var(--color-void-border)]"
                />
                <div>
                  <p className="overline text-[var(--color-neon-primary)]">
                    {t("software.byAmin")}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--color-fg-inverse-muted)]">
                    {amin.role[language]}
                  </p>
                </div>
              </div>
            )
          }
        />

        <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-10">
          {software.length === 0 ? (
            <Reveal>
              <div className="border border-dashed border-[var(--color-void-border)] p-8 sm:p-12">
                <Wrench
                  size={26}
                  aria-hidden="true"
                  className="text-[var(--color-neon-primary)]"
                />
                <p className="mt-5 max-w-lg text-[var(--color-fg-inverse-muted)]">
                  {t("software.empty")}
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-6">
              {software.map((tool, index) => (
                <Reveal key={tool.id} delay={index * 0.06}>
                  <ToolCard tool={tool} index={index} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
