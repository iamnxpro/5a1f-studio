# 5A1F Studio

The official bilingual website for **5A1F Studio** - a static, zero-backend,
zero-tracking site for an independent game and software studio.

- Production URL: **https://5a1f.vercel.app**
- Repository: **https://github.com/iamnxpro/5a1f-studio**
- Stack: Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router + Framer Motion
- Deployment: Vercel static hosting (`dist/`), no server functions
- Languages: Arabic (RTL, default) and English (LTR)

The visual system is a hybrid: a warm editorial shell (cream, ink, olive, coral)
for the studio story, and deep-ink / olive-coral neon surfaces for games,
software, the hero, and the navigation.

---

## 1. Quick start

Requirements: **Node.js 20+** and npm.

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # TypeScript only
npm run check-content
npm run build        # TypeScript + production build into dist/
npm run preview      # serve dist/ locally
```

The site is fully static. There is no API, database, authentication, analytics,
or third-party runtime service.

---

## 2. Routes

| Route | Page |
|---|---|
| `/` | Home: hero, games, about, team preview, join form, contact |
| `/software` | Software and tools |
| `/productions` | Artistic & media productions, led by Abdul Samad |
| `/services` | Service request / hire-us form with WhatsApp and email handoff |
| `/team` | Team index |
| `/team/:memberId` | Team member profile (`amin`, `abdulsamad`, `emad`, `hosin`); the legacy `/team/abdullah` URL redirects to `/team/abdulsamad` |
| `/blog` | Blog index, including the empty state when there are no posts |
| `/blog/:slug` | Lazy-loaded Markdown article |
| `/privacy` | Privacy and data-handling statement |
| `*` | Branded 404 with `noindex` metadata |

Secondary pages and the Markdown reader are code-split. Home is loaded eagerly
because it is the entry point. The Vercel rewrite sends unknown paths to
`index.html` so deep links work without a server.

---

## 3. Project structure

```text
5a1f-studio/
  content/                     All editable content and media
    site.json                  Site identity, email, URL, WhatsApp, feature flags
    translations/              ar.json + en.json (matching keys)
    team/members.json          Team profiles, skills, social links
    games/games.json           Game catalogue
    software/software.json     Software catalogue
    productions/productions.json  Artistic & media productions catalogue
    social/studio.json         Studio-level social links
    blog/<slug>/               post.ar.md, post.en.md, optional cover
    media/                     Logo, team avatars, icons, images
  public/                      Favicons, manifest, robots.txt, sitemap.xml, OG image
  scripts/check-content.ts     Content, translation, media, and privacy checks
  src/
    audio/soundEngine.ts       Web Audio UI sounds; no audio files or autoplay
    components/                Home sections, layout, preloader, shared UI
    contexts/                  Language, motion, and audio providers
    hooks/                     Preload progress
    lib/                       Content loading, presentation helpers, metadata
    pages/                     Route pages
    styles/                    Tokens, fonts, global CSS
    types/content.ts           JSON content types
  index.html                   Base SEO, Open Graph, Twitter, JSON-LD, noscript
  vercel.json                  SPA rewrite, security headers, cache headers
  vite.config.ts
```

Rules of thumb:

- Editable copy and metadata live in `content/`, not in JSX.
- Structural navigation lives in `src/lib/navigation.ts`.
- Components should read content through the typed content loader.
- English and Arabic fonts are self-hosted through `@fontsource` (Inter, DM Serif Display, Orbitron, Amiri, IBM Plex Sans Arabic); no font or script CDN is used.

---

## 4. Editing content

### 4.1 `content/site.json`

Controls the studio identity and global switches:

```json
{
  "studioName": "5A1F",
  "studioFullName": { "ar": "...", "en": "5A1F Studio" },
  "whatsappNumber": "212754427433",
  "url": "https://5a1f.vercel.app",
  "ogImage": "/og-image.png",
  "logo": "media/logo.svg",
  "defaultLanguage": "ar",
  "features": { "competitions": false },
  "joinForm": {
    "ageMode": "exact",
    "departments": [
      { "id": "software", "label": { "ar": "برمجيات", "en": "Software" } },
      { "id": "games", "label": { "ar": "ألعاب", "en": "Games" } }
    ],
    "aiUsageOptions": [
      { "id": "essential", "label": { "ar": "أساسي في عملي", "en": "Essential in my work" } },
      { "id": "most", "label": { "ar": "أغلب الأحيان", "en": "Most of the time" } },
      { "id": "partial", "label": { "ar": "ليس بشكل كلي", "en": "Not completely" } },
      { "id": "few", "label": { "ar": "فقط في مرات قليلة", "en": "Only a few times" } }
    ],
    "roles": [
      { "id": "programmer", "label": { "ar": "...", "en": "Game Programmer" } }
    ]
  }
}
```

- `features.competitions: false` hides the competitions UI. Enabling it requires
  actual competition content; the UI is not filled with invented entries.
- `joinForm.ageMode` is `exact` for a date-of-birth-style age field or `range`
  for an age bracket.
- `joinForm.departments` drives the Department dropdown (`Software` / `Games`).
- `joinForm.aiUsageOptions` drives the four AI-usage answers; keep the wording
  exactly as supplied.
- Keep `url` and `ogImage` in sync with the production domain. The official
  studio email lives here and in `content/social/studio.json`; Amin's personal
  email lives only on his team profile.

### 4.2 Translations

`content/translations/ar.json` and `en.json` must contain the same keys.
`npm run check-content` fails on drift and reports the missing or extra keys.
Both languages are loaded at build time; switching is instant and does not
reload the page.

### 4.3 Team

`content/team/members.json` is an array of:

```json
{
  "id": "amin",
  "name": { "ar": "...", "en": "Amin" },
  "role": { "ar": "...", "en": "Co-Founder, Software & Game Developer" },
  "bio": { "ar": "...", "en": "..." },
  "skills": ["Godot 4", "TypeScript"],
  "avatar": "media/team/amin.svg",
  "avatarAlt": { "ar": "...", "en": "Amin's avatar" },
  "social": [
    {
      "id": "github",
      "label": { "ar": "...", "en": "GitHub" },
      "href": "https://github.com/iamnxpro",
      "icon": "media/images/github.webp",
      "type": "custom"
    }
  ]
}
```

- Bios and skills containing `PLACEHOLDER` are hidden until real copy is supplied.
- All four members have local SVG avatars. If an avatar is missing, the UI shows
  the member's initials rather than a broken image.
- Social links with an empty `href` are hidden; the checker warns instead of
  failing. Abdul Samad's Epic Games slot and Emad's portfolio slot remain
  intentionally pending.
- `iamnx.amin.pro@gmail.com` is Amin's personal email on his profile only. The
  studio's official address remains `official5a1fstudios@gmail.com`.
- Member WhatsApp links (`wa.me/<number>`) are intentional contact methods.
  Any other private phone numbers, addresses, schools, or personal data remain
  prohibited and are flagged by the checker.

### 4.4 Games, software and productions

`content/games/games.json`, `content/software/software.json`, and
`content/productions/productions.json` use the shared status values:

- `available`
- `coming_soon`
- `beta`
- `in_development`

Game entries support bilingual `title`, `tagline`, `description`, `genres`,
`status`, `cover`, `screenshots`, `links`, `featured`, and `year`. Software
entries support bilingual `name`, `tagline`, `description`, `status`, `cover`,
`platforms`, `specs`, and `links`. Production entries use the games-style
layout with bilingual `title`, `tagline`, `description`, `formats`, `status`,
`cover`, `year`, `links`, and `featured`; the page attributes the section to
Abdul Samad. Image paths are relative to `content/` and resolved to bundled
assets at build time.

### 4.5 Forms without a backend

The Join form and `/services` form are fully client-side. Labels and placeholders
come from `content/translations/*.json`; Submit opens a prefilled WhatsApp link
or, for service requests, a `mailto:` draft addressed to the official studio
email. Nothing is stored or sent by the site itself. The Join form includes the
required pre-launch acknowledgment next to the Privacy Policy link.

### 4.6 Blog

Create one folder per article:

```text
content/blog/<slug>/
  post.ar.md
  post.en.md
  cover.webp        optional
```

Required frontmatter:

```yaml
---
title: "Article title"
summary: "One-sentence summary used in the index."
date: "2026-01-20"
tags: ["devlog", "godot"]
cover: "cover.webp"
---
```

- The folder name becomes `/blog/<slug>`; use lowercase Latin letters, digits,
  and hyphens.
- Markdown supports GFM tables and lists through `remark-gfm`.
- If only one language file exists, the reader shows that version with a
  localized notice.
- The index currently has no posts, so it displays the designed empty state.
- Keep personal data out of posts. The content checker scans Markdown for leaks.

### 4.7 Media and fonts

All images live under `content/media/`. The main asset is the traced
`content/media/logo.svg`; the favicon set, PWA icons, and OG image in `public/`
were generated from the same mark.

Team avatars are expected at:

```text
content/media/team/amin.svg
content/media/team/abdulsamad.svg
content/media/team/emad.svg
content/media/team/hosin.svg
```

Use square, transparent, stylized or illustrated avatars - never a real face
photo. Emad's SVG was traced from the supplied raster source in the gitignored
`design/team-source/` folder; Hosin's SVG is an original themed placeholder.
Keep individual files under 1 MB.

Arabic typography is self-hosted from npm: **Amiri** (editorial serif headings) and
**IBM Plex Sans Arabic** (UI/body), imported in `src/main.tsx` and mapped via
`src/styles/tokens.css` and `src/styles/fonts.css`. No Arabic font CDN is used.
To replace the pairing, swap the `@fontsource` imports/tokens and rebuild. See
`src/assets/fonts/README.md`.

---

## 5. Behavior and quality

### Bilingual and RTL

- Arabic is the default; the choice is stored in `localStorage` under
  `5a1f:language`.
- Switching updates `<html lang>` and `<html dir>` immediately, preserves the
  current scroll position, and does not reload.
- Layouts, icons, and spacing respond to `dir`; both languages were checked at
  desktop and mobile widths.

### First load and motion

- A cinematic preloader runs on every hard load.
- **Enter** becomes available only at 100%; **Skip** is always available.
- Audio is created only after an explicit user gesture. The master gain is 0.15.
- The navbar **Stop Motion** control persists under `5a1f:motion` and disables
  orbit and transition animation.
- `prefers-reduced-motion` is respected, and animations pause when the tab is
  hidden via the Page Visibility API.
- The mobile menu is a full-screen dialog with focus trapping, Escape-to-close,
  focus return, and `aria-current` active links.

### Accessibility

- WCAG AA target, keyboard-visible focus rings, landmarks, headings, labels,
  error announcements, and skip-to-content.
- Axe audits were run against the key routes, the mobile menu, and the form;
  the final route pass reported **9 audits, 0 findings**.
- Form validation announces errors, focuses the first invalid field, and uses
  `aria-invalid` / `aria-describedby`.

### Performance and privacy

- No external font, script, image, or analytics requests at runtime.
- No backend, cookies, tracking, or data collection. Language, audio, and motion
  preferences stay in local storage.
- Secondary routes and Markdown reading are lazy-loaded.
- Final local Mobile Lighthouse run (preview build):
  **Performance 92, Accessibility 100, Best Practices 100, SEO 100**
  (FCP 2.5 s, LCP 2.8 s, TBT 20 ms, CLS 0.015, 277 KiB transfer).
- Lighthouse scores vary with machine load and network conditions; the target
  was Mobile Performance 85+, and it is met.

### SEO and deployment hardening

- `index.html` includes canonical, Open Graph, Twitter card, JSON-LD, theme
  color, manifest, and favicon links.
- `usePageMeta()` updates per-route titles, descriptions, and canonical URLs;
  the 404 page sets `noindex`.
- `public/robots.txt`, `public/sitemap.xml`, and `public/site.webmanifest` are
  included.
- `vercel.json` configures the SPA rewrite plus `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and immutable
  caching for hashed `assets/`.

---

## 6. Validation checklist

Run these before a release:

```bash
npm run check
npm run check-content
npm run build
npm run preview
```

`npm run check-content` validates:

- required files and JSON shape;
- Arabic/English translation key parity (currently 175 keys);
- referenced media paths;
- image sizes (under 1 MB);
- privacy leaks in Markdown and content;
- remaining `PLACEHOLDER` values (warnings, not build failures).

Expected content warnings while the real content is being prepared:

- 2 member links with empty `href` (Abdul Samad's Epic Games slot and Emad's
  portfolio slot, hidden in the UI);
- 0 missing team avatars;
- 47 `PLACEHOLDER` values across games, software, bios, and skills.

The production build is currently clean apart from Vite's advisory that the
main chunk exceeds 500 kB. It is not a build failure; the main bundle is about
168 kB gzipped, and the Markdown reader is split into its own lazy chunk. If the
advisory matters for a future release, add vendor splitting in `vite.config.ts`
and re-run the QA suite.

---

## 7. Deploying to Vercel

`vercel.json` already defines the Vite framework, build command, output folder,
SPA rewrite, and headers.

### Option A - Vercel CLI

```bash
npx vercel          # first deployment / link the project
npx vercel --prod   # production deployment
```

Use project name **`5a1f`**. The production alias is
**https://5a1f.vercel.app**.

### Option B - Git integration (auto-deploy)

1. Push this folder to `iamnxpro/5a1f-studio`.
2. Import/connect the repository in Vercel.
3. Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.
4. Install/authorize the **Vercel GitHub App** and grant access to
   `iamnxpro/5a1f-studio`: https://github.com/apps/vercel
5. Connect the project:  
   `vercel git connect https://github.com/iamnxpro/5a1f-studio.git --project 5a1f --yes`

Once the GitHub App is installed and the repo is connected, pushes to `main`
redeploy automatically. (CLI deploys work now; native Git auto-deploy requires
the GitHub App installation/authorization for this repo.)
6. Deploy and assign the `5a1f.vercel.app` domain.

Because the site is entirely static, no environment variables are required.

### Post-deploy checks

- Open `/`, `/software`, `/productions`, `/services`, `/team`, `/team/amin`,
  `/team/abdulsamad`, `/team/emad`, `/team/hosin`, `/blog`, `/privacy`, and an
  unknown path to confirm the rewrite and 404 behavior. `/team/abdullah` should
  redirect to `/team/abdulsamad`.
- Confirm the studio social links resolve to the configured GitHub Organization,
  Discord, WhatsApp Channel, PayPal, Ko-fi, and Itch.io URLs.
- Confirm `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/favicon.svg`,
  and `/og-image.png` return the expected files.
- Confirm the security and cache headers from `vercel.json`.
- Confirm the language toggle, mobile menu, reduced-motion/Stop Motion behavior,
  the Join form's required acknowledgment and WhatsApp handoff, and both
  service-request handoffs (WhatsApp and `mailto:`).
- Re-check the console for external requests; the site should only contact its
  own origin.

---

## 8. Pending real content

These are intentionally not fabricated:

- **Team avatars**: all four are local SVGs. `amin.svg` and `abdulsamad.svg`
  were traced from supplied images, `emad.svg` from the supplied JPEG, and
  `hosin.svg` is a themed illustrated placeholder.
- **Games**: two placeholder entries; replace titles, descriptions, genres,
  covers, links, and statuses.
- **Software**: one placeholder entry; replace copy, specs, platforms, and links.
- **Productions**: two placeholder entries; replace copy, formats, covers, links,
  and statuses. Abdul Samad is already credited as the section lead.
- **Team bios/skills**: placeholder values are hidden until replaced. Hosin's
  role is intentionally generic (`Team Member`) until a real role is supplied.
- **Member links**: Abdul Samad's Epic Games slot and Emad's portfolio slot have
  empty `href` values. Abdul Samad's WhatsApp, Emad's WhatsApp/Discord, and
  Hosin's Instagram/Discord are configured.
- **Studio social links**: GitHub Organization, Discord Server, WhatsApp
  Channel, PayPal, Ko-fi, and Itch.io are configured; the official email remains
  `official5a1fstudios@gmail.com`.
- **Blog**: no published posts yet; the empty state is intentional.

Until those are supplied, the site is fully deployable and does not display
invented personal data. See `FINAL_REPORT.md` for the full build, QA, and
deployment record.
