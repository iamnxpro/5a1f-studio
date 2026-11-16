import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/lib/contentLoader";

type PageMetaOptions = {
  title: string;
  description?: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  publishedTime?: string;
};

function upsertMeta(attribute: "name" | "property", key: string, content?: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = href;
}

/**
 * Keeps the document title, description, Open Graph, Twitter and canonical
 * tags in sync with the active route and language. No external service is
 * involved; this is plain DOM metadata.
 */
export function usePageMeta({
  title,
  description,
  type = "website",
  image,
  noindex = false,
  publishedTime,
}: PageMetaOptions) {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const url = new URL(pathname, site.url).toString();
    const imageUrl = new URL(image ?? site.ogImage, site.url).toString();
    const locale = language === "ar" ? "ar_MA" : "en_US";
    const alternateLocale = language === "ar" ? "en_US" : "ar_MA";

    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", site.studioFullName.en);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:locale", locale);
    upsertMeta("property", "og:locale:alternate", alternateLocale);
    upsertMeta("property", "article:published_time", type === "article" ? publishedTime : undefined);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);

    upsertCanonical(url);
  }, [title, description, type, image, noindex, publishedTime, pathname, language]);
}
