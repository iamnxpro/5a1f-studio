import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { TeamAvatar } from "@/components/ui/TeamAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { cleanList } from "@/lib/presentation";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types/content";

type MemberCardProps = {
  member: TeamMember;
  variant?: "compact" | "full";
  className?: string;
};

/**
 * A whole card is one link, which keeps touch targets large and avoids nesting
 * interactive elements. Social links live on the member profile page.
 */
export function MemberCard({ member, variant = "compact", className }: MemberCardProps) {
  const { t, language } = useLanguage();
  const skills = cleanList(member.skills).slice(0, variant === "full" ? 3 : 2);
  const full = variant === "full";

  return (
    <Link
      to={`/team/${member.id}`}
      className={cn(
        "group relative flex h-full flex-col border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[0_18px_40px_-30px_rgba(34,36,32,0.6)] sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <TeamAvatar
          member={member}
          className={full ? "size-20 border-[var(--color-border-strong)]" : "size-16"}
        />
        <span className="inline-flex items-center gap-1.5 border border-[var(--color-border)] px-2 py-1 text-[9px] font-bold text-[var(--color-fg-secondary)] transition-colors group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]">
          {t("team.label")}
          <ArrowUpRight
            size={11}
            aria-hidden="true"
            className="rtl:-scale-x-100"
          />
        </span>
      </div>

      <h3 className="font-heading mt-5 text-[length:var(--text-xl)] text-[var(--color-fg-primary)]">
        {member.name[language]}
      </h3>
      {full && member.kunya && (
        <p className="mt-0.5 text-[11px] font-semibold text-[var(--color-fg-muted)]">
          <span className="sr-only">{t("team.kunya")}: </span>
          {member.kunya[language]}
        </p>
      )}
      <p className="mt-1 text-[12px] font-semibold leading-snug text-[var(--color-fg-secondary)]">
        {member.role[language]}
      </p>
      {member.country && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-fg-muted)]">
          <MapPin size={11} aria-hidden="true" className="shrink-0" />
          <span className="sr-only">{t("team.country")}: </span>
          {member.country[language]}
        </p>
      )}

      {skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li
              key={skill}
              className="border border-[var(--color-border)] px-2 py-1 text-[10px] font-semibold text-[var(--color-fg-secondary)]"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      <span
        aria-hidden="true"
        className="mt-auto block pt-6 font-display text-[9px] tracking-[0.2em] text-[var(--color-fg-muted)]"
      >
        {member.id}
      </span>
    </Link>
  );
}
