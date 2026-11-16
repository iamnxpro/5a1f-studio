export type NavItem = {
  /** Translation key inside `content/translations/*.json`. */
  labelKey: string;
  /** Router target. Section links use the `/#id` form. */
  to: string;
};

/**
 * Navigation is structural configuration, not editable content.
 * Labels still come from `content/translations/*.json`.
 */
export const PRIMARY_NAV: NavItem[] = [
  { labelKey: "nav.games", to: "/#games" },
  { labelKey: "nav.about", to: "/#about" },
  { labelKey: "nav.team", to: "/team" },
  { labelKey: "nav.join", to: "/#join" },
  { labelKey: "nav.contact", to: "/#contact" },
  { labelKey: "nav.software", to: "/software" },
  { labelKey: "nav.blog", to: "/blog" },
];

export const FOOTER_NAV: NavItem[] = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.team", to: "/team" },
  { labelKey: "nav.software", to: "/software" },
  { labelKey: "nav.blog", to: "/blog" },
  { labelKey: "footer.privacy", to: "/privacy" },
];
