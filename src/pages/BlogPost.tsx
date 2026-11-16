import { ArrowLeft, Languages, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { blogPosts, mediaUrl, site } from "@/lib/contentLoader";
import {
  formatDate,
  hasContent,
  readingMinutes,
} from "@/lib/presentation";

function excerpt(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const post = blogPosts.find((item) => item.slug === slug);
  const primary = post?.entries[language];
  const fallback = post?.entries[language === "ar" ? "en" : "ar"];
  const entry = primary ?? fallback;
  const usingFallback = !primary && Boolean(fallback);
  const title = hasContent(entry?.frontmatter.title)
    ? entry.frontmatter.title
    : t("blog.empty");
  const description =
    (entry?.frontmatter.summary && hasContent(entry.frontmatter.summary)
      ? entry.frontmatter.summary
      : entry
        ? excerpt(entry.body)
        : t("blog.empty"));
  const minutes = entry ? readingMinutes(entry.body) : 1;
  const tags = (entry?.frontmatter.tags ?? []).filter(hasContent);

  usePageMeta({
    title: `${title} — ${site.studioFullName[language]}`,
    description,
    type: entry ? "article" : "website",
    image: post?.coverUrl,
    publishedTime: entry?.frontmatter.date,
    noindex: !entry,
  });

  if (!post || !entry) {
    return (
      <div className="zone-paper relative grid min-h-[70vh] place-items-center px-[var(--section-pad-x)] py-20">
        <div className="max-w-lg text-center">
          <p className="overline text-[var(--color-accent)]">{t("blog.label")}</p>
          <h1 className="font-heading mt-4 text-[length:var(--text-3xl)]">
            {t("blog.empty")}
          </h1>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 border-b border-[var(--color-accent)] pb-1 text-sm font-bold text-[var(--color-accent)] transition-colors hover:border-[var(--color-highlight-strong)] hover:text-[var(--color-highlight-strong)]"
          >
            <ArrowLeft size={16} aria-hidden="true" className="rtl:rotate-180" />
            {t("blog.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="zone-paper relative min-h-[70vh]">
      <div className="paper-noise" aria-hidden="true" />

      <article className="relative mx-auto max-w-4xl px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-[clamp(44px,7vw,86px)]">
        <Link
          to="/blog"
          className="group inline-flex items-center gap-2 border-b border-[var(--color-border-strong)] pb-1 text-[11px] font-bold text-[var(--color-accent)] transition-colors hover:border-[var(--color-highlight-strong)] hover:text-[var(--color-highlight-strong)]"
        >
          <ArrowLeft
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
          />
          {t("blog.back")}
        </Link>

        <header className="mt-8">
          <p className="overline flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--color-accent)]">
            <span>{t("blog.label")}</span>
            <span aria-hidden="true">·</span>
            <span>{t("blog.published")}</span>
            <time dateTime={entry.frontmatter.date}>
              {formatDate(entry.frontmatter.date, language)}
            </time>
          </p>

          <h1 className="font-heading mt-4 text-[length:clamp(2.5rem,5.6vw,4.5rem)] leading-[1.06]">
            {title}
          </h1>

          {hasContent(entry.frontmatter.summary) && (
            <p className="mt-5 max-w-3xl text-[length:var(--text-md)] leading-[var(--leading-body)] text-[var(--color-fg-secondary)]">
              {entry.frontmatter.summary}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-[var(--color-border)] py-3 text-[11px] font-semibold text-[var(--color-fg-secondary)]">
            <span>
              {t("blog.readingTime")} {minutes} {t("blog.minutes")}
            </span>
            <span className="font-display text-[9px] tracking-[0.18em] text-[var(--color-fg-muted)]">
              {site.studioName}
            </span>
          </div>

          {usingFallback && (
            <p className="mt-5 flex items-start gap-2 border border-[var(--color-border-strong)] bg-[var(--color-accent-soft)] p-3.5 text-[12px] leading-relaxed text-[var(--color-accent-strong)]">
              <Languages size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
              {t("blog.languageNotice")}
            </p>
          )}
        </header>

        {post.coverUrl && (
          <div className="mt-8 overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            <img
              src={post.coverUrl}
              alt=""
              loading="eager"
              decoding="async"
              className="max-h-[520px] w-full object-cover"
            />
          </div>
        )}

        <div className="prose-studio mt-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a({ href, children }) {
                if (!href) return <span>{children}</span>;
                if (href.startsWith("/")) {
                  return <Link to={href}>{children}</Link>;
                }
                return (
                  <a
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {children}
                  </a>
                );
              },
              img({ src, alt }) {
                if (!src) return null;
                const resolved = /^(https?:|data:|\/)/i.test(src)
                  ? src
                  : mediaUrl(`blog/${post.slug}/${src}`);
                if (!resolved) return null;
                return (
                  <img
                    src={resolved}
                    alt={alt ?? ""}
                    loading="lazy"
                    decoding="async"
                  />
                );
              },
            }}
          >
            {entry.body}
          </ReactMarkdown>
        </div>

        {tags.length > 0 && (
          <footer className="mt-12 border-t border-[var(--color-border)] pt-6">
            <p className="overline flex items-center gap-2 text-[var(--color-accent)]">
              <Tag size={12} aria-hidden="true" />
              {t("blog.tags")}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-[11px] font-semibold text-[var(--color-fg-secondary)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </div>
  );
}
