/**
 * Typed contract for everything inside `content/`.
 * The external content generator must emit JSON that matches these shapes.
 */

export type Language = "ar" | "en";

export type Localized = {
  ar: string;
  en: string;
};

export type SocialLink = {
  id: string;
  label: Localized;
  href: string;
  icon: string;
  type?: "custom" | "lucide";
};

export type JoinRole = {
  id: string;
  label: Localized;
};

export type SiteConfig = {
  studioName: string;
  studioFullName: Localized;
  whatsappNumber: string;
  email: string;
  url: string;
  ogImage: string;
  logo: string;
  defaultLanguage: Language;
  features: {
    competitions: boolean;
  };
  joinForm: {
    ageMode: "exact" | "range";
    departments: JoinRole[];
    aiUsageOptions: JoinRole[];
    roles: JoinRole[];
  };
};

export type TeamMember = {
  id: string;
  name: Localized;
  kunya?: Localized;
  country?: Localized;
  role: Localized;
  bio: Localized;
  skills: string[];
  avatar: string;
  avatarAlt: Localized;
  social: SocialLink[];
};

export type WorkStatus = "available" | "coming_soon" | "beta" | "in_development";

export type ContentLink = {
  id: string;
  label: Localized;
  href: string;
};

export type Game = {
  id: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  genres: Localized[];
  status: WorkStatus;
  cover: string | null;
  screenshots: string[];
  links: ContentLink[];
  featured: boolean;
  year: string;
};

export type SoftwareSpec = {
  label: Localized;
  value: string;
};

export type Software = {
  id: string;
  name: string;
  tagline: Localized;
  description: Localized;
  status: WorkStatus;
  cover: string | null;
  platforms: string[];
  specs: SoftwareSpec[];
  links: ContentLink[];
};

/** Artistic & media productions: animation, films, series and similar work. */
export type Production = {
  id: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  formats: Localized[];
  status: WorkStatus;
  cover: string | null;
  year: string;
  links: ContentLink[];
  featured: boolean;
};

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export type BlogFrontmatter = {
  title: string;
  summary?: string;
  date: string;
  tags?: string[];
  cover?: string;
};

export type BlogEntry = {
  frontmatter: BlogFrontmatter;
  body: string;
};

export type BlogPost = {
  slug: string;
  coverUrl?: string;
  entries: Partial<Record<Language, BlogEntry>>;
};
