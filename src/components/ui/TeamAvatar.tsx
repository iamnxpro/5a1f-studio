import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mediaUrl } from "@/lib/contentLoader";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types/content";

type TeamAvatarProps = {
  member: TeamMember;
  className?: string;
  imageClassName?: string;
};

/**
 * Stylised avatar with an initials fallback.
 * Avatars must never be real photographs of faces — see README.
 */
export function TeamAvatar({ member, className, imageClassName }: TeamAvatarProps) {
  const { language, t } = useLanguage();
  const src = mediaUrl(member.avatar);
  const [failed, setFailed] = useState(false);

  const name = member.name[language];
  const initials = Array.from(name).slice(0, 2).join("");

  return (
    <span
      className={cn(
        "relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
        className,
      )}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={member.avatarAlt[language] || `${name} ${t("team.avatarAlt")}`}
          className={cn("h-full w-full object-cover", imageClassName)}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-heading text-xl leading-none tracking-normal"
        >
          {initials}
        </span>
      )}
    </span>
  );
}
