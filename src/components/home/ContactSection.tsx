import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Link2,
  Mail,
  MessageCircle,
  MousePointer2,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { TeamAvatar } from "@/components/ui/TeamAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  mediaUrl,
  site,
  studioSocial,
  teamMembers,
} from "@/lib/contentLoader";
import { whatsappHref } from "@/lib/presentation";
import { cn, isConfiguredHref, isExternalHref } from "@/lib/utils";
import type { TeamMember } from "@/types/content";

type Channel = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  external: boolean;
  fallback: ComponentType<{ size?: number; "aria-hidden"?: boolean; className?: string }>;
};

function ChannelIcon({ channel }: { channel: Channel }) {
  const icon = mediaUrl(channel.icon);
  const Fallback = channel.fallback;

  return (
    <span className="grid size-10 shrink-0 place-items-center border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--brand-paper)_5%,transparent)]">
      {icon ? (
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="size-4 object-contain opacity-90"
        />
      ) : (
        <Fallback size={16} aria-hidden={true} className="text-[var(--color-neon-primary)]" />
      )}
    </span>
  );
}

function MemberOrbit({ member }: { member: TeamMember }) {
  const { language, t } = useLanguage();
  const links = member.social.filter((link) => isConfiguredHref(link.href));

  return (
    <div className="member-orbit relative grid size-32 shrink-0 place-items-center">
      <span
        aria-hidden="true"
        className="orbit-spin-reverse absolute inset-1 rounded-full border border-dashed border-[color-mix(in_srgb,var(--color-neon-primary)_24%,transparent)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-6 rounded-full border border-[color-mix(in_srgb,var(--color-neon-secondary)_18%,transparent)]"
      />
      <TeamAvatar
        member={member}
        className="size-14 border-[var(--color-void-border)] text-[var(--color-neon-primary)]"
      />

      {links.length > 0 && (
        <ul
          aria-label={`${member.name[language]} - ${t("contact.teamOrbitTitle")}`}
          className="orbit-spin absolute inset-0"
        >
          {links.map((link, index) => {
            const angle = -90 + (360 / links.length) * index;
            const icon = mediaUrl(link.icon);
            const external = isExternalHref(link.href);
            const label = link.label[language];

            return (
              <li
                key={link.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(2.75rem) rotate(${-angle}deg)`,
                }}
              >
                <span className="orbit-counter block">
                  <a
                    href={link.href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${label}${external ? ` (${t("a11y.openInNewTab")})` : ""}`}
                    className={cn(
                      "grid size-7 place-items-center rounded-full border border-[var(--color-void-border)]",
                      "bg-[color-mix(in_srgb,var(--color-void-raised)_88%,transparent)] text-[var(--color-fg-inverse-muted)]",
                      "transition-colors hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-neon-primary)]",
                    )}
                  >
                    {icon ? (
                      <img
                        src={icon}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="size-3.5 object-contain opacity-90"
                      />
                    ) : (
                      <Link2 size={14} aria-hidden="true" />
                    )}
                  </a>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ContactSection() {
  const { t, language } = useLanguage();
  const allTeamLinks = teamMembers.flatMap((member) => member.social);
  const emailLink = allTeamLinks.find((link) => link.id === "email");
  const email = site.email.trim();
  const emailIcon =
    studioSocial.find((link) => link.id === "email")?.icon ?? emailLink?.icon;
  const whatsappIcon = allTeamLinks.find((link) => link.id === "whatsapp")?.icon;
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard can be blocked; the mailto row still works */
    }
  };

  const studioChannels: Channel[] = [
    {
      id: "whatsapp",
      label: t("contact.whatsapp"),
      href: whatsappHref(site.whatsappNumber),
      icon: whatsappIcon,
      external: true,
      fallback: MessageCircle,
    },
    ...(email
      ? [
          {
            id: "email",
            label: t("contact.email"),
            href: `mailto:${email}`,
            icon: emailIcon,
            external: false,
            fallback: Mail,
          } satisfies Channel,
        ]
      : []),
    ...studioSocial
      .filter((link) => isConfiguredHref(link.href) && link.id !== "email")
      .map(
        (link) =>
          ({
            id: link.id,
            label: link.label[language],
            href: link.href,
            icon: link.icon,
            external: true,
            fallback: Link2,
          }) satisfies Channel,
      ),
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="zone-void relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 20%, rgba(111,227,161,0.11), transparent 42%), radial-gradient(circle at 86% 78%, rgba(255,122,92,0.09), transparent 40%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,245,238,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(242,245,238,0.16) 1px, transparent 1px)",
          backgroundSize: "68px 68px",
          maskImage: "radial-gradient(circle at 70% 50%, black, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 70% 50%, black, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <Reveal>
            <p className="overline text-[var(--color-neon-primary)]">{t("contact.label")}</p>
            <h2
              id="contact-title"
              className="font-heading mt-4 max-w-[12ch] text-[length:var(--text-3xl)] text-[var(--color-fg-inverse)]"
            >
              {t("contact.title")}
            </h2>
            <p className="mt-5 max-w-md text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-inverse-muted)]">
              {t("contact.subtitle")}
            </p>

            {email && (
              <a
                href={`mailto:${email}`}
                className="group mt-8 inline-flex max-w-full items-center gap-2 border-b border-[var(--color-neon-primary)] pb-1 text-[13px] font-bold text-[var(--color-neon-primary)] transition-colors hover:border-[var(--color-neon-secondary)] hover:text-[var(--color-neon-secondary)]"
              >
                <Mail size={14} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{email}</span>
                <ArrowUpRight
                  size={13}
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100"
                />
              </a>
            )}

            <p className="mt-8 flex items-center gap-2 text-[11px] text-[var(--color-fg-inverse-muted)]">
              <MousePointer2 size={13} aria-hidden="true" />
              {t("contact.pauseHint")}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0">
            <div className="group relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-10 hidden opacity-70 sm:block"
              >
                <span className="orbit-spin absolute inset-0 rounded-full border border-dashed border-[color-mix(in_srgb,var(--color-neon-primary)_18%,transparent)]" />
                <span className="orbit-spin-reverse absolute inset-[13%] rounded-full border border-[color-mix(in_srgb,var(--color-neon-secondary)_14%,transparent)]" />
                <span className="absolute left-[12%] top-[8%] size-1.5 rounded-full bg-[var(--color-neon-primary)]" />
                <span className="absolute bottom-[12%] right-[10%] size-1.5 rounded-full bg-[var(--color-neon-secondary)]" />
              </div>

              <div className="relative grid gap-4">
                <div className="border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void-raised)_78%,transparent)] p-4 backdrop-blur-sm sm:p-5">
                  <p className="overline text-[var(--color-neon-primary)]">
                    {t("contact.studioOrbitTitle")}
                  </p>
                  <ul className="mt-4 grid gap-2.5">
                    {studioChannels.map((channel) => (
                      <li
                        key={channel.id}
                        className="flex items-stretch border border-[var(--color-void-border)] transition-colors hover:border-[color-mix(in_srgb,var(--color-neon-primary)_42%,transparent)]"
                      >
                        <a
                          href={channel.href}
                          {...(channel.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="flex min-w-0 flex-1 items-center gap-3 p-3.5"
                        >
                          <ChannelIcon channel={channel} />
                          <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-[var(--color-fg-inverse)]">
                            {channel.label}
                          </span>
                          <span className="sr-only">
                            {channel.external ? t("a11y.openInNewTab") : ""}
                          </span>
                          <ArrowUpRight
                            size={14}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--color-fg-inverse-muted)] rtl:-scale-x-100"
                          />
                        </a>

                        {channel.id === "email" && email && (
                          <button
                            type="button"
                            onClick={() => void copyEmail()}
                            aria-label={
                              copied ? t("contact.emailCopied") : t("contact.copyEmail")
                            }
                            title={copied ? t("contact.emailCopied") : t("contact.copyEmail")}
                            className="grid w-11 shrink-0 place-items-center border-s border-[var(--color-void-border)] text-[var(--color-fg-inverse-muted)] transition-colors hover:text-[var(--color-neon-primary)]"
                          >
                            {copied ? (
                              <Check size={15} aria-hidden="true" />
                            ) : (
                              <Copy size={15} aria-hidden="true" />
                            )}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <span aria-live="polite" className="sr-only">
                    {copied ? t("contact.emailCopied") : ""}
                  </span>
                </div>

                <div className="border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void-raised)_78%,transparent)] p-4 backdrop-blur-sm sm:p-5">
                  <p className="overline text-[var(--color-neon-primary)]">
                    {t("contact.teamOrbitTitle")}
                  </p>
                  <ul className="mt-4 grid gap-4">
                    {teamMembers.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center gap-4 border-b border-[var(--color-void-border)] pb-4 last:border-b-0 last:pb-0"
                      >
                        <MemberOrbit member={member} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-bold text-[var(--color-fg-inverse)]">
                            {member.name[language]}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-[var(--color-fg-inverse-muted)]">
                            {member.role[language]}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
