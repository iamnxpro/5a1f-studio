import { ArrowUpRight, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { blogPosts, site } from "@/lib/contentLoader";
import { formatDate, hasContent, readingMinutes } from "@/lib/presentation";
import type { BlogPost } from "@/types/content";

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const { t, language } = useLanguage();
  const entry = post.entries[language] ?? post.entries[language === "ar" ? "en" : "ar"];
  if (!entry) return null;

  const title = hasContent(entry.frontmatter.title)
    ? entry.frontmatter.title
    : t("common.projectUntitled");
  const tags = (entry.frontmatter.tags ?? []).filter(hasContent);
  const minutes = readingMinutes(entry.body);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3 text-[10px] font-semibold text-[var(--color-fg-secondary)]">
        <time dateTime={entry.frontmatter.date}>
          {formatDate(entry.frontmatter.date, language)}
        </time>
        <span className="flex items-center gap-1.5">
          <span className="font-display text-[9px] text-[var(--color-fg-muted)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          · {t("blog.readingTime")} {minutes} {t("blog.minutes")}
        </span>
      </div>

      {post.coverUrl && (
        <div className="mt-5 aspect-[16/9] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
          <img
            src={post.coverUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <h2 className="font-heading mt-5 text-[length:var(--text-2xl)] text-[var(--color-fg-primary)] transition-colors group-hover:text-[var(--color-accent)]">
        {title}
      </h2>

      {hasContent(entry.frontmatter.summary) && (
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-fg-secondary)]">
          {entry.frontmatter.summary}
        </p>
      )}

      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="border border-[var(--color-border)] px-2 py-1 text-[10px] font-semibold text-[var(--color-fg-secondary)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : (
          <span className="font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-muted)]">
            {site.studioName}
          </span>
        )}

        <span className="inline-flex size-8 shrink-0 items-center justify-center border border-[var(--color-border)] text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-fg-inverse)]">
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
          />
        </span>
      </div>
    </Link>
  );
}

function EmptyBlog() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-6 sm:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, var(--color-border) 31px, var(--color-border) 32px)",
        }}
      />
      <div className="relative max-w-xl">
        <span className="inline-flex size-11 items-center justify-center border border-[var(--color-border-strong)] text-[var(--color-accent)]">
          <PenLine size={18} aria-hidden="true" />
        </span>
        <p className="font-heading mt-6 text-[length:var(--text-2xl)] text-[var(--color-fg-primary)]">
          {t("blog.empty")}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-fg-secondary)]">
          {t("blog.subtitle")}
        </p>
        <Link
          to="/software"
          className="group mt-6 inline-flex items-center gap-2 border-b border-[var(--color-accent)] pb-1 text-[11px] font-bold text-[var(--color-accent)] transition-colors hover:border-[var(--color-highlight-strong)] hover:text-[var(--color-highlight-strong)]"
        >
          {t("nav.software")}
          <ArrowUpRight
            size={13}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
          />
        </Link>
      </div>
    </div>
  );
}

// The active language is the source of truth; the fallback above keeps both
// directions covered when only one translation exists.
export default function Blog() {
  const { t, language } = useLanguage();

  usePageMeta({
    title: `${t("blog.title")} — ${site.studioFullName[language]}`,
    description: t("blog.subtitle"),
  });

  return (
    <div className="zone-paper relative min-h-[70vh]">
      <div className="paper-noise" aria-hidden="true" />

      <div className="relative">
        <PageHeader
          label={t("blog.label")}
          title={t("blog.title")}
          subtitle={t("blog.subtitle")}
        />

        <div className="mx-auto max-w-[1440px] px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-10">
          {blogPosts.length === 0 ? (
            <Reveal>
              <EmptyBlog />
            </Reveal>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {blogPosts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.05}>
                  <PostCard post={post} index={index} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
