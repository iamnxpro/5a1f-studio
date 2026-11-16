import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Menu, Pause, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { StudioLogo } from "@/components/ui/StudioLogo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useAudio } from "@/contexts/AudioContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMotion } from "@/contexts/MotionContext";
import { PRIMARY_NAV } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "./ScrollProgress";

type ControlButtonProps = {
  label: string;
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

function ControlButton({ label, pressed, onClick, children, className }: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center border border-[var(--color-void-border)] text-[var(--color-fg-inverse-muted)] transition-colors hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function useActiveNav() {
  const { pathname, hash } = useLocation();

  return (target: string): boolean => {
    const [path, fragment] = target.split("#");
    if (fragment) {
      return pathname === (path || "/") && hash === `#${fragment}`;
    }
    if (target === "/") return pathname === "/";
    return pathname === target || pathname.startsWith(`${target}/`);
  };
}

export function Navbar() {
  const { t } = useLanguage();
  const { muted, toggleMuted, playClick } = useAudio();
  const { motionEnabled, toggleMotion } = useMotion();
  const { pathname } = useLocation();
  const isActive = useActiveNav();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus(), 0);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const muteLabel = muted ? t("a11y.unmute") : t("a11y.mute");
  const motionLabel = motionEnabled ? t("a11y.motionOff") : t("a11y.motionOn");

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full">
      <div
        className={cn(
          "glass border-x-0 border-t-0 border-b border-[var(--color-void-border)] transition-shadow duration-300",
          scrolled && "shadow-[0_24px_60px_-32px_rgba(0,0,0,0.85)]",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 md:px-8">
          <Link
            to="/"
            onClick={(event) => {
              playClick();
              if (pathname === "/") {
                event.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: motionEnabled ? "smooth" : "auto",
                });
              }
            }}
            className="inline-flex min-w-0 items-center gap-3"
          >
            <StudioLogo imgClassName="h-8 w-auto max-w-[136px] sm:h-9 sm:max-w-[170px]" />
            <span
              aria-hidden="true"
              className="hidden h-5 w-px bg-[var(--color-void-border)] xl:block"
            />
            <span className="hidden font-display text-[9px] tracking-[0.22em] text-[var(--color-fg-inverse-muted)] xl:block">
              {t("hero.brandNote")}
            </span>
          </Link>

          <nav aria-label={t("a11y.mainNav")} className="hidden items-center gap-1 lg:flex">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? (item.to.includes("#") ? "location" : "page") : undefined}
                  className={cn(
                    "relative px-2.5 py-2 text-[11px] font-bold tracking-[0.06em] uppercase transition-colors",
                    active
                      ? "text-[var(--color-neon-primary)]"
                      : "text-[var(--color-fg-inverse-muted)] hover:text-[var(--color-fg-inverse)]",
                  )}
                >
                  {t(item.labelKey)}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px bg-[var(--color-neon-primary)] transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ControlButton
              label={muteLabel}
              pressed={muted}
              onClick={() => {
                playClick();
                toggleMuted();
              }}
            >
              {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
            </ControlButton>

            <ControlButton
              label={motionLabel}
              pressed={!motionEnabled}
              onClick={() => {
                playClick();
                toggleMotion();
              }}
            >
              {motionEnabled ? (
                <Sparkles size={16} aria-hidden="true" />
              ) : (
                <Pause size={16} aria-hidden="true" />
              )}
            </ControlButton>

            <span aria-hidden="true" className="mx-1 h-5 w-px bg-[var(--color-void-border)]" />

            <LanguageToggle tone="dark" />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? t("a11y.closeMenu") : t("a11y.openMenu")}
            aria-expanded={open}
            aria-controls="studio-mobile-menu"
            onClick={() => {
              playClick();
              setOpen((current) => !current);
            }}
            className="grid size-10 place-items-center border border-[var(--color-void-border)] text-[var(--color-fg-inverse)] transition-colors hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)] lg:hidden"
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <ScrollProgress />

      <AnimatePresence>
        {open && (
          <motion.div
            id="studio-mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("common.menu")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionEnabled ? 0.22 : 0 }}
            className="fixed inset-0 z-[var(--z-drawer)] flex flex-col bg-[color-mix(in_srgb,var(--color-void)_96%,transparent)] backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-void-border)] px-5 md:px-8">
              <StudioLogo imgClassName="h-8 w-auto" />
              <div className="flex items-center gap-2">
                <ControlButton
                  label={muteLabel}
                  pressed={muted}
                  onClick={() => {
                    playClick();
                    toggleMuted();
                  }}
                >
                  {muted ? (
                    <VolumeX size={16} aria-hidden="true" />
                  ) : (
                    <Volume2 size={16} aria-hidden="true" />
                  )}
                </ControlButton>
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label={t("a11y.closeMenu")}
                  onClick={() => {
                    playClick();
                    setOpen(false);
                    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
                  }}
                  className="grid size-10 place-items-center border border-[var(--color-void-border)] text-[var(--color-fg-inverse)] transition-colors hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <nav
              aria-label={t("a11y.mainNav")}
              className="flex-1 overflow-y-auto px-5 py-8 md:px-8"
            >
              <ul className="flex flex-col">
                {PRIMARY_NAV.map((item, index) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: motionEnabled ? 14 : 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: motionEnabled ? 0.3 : 0,
                      delay: motionEnabled ? index * 0.04 : 0,
                    }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      aria-current={
                        isActive(item.to)
                          ? item.to.includes("#")
                            ? "location"
                            : "page"
                          : undefined
                      }
                      className={cn(
                        "flex items-center justify-between border-b border-[var(--color-void-border)] py-4 font-heading text-[clamp(1.5rem,6vw,2.25rem)] transition-colors hover:text-[var(--color-neon-primary)]",
                        isActive(item.to)
                          ? "text-[var(--color-neon-primary)]"
                          : "text-[var(--color-fg-inverse)]",
                      )}
                    >
                      {t(item.labelKey)}
                      <ArrowRight
                        size={18}
                        aria-hidden="true"
                        className="text-[var(--color-neon-primary)] rtl:rotate-180"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ControlButton
                  label={motionLabel}
                  pressed={!motionEnabled}
                  onClick={() => {
                    playClick();
                    toggleMotion();
                  }}
                  className="size-10"
                >
                  {motionEnabled ? (
                    <Sparkles size={16} aria-hidden="true" />
                  ) : (
                    <Pause size={16} aria-hidden="true" />
                  )}
                </ControlButton>
                <LanguageToggle tone="dark" />
              </div>

              <p className="mt-10 max-w-xs text-sm leading-relaxed text-[var(--color-fg-inverse-muted)]">
                {t("footer.tagline")}
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
