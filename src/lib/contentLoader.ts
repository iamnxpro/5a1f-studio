import type {
  BlogEntry,
  BlogFrontmatter,
  BlogPost,
  Game,
  Language,
  SiteConfig,
  SocialLink,
  Software,
  TeamMember,
  TranslationTree,
} from "@/types/content";

/* ------------------------------------------------------------------ raw ---- */
/*
 * Everything is bundled at build time through Vite glob imports:
 * zero runtime fetch(), zero network requests, works offline.
 */

const jsonModules = import.meta.glob("../../content/**/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

/** Every image under content/ gets a hashed, CDN-safe URL at build time. */
const mediaModules = import.meta.glob(
  "../../content/**/*.{png,jpg,jpeg,webp,avif,svg,gif}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const markdownModules = import.meta.glob("../../content/blog/*/post.*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function readJson<T>(relativePath: string): T {
  const key = `../../content/${relativePath}`;
  const value = jsonModules[key];

  if (value === undefined) {
    throw new Error(
      `[content] Missing required JSON file: content/${relativePath}`,
    );
  }

  return value as T;
}

/* -------------------------------------------------------------- content ---- */

export const site = readJson<SiteConfig>("site.json");
export const teamMembers = readJson<TeamMember[]>("team/members.json");
export const games = readJson<Game[]>("games/games.json");
export const software = readJson<Software[]>("software/software.json");
export const studioSocial = readJson<SocialLink[]>("social/studio.json");

export const translations = {
  ar: readJson<TranslationTree>("translations/ar.json"),
  en: readJson<TranslationTree>("translations/en.json"),
} as const satisfies Record<Language, TranslationTree>;

/* ---------------------------------------------------------------- media ---- */

/**
 * Resolve a content-relative asset path to its built URL.
 * Returns `undefined` when the file is absent (logo/avatar fallbacks rely on this).
 */
export function mediaUrl(relativePath: string | null | undefined): string | undefined {
  if (!relativePath) return undefined;
  const clean = relativePath.replace(/^\/+/, "");
  return mediaModules[`../../content/${clean}`];
}

/* ----------------------------------------------------------------- blog ---- */

const SLUG_PATTERN = /blog\/([^/]+)\/post\.(ar|en)\.md$/;

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string | string[]>;
  body: string;
} {
  const normalized = raw.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { meta: {}, body: normalized };
  }

  const end = normalized.indexOf("\n---", 3);
  if (end === -1) {
    return { meta: {}, body: normalized };
  }

  const header = normalized.slice(3, end).trim();
  const body = normalized.slice(end + 4).replace(/^\r?\n/, "");
  const meta: Record<string, string | string[]> = {};

  for (const line of header.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    if (!key || !rawValue) continue;

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      meta[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map((item) => stripQuotes(item))
        .filter(Boolean);
    } else {
      meta[key] = stripQuotes(rawValue);
    }
  }

  return { meta, body };
}

function toFrontmatter(meta: Record<string, string | string[]>): BlogFrontmatter {
  const tags = meta.tags;
  return {
    title: typeof meta.title === "string" ? meta.title : "",
    summary: typeof meta.summary === "string" ? meta.summary : undefined,
    date: typeof meta.date === "string" ? meta.date : "1970-01-01",
    tags: Array.isArray(tags) ? tags : undefined,
    cover: typeof meta.cover === "string" ? meta.cover : undefined,
  };
}

function buildPosts(): BlogPost[] {
  const posts = new Map<string, BlogPost>();

  for (const [path, raw] of Object.entries(markdownModules)) {
    const match = SLUG_PATTERN.exec(path);
    if (!match) continue;

    const [, slug, language] = match;
    if (!slug || (language !== "ar" && language !== "en")) continue;

    const { meta, body } = parseFrontmatter(raw);
    const entry: BlogEntry = { frontmatter: toFrontmatter(meta), body };
    const post = posts.get(slug) ?? { slug, entries: {} };

    post.entries[language] = entry;
    posts.set(slug, post);
  }

  for (const post of posts.values()) {
    const cover = post.entries.ar?.frontmatter.cover ?? post.entries.en?.frontmatter.cover;
    if (cover) {
      post.coverUrl = mediaUrl(`blog/${post.slug}/${cover}`);
    }
  }

  return [...posts.values()].sort((a, b) => {
    const dateA = a.entries.ar?.frontmatter.date ?? a.entries.en?.frontmatter.date ?? "";
    const dateB = b.entries.ar?.frontmatter.date ?? b.entries.en?.frontmatter.date ?? "";
    return dateB.localeCompare(dateA);
  });
}

export const blogPosts = buildPosts();

/* -------------------------------------------------- dev translation audit --- */

function flattenKeys(tree: TranslationTree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });
}

if (import.meta.env.DEV) {
  const arKeys = new Set(flattenKeys(translations.ar));
  const enKeys = new Set(flattenKeys(translations.en));
  const missingInAr = [...enKeys].filter((key) => !arKeys.has(key));
  const missingInEn = [...arKeys].filter((key) => !enKeys.has(key));

  if (missingInAr.length > 0) {
    console.warn("[i18n] Missing Arabic keys:", missingInAr);
  }
  if (missingInEn.length > 0) {
    console.warn("[i18n] Missing English keys:", missingInEn);
  }

  const privateBoard = teamMembers.length;
  console.info(
    `[content] loaded · ${privateBoard} members · ${games.length} games · ${software.length} software · ${blogPosts.length} posts`,
  );
}
