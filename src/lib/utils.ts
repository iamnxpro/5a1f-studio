import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Any external/mailto link is rendered with safe rel attributes.
 * Empty strings are treated as "not configured" so the UI can hide them.
 */
export function isConfiguredHref(href: string | null | undefined): href is string {
  return typeof href === "string" && href.trim().length > 0;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
