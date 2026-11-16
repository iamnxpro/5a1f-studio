import type { Language, WorkStatus } from "@/types/content";

/**
 * Presentation helpers shared by the public pages.
 * These never invent content: a `PLACEHOLDER` value is treated as "not written
 * yet" and the UI falls back to a translated, honest label instead.
 */

const PLACEHOLDER = "PLACEHOLDER";

export function isPlaceholder(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().toUpperCase() === PLACEHOLDER;
}

export function hasContent(value: string | null | undefined): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !isPlaceholder(value)
  );
}

export function cleanList(values: readonly string[] | null | undefined): string[] {
  return (values ?? []).filter(hasContent);
}

export function statusTranslationKey(status: WorkStatus): string {
  switch (status) {
    case "available":
      return "common.available";
    case "beta":
      return "common.beta";
    case "in_development":
      return "common.inDevelopment";
    case "coming_soon":
    default:
      return "common.comingSoon";
  }
}

export function formatDate(date: string, language: Language): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat(language === "ar" ? "ar-MA" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

/** Rough reading time, rounded up to a whole minute. */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Build a wa.me URL with an optional pre-filled, already-localized message. */
export function whatsappHref(number: string, message?: string): string {
  const clean = number.replace(/\D/g, "");
  const base = `https://wa.me/${clean}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function emailAddress(href: string | undefined): string | undefined {
  if (!href || !href.startsWith("mailto:")) return undefined;
  const address = href.slice("mailto:".length).split("?")[0]?.trim();
  return address || undefined;
}

/** Compact, language-aware numeric pad used by decorative indexes. */
export function padIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
