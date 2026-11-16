import { MemberCard } from "@/components/ui/MemberCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { site, teamMembers } from "@/lib/contentLoader";

export default function Team() {
  const { t, language } = useLanguage();

  usePageMeta({
    title: `${t("about.teamTitle")} — ${site.studioFullName[language]}`,
    description: t("about.teamSubtitle"),
  });

  return (
    <div className="zone-paper relative min-h-[70vh]">
      <div className="paper-noise" aria-hidden="true" />

      <div className="relative">
        <PageHeader
          label={t("about.teamLabel")}
          title={t("about.teamTitle")}
          subtitle={t("about.teamSubtitle")}
        />

        <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Reveal key={member.id} delay={index * 0.05}>
                <MemberCard member={member} variant="full" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
