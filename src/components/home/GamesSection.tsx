import { ArrowUpRight, Gamepad2, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { mediaUrl, site, games } from "@/lib/contentLoader";
import {
  hasContent,
  padIndex,
} from "@/lib/presentation";
import { cn, isConfiguredHref } from "@/lib/utils";
import type { Game } from "@/types/content";

function GameArt({
  game,
  index,
  featured,
}: {
  game: Game;
  index: number;
  featured: boolean;
}) {
  const { t, language } = useLanguage();
  const cover = mediaUrl(game.cover);
  const title = hasContent(game.title[language])
    ? game.title[language]
    : t("common.projectUntitled");
  const genres = game.genres
    .map((genre) => genre[language])
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
          <Gamepad2
            size={featured ? 62 : 42}
            strokeWidth={1}
            className="absolute bottom-5 end-5 text-[color-mix(in_srgb,var(--color-neon-primary)_60%,transparent)]"
          />
          {genres[0] && (
            <span className="absolute bottom-5 start-4 max-w-[55%] truncate font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-inverse-muted)]">
              {genres[0]}
            </span>
          )}
        </div>
      )}

      <div className="absolute end-3 top-3 z-10">
        <StatusBadge status={game.status} />
      </div>
      {hasContent(game.year) && (
        <span className="absolute start-3 top-3 z-10 border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void)_82%,transparent)] px-2 py-1 font-display text-[9px] tracking-[0.16em] text-[var(--color-fg-inverse-muted)]">
          {game.year}
        </span>
      )}
    </div>
  );
}

function GameCard({
  game,
  index,
  featured,
}: {
  game: Game;
  index: number;
  featured: boolean;
}) {
  const { t, language } = useLanguage();
  const title = hasContent(game.title[language])
    ? game.title[language]
    : t("common.projectUntitled");
  const tagline = hasContent(game.tagline[language]) ? game.tagline[language] : undefined;
  const description = hasContent(game.description[language])
    ? game.description[language]
    : undefined;
  const genres = game.genres
    .map((genre) => genre[language])
    .filter(hasContent);
  const links = game.links.filter(
    (link) => isConfiguredHref(link.href) && hasContent(link.label[language]),
  );

  return (
    <article
      className={cn(
        "group flex h-full flex-col border border-[var(--color-void-border)] bg-[color-mix(in_srgb,var(--color-void-raised)_72%,transparent)] transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--color-neon-primary)_38%,transparent)]",
        featured && "lg:grid lg:grid-cols-[1.08fr_0.92fr]",
      )}
    >
      <GameArt game={game} index={index} featured={featured} />

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col p-5 sm:p-6",
          featured && "lg:justify-between lg:p-8",
        )}
      >
        <div>
          {genres.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {genres.map((genre) => (
                <li
                  key={genre}
                  className="border border-[var(--color-void-border)] px-2 py-1 text-[10px] font-semibold text-[var(--color-fg-inverse-muted)]"
                >
                  {genre}
                </li>
              ))}
            </ul>
          )}

          <h3
            className={cn(
              "font-heading mt-4 text-[var(--color-fg-inverse)]",
              featured
                ? "text-[length:clamp(2rem,3.6vw,3.3rem)]"
                : "text-[length:var(--text-2xl)]",
            )}
          >
            {title}
          </h3>

          <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
            {tagline ?? description ?? t("games.comingSoonNote")}
          </p>

          {featured && description && tagline && (
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
              {description}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-void-border)] pt-4">
          <span className="font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-inverse-muted)]">
            {site.studioName} / {game.year}
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
              {t("games.comingSoonNote")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function LabNote() {
  const { t } = useLanguage();

  return (
    <div className="flex h-full min-h-[220px] flex-col justify-between border border-dashed border-[var(--color-void-border)] p-6">
      <Sparkles
        size={20}
        aria-hidden="true"
        className="text-[var(--color-neon-secondary)]"
      />
      <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-[var(--color-fg-inverse-muted)]">
        {t("games.comingSoonNote")}
      </p>
      <span className="mt-6 font-display text-[9px] tracking-[0.2em] text-[var(--color-fg-inverse-muted)]">
        {site.studioName} · {t("games.label")}
      </span>
    </div>
  );
}

export function GamesSection() {
  const { t } = useLanguage();
  const featured = games.find((game) => game.featured) ?? games[0];
  const rest = featured ? games.filter((game) => game.id !== featured.id) : games;

  return (
    <section
      id="games"
      aria-labelledby="games-title"
      className="zone-void border-b border-[var(--color-void-border)]"
    >
      <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
        <Reveal>
          <div className="flex flex-col gap-7 border-b border-[var(--color-void-border)] pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="overline flex items-center gap-2 text-[var(--color-neon-primary)]">
                <Gamepad2 size={13} aria-hidden="true" />
                {t("games.label")}
              </p>
              <h2
                id="games-title"
                className="font-heading mt-4 text-[length:var(--text-3xl)] text-[var(--color-fg-inverse)]"
              >
                {t("games.title")}
              </h2>
              <p className="mt-4 text-[length:var(--text-base)] leading-[var(--leading-body)] text-[var(--color-fg-inverse-muted)]">
                {t("games.subtitle")}
              </p>
            </div>
          </div>
        </Reveal>

        {games.length === 0 || !featured ? (
          <Reveal className="mt-8">
            <div className="border border-dashed border-[var(--color-void-border)] p-8 sm:p-12">
              <Gamepad2
                size={26}
                aria-hidden="true"
                className="text-[var(--color-neon-primary)]"
              />
              <p className="mt-5 max-w-lg text-[var(--color-fg-inverse-muted)]">
                {t("games.empty")}
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-8">
            <Reveal>
              <GameCard
                game={featured}
                index={games.indexOf(featured)}
                featured
              />
            </Reveal>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {rest.map((game, index) => (
                <Reveal key={game.id} delay={index * 0.06}>
                  <GameCard
                    game={game}
                    index={games.indexOf(game)}
                    featured={false}
                  />
                </Reveal>
              ))}
              <Reveal delay={rest.length * 0.06}>
                <LabNote />
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
