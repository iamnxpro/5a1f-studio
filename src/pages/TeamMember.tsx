import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { TeamAvatar } from "@/components/ui/TeamAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { site, teamMembers } from "@/lib/contentLoader";
import { cleanList, hasContent } from "@/lib/presentation";

export default function TeamMember() {
  const { memberId } = useParams<{ memberId: string }>();
  const { t, language } = useLanguage();
  const member = teamMembers.find((item) => item.id === memberId);
  const index = member ? teamMembers.findIndex((item) => item.id === member.id) : -1;

  usePageMeta({
    title: member
      ? `${member.name[language]} — ${site.studioFullName[language]}`
      : `${t("team.notFound")} — ${site.studioFullName[language]}`,
    description: member ? member.role[language] : t("team.notFound"),
    noindex: !member,
  });

  if (!member) {
    return (
      <div className="zone-paper relative grid min-h-[70vh] place-items-center px-[var(--section-pad-x)] py-20">
        <div className="max-w-lg text-center">
          <p className="overline text-[var(--color-accent)]">{t("team.label")}</p>
          <h1 className="font-heading mt-4 text-[length:var(--text-3xl)]">
            {t("team.notFound")}
          </h1>
          <Link
            to="/team"
            className="mt-8 inline-flex items-center gap-2 border-b border-[var(--color-accent)] pb-1 text-sm font-bold text-[var(--color-accent)] transition-colors hover:border-[var(--color-highlight-strong)] hover:text-[var(--color-highlight-strong)]"
          >
            <ArrowLeft size={16} aria-hidden="true" className="rtl:rotate-180" />
            {t("team.back")}
          </Link>
        </div>
      </div>
    );
  }

  const bio = hasContent(member.bio[language]) ? member.bio[language] : undefined;
  const skills = cleanList(member.skills);

  return (
    <div className="zone-paper relative min-h-[70vh]">
      <div className="paper-noise" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-[clamp(44px,7vw,88px)]">
        <Link
          to="/team"
          className="group inline-flex items-center gap-2 border-b border-[var(--color-border-strong)] pb-1 text-[11px] font-bold text-[var(--color-accent)] transition-colors hover:border-[var(--color-highlight-strong)] hover:text-[var(--color-highlight-strong)]"
        >
          <ArrowLeft
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
          />
          {t("team.back")}
        </Link>

        <div className="mt-8 grid gap-10 border-b border-[var(--color-border)] pb-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-start gap-5 sm:flex-nowrap">
              <TeamAvatar
                member={member}
                className="size-24 border-[var(--color-border-strong)] sm:size-32"
              />
              <div className="min-w-0">
                <p className="overline text-[var(--color-accent)]">
                  {t("team.member")} · {String(index + 1).padStart(2, "0")}
                </p>
                <h1 className="font-heading mt-2 text-[length:clamp(2.5rem,5vw,4.4rem)]">
                  {member.name[language]}
                </h1>
                <p className="mt-2 max-w-md text-[13px] font-semibold leading-relaxed text-[var(--color-fg-secondary)]">
                  {member.role[language]}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--color-border)] pt-5">
              <p className="overline text-[var(--color-accent)]">{t("team.social")}</p>
              <SocialLinks
                links={member.social}
                tone="light"
                showLabels
                size="md"
                className="mt-3"
              />
            </div>
          </div>

          <div className="min-w-0">
            {bio ? (
              <p className="text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-secondary)]">
                {bio}
              </p>
            ) : (
              <blockquote className="border-s-2 border-[var(--color-accent)] ps-5">
                <p className="font-heading text-[length:var(--text-2xl)] leading-[1.35] text-[var(--color-fg-primary)]">
                  {t("about.quote")}
                </p>
                <footer className="mt-3 text-[11px] font-semibold text-[var(--color-fg-secondary)]">
                  {site.studioFullName[language]}
                </footer>
              </blockquote>
            )}

            {skills.length > 0 && (
              <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                <p className="overline text-[var(--color-accent)]">{t("team.skills")}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[11px] font-semibold text-[var(--color-fg-secondary)]"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 border-t border-[var(--color-border)] pt-6">
              <p className="text-[11px] leading-relaxed text-[var(--color-fg-secondary)]">
                {t("about.teamSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
