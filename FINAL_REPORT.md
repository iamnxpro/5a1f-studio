# FINAL REPORT - 5A1F Studio Website

**Project:** 5A1F Studio official website
**Repository:** https://github.com/iamnxpro/5a1f-studio
**Production URL:** https://5a1f.vercel.app
**Report date:** 2026-11-16

---

## 1. Executive summary

The complete bilingual 5A1F Studio website has been built as a static,
zero-backend Vite/React application and deployed to Vercel.

Delivered:

- Full Arabic (RTL) / English (LTR) experience with instant switching,
  persistence, and scroll preservation.
- Hybrid visual direction: warm editorial cream/olive/coral sections plus
  dark-ink, olive/coral-neon game, software, hero, and navigation surfaces.
- Preloader with real asset/font progress, Enter only at 100%, and an always
  available Skip action.
- Web Audio sound engine that starts only after an explicit user gesture and
  uses a master gain of 0.15.
- Home, Software, Team, Team member, Blog, Blog post, Privacy, and 404 routes.
- Content-driven architecture: all copy, translations, team data, catalogue
  entries, social links, and blog posts come from `content/`.
- Mobile-first accessibility work: WCAG AA target, keyboard focus, mobile menu
  focus trap, reduced motion, Stop Motion, visibility pause, form errors, and
  skip-to-content.
- SEO, Open Graph, Twitter, JSON-LD, favicons, PWA manifest, robots.txt,
  sitemap.xml, and Vercel security/cache headers.
- Final production Mobile Lighthouse: **97 Performance / 100 Accessibility /
  100 Best Practices / 100 SEO** (local production preview: 93 / 100 / 100 /
  100).
- Automated route QA: **58 checks, 0 problems**.
- Axe audits: **9 audits, 0 findings**.
- Content validation: **0 errors, 6 warnings, 4 notes**; warnings are pending
  real content/assets, not code defects.

The only remaining work is user-supplied content (Arabic fonts, team avatars,
real game/software/bio copy, studio social links, and blog posts).

---

## 2. Scope and constraints

### Requirements implemented

| Requirement | Status |
|---|---|
| Static site, zero backend | Done |
| Zero recurring cost | Done (Vercel static hosting) |
| Zero tracking | Done (no analytics, cookies, or third-party requests) |
| No external font/script CDN | Done (fonts through `@fontsource`, icons local) |
| Arabic RTL / English LTR | Done |
| Instant language switching | Done |
| Language persistence in `localStorage` | Done (`5a1f:language`) |
| Scroll preservation on switch | Done and tested |
| Self-hosted English fonts | Done (Inter, DM Serif Display, Orbitron) |
| Arabic fonts | System stack now; custom files pending from owner |
| Logo traced from source image | Done (`content/media/logo.svg`) |
| Favicon uses the logo | Done (full favicon/PWA/OG set) |
| No fabricated personal data | Done; `PLACEHOLDER` where data is unknown |
| Competitions hidden behind feature flag | Done (`features.competitions: false`) |
| Respect `prefers-reduced-motion` | Done and tested |
| Navbar Stop Motion toggle | Done and tested |
| Pause animations when tab hidden | Done and tested |
| WCAG AA target | Done; axe clean on audited routes |
| 60fps motion | Transform/opacity animations; reduced-motion paths |
| Mobile Lighthouse 85+ | Done: 97 production / 93 local preview |
| Detailed final report | This document |

### Non-goals

- No CMS, database, API, authentication, or serverless functions.
- No newsletter provider or payment integration.
- No content invention. Unknown bios, skills, games, software, and social links
  remain explicit placeholders or are hidden.

---

## 3. Architecture

### Stack

- Vite 7
- React 19
- TypeScript 5.6
- Tailwind CSS v4
- React Router 7
- Framer Motion
- `react-markdown` + `remark-gfm` (lazy blog reader)
- `@fontsource` for self-hosted fonts
- `lucide-react` icons
- `axe-core` for accessibility audits
- Vercel static hosting

### Content pipeline

`src/lib/contentLoader.ts` imports JSON and Markdown from `content/` at build
time. There is no runtime fetch for site content. Media paths are resolved to
bundled hashed assets by `mediaUrl()`.

`content/` contains:

```text
site.json
translations/ar.json + en.json
team/members.json
games/games.json
software/software.json
social/studio.json
blog/<slug>/post.ar.md + post.en.md
media/...
```

`src/types/content.ts` provides the typed shapes used by the UI.

### Routing

```text
/              Home
/software      Software catalogue
/team          Team index
/team/:id      Team profile
/blog          Blog index / empty state
/blog/:slug    Lazy Markdown article
/privacy       Privacy statement
*              Branded 404 (noindex)
```

Home is eager; secondary routes and the Markdown reader are lazy-loaded.
`vercel.json` contains the SPA fallback rewrite and security/cache headers.

### Language and motion contexts

- `LanguageContext`: loads both translation dictionaries, reads
  `5a1f:language`, sets `<html lang>` and `<html dir>`, and updates copy without
  a reload.
- `MotionContext`: reads `prefers-reduced-motion`, provides the manual Stop
  Motion state (`5a1f:motion`), and listens for `visibilitychange` to pause
  animations.
- `AudioContext`: creates the Web Audio context on the first explicit gesture.
  The master gain is 0.15; there is no autoplay and no audio file download.

---

## 4. Visual and interaction design

### Hybrid visual system

- Editorial shell: paper `#f5f0e5`, ink `#222420`, olive `#254f43`, coral
  `#cf6248`, serif display type, rule lines, and generous spacing.
- Game/software zones: deep ink surfaces derived from the same palette, with
  olive/coral neon only for state and emphasis.
- No new brand hues were invented. `src/styles/tokens.css` documents the
  extracted palette and derived tokens.

### First load

- Cinematic preloader on every hard load.
- Progress reflects the critical brand mark and loaded fonts. Below-the-fold
  images are left to the browser so a slow connection cannot hold the loader.
- Enter appears only at 100%; Skip is always available.
- Preloader background content is inert and hidden from assistive technology.
- Enter focus is moved to the Enter control when ready.
- After entering, focus moves to `#main` without scrolling.

### Navigation

- Glass navbar with scroll state.
- Desktop active navigation uses `aria-current="page"` or `"location"`.
- Mobile menu is a full-screen `role="dialog"` with `aria-modal="true"`.
- Focus moves to Close, 22-Tab focus-trap test passed, Shift+Tab wraps, Escape
  closes, and focus returns to the Open button.
- Mobile active links use neon styling and `aria-current`.
- Stop Motion and mute controls are available in the mobile menu.

### Motion

- Orbit rings animate with transform only.
- Hovering the contact board pauses its orbit rings.
- Manual Stop Motion reduces animation duration to effectively zero and
  persists the choice.
- `prefers-reduced-motion` sets orbit animation to `none` and reveal
  transitions to auto.
- Tab visibility sets `html[data-paused="true"]`; orbit `animation-play-state`
  becomes `paused` and returns to `running` when visible.

### Forms

- The join form is local-only and produces a `wa.me` URL.
- Empty submit produced 6 field errors, 6 `aria-invalid` values, an alert, and
  focus on `join-name`.
- Valid submit produced a `wa.me` handoff containing the entered name, with no
  backend request.
- Social links with empty `href` are hidden.

---

## 5. Accessibility

Implemented:

- Semantic landmarks and heading order.
- Visible 2px focus rings with offset; inverse-zone focus colors.
- Skip-to-content link:
  - hidden off-screen by default;
  - enters to `top: 12px` after a 350ms transition;
  - activates `#main`, sets `location.hash = "#main"`, and focuses `main`.
- Mobile dialog focus trap and focus return.
- `aria-current` navigation state on desktop and mobile.
- `aria-pressed` and labels for audio/motion controls.
- Language toggle accessible name includes its visible label.
- Form labels, descriptions, `aria-invalid`, alert region, and focus management.
- 404 page has `noindex`.
- Reduced-motion support and visibility pause.
- Decorative giant numerals removed where they caused contrast findings.
- Paper text uses olive or `--color-highlight-strong`, not low-contrast coral.

Audit results:

- Axe: **9 route/page audits, 0 findings**.
- Mobile menu axe: **0 findings**.
- Nested route mobile menu axe: **0 findings**.
- Lighthouse Accessibility: **100**.
- Lighthouse Best Practices: **100**.
- Lighthouse SEO: **100**.

Manual keyboard test:

- 22 Tab presses remained inside the mobile dialog.
- Shift+Tab wrapped correctly.
- Escape closed the dialog and returned focus.
- Skip link and the next keyboard focus both showed visible outlines.

---

## 6. Performance

### Final production Mobile Lighthouse

URL: `https://5a1f.vercel.app/`

| Category | Score |
|---|---:|
| Performance | **97** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

Metrics:

| Metric | Value |
|---|---|
| FCP | 2.0 s |
| LCP | 2.1 s |
| TBT | 20 ms |
| CLS | 0.015 |
| Speed Index | 2.4 s |
| Time to Interactive | 2.2 s |
| Total transfer | 265 KiB |
| Server latency | 140 ms |

This run used Lighthouse mobile emulation against the live Vercel alias after
the preloader optimization. An earlier production run before that optimization
scored 86, and a second run was invalidated by abnormal 4.45 s network latency.
The controlled local preview and the final production run both meet the target.

### Local production-build preview

URL: `http://127.0.0.1:4174/` (production build preview)

| Category | Score |
|---|---:|
| Performance | **93** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

Metrics:

| Metric | Value |
|---|---|
| FCP | 2.5 s |
| LCP | 2.7 s |
| TBT | 30 ms |
| CLS | 0.033 |
| Speed Index | 2.5 s |
| Time to Interactive | 2.7 s |
| Total transfer | 259 KiB |

The target was Mobile Performance 85+, and it is met. Scores vary with machine
load and network conditions. The final preloader pass removed below-the-fold
social icons from the critical wait and reduced the measured transfer from
277 KiB to 259 KiB.

### Build output

```text
index.html                          4.34 kB  | gzip   1.43 kB
assets/index-*.css                 65.22 kB  | gzip  12.43 kB
assets/index-*.js                 526.92 kB  | gzip 167.87 kB
assets/BlogPost-*.js              173.14 kB  | gzip  52.82 kB
assets/Software-*.js                6.76 kB  | gzip   2.22 kB
assets/Blog-*.js                    5.01 kB  | gzip   1.73 kB
assets/TeamMember-*.js              4.13 kB  | gzip   1.29 kB
assets/Team-*.js                    0.85 kB  | gzip   0.48 kB
```

The Markdown reader is isolated in the lazy `BlogPost` chunk. Vite reports an
advisory that the main chunk is over 500 kB; this is not a build failure.
Potential future work is vendor splitting via `manualChunks`, followed by a
full QA rerun. It was intentionally left out of this release to avoid changing
a verified bundle for a non-blocking warning.

### Runtime network

The route harness observed only the local preview host:

```text
HOSTS 127.0.0.1:4174
NO_EXTERNAL_HOSTS
```

The production browser smoke observed only `5a1f.vercel.app` plus inline
`data:` image URLs. No external font, script, image, or analytics requests were
made in either environment.

---

## 7. Content validation

Command:

```bash
npm run check-content
```

Result:

```text
Errors:   0
Warnings: 6
Notes:    4
```

Translation parity:

```text
175 matching keys in ar.json and en.json
```

Warnings/notes are expected pending-content items:

- 5 studio social links with empty `href` (hidden until supplied).
- 3 team avatars not yet supplied (initials fallback).
- 30 `PLACEHOLDER` values across games, software, bios, and skills.
- Blog currently has no posts; the empty state is intentional.

No personal phone numbers, addresses, or school names were found by the
privacy scan.

---

## 8. QA record

### Route and language QA

Harness: headless Edge over CDP against the production build.

```text
ROUTE_RESULTS 58 checks, 0 with problems
LANGUAGE_SWITCH {"scrollBefore":900,"clicked":true,"lang":"en","dir":"ltr","scrollY":900,"stored":"en","hasEnglishText":true}
LANGUAGE_PERSIST {"lang":"en","dir":"ltr"}
REDUCED_MOTION {"reduced":true,"orbitAnimation":"none","revealTransitions":"auto"}
AXE_RESULTS 9 audits, 0 with findings
HOSTS 127.0.0.1:4174
NO_EXTERNAL_HOSTS
```

The 58 checks cover routes at desktop and mobile widths and both languages.

### Interaction QA

```text
Menu open:
  expanded: true
  role: dialog, aria-modal: true
  full viewport: 390 x 844
  body overflow: hidden
  focus: Close menu, inside dialog
  focusable elements: 11
  axe findings: 0

Focus trap:
  22 Tab presses, all inside
  Shift+Tab wrap: inside

Menu close:
  expanded: false
  focus returned to Open menu
  body overflow restored

Stop Motion:
  data-motion: off
  stored: off
  aria-pressed: true
  label: Enable motion
  orbit duration: 1e-05s
  restored to on / 38s

Visibility:
  hidden -> data-paused="true", orbit animation-play-state paused
  visible -> data-paused="false", orbit animation-play-state running

Active navigation:
  desktop /team/amin -> "Team", aria-current="page"
  mobile /team/amin -> "Team", aria-current="page", neon color

Skip link:
  initial: off-screen
  after focus + 350ms: top 12px, transform identity
  activation: hash #main, main focused

Keyboard focus:
  next focus link visible, outline 2px solid

Form:
  invalid submit: 6 errors, 6 aria-invalid, alert, focus join-name
  valid submit: wa.me URL with name, status message, no backend
```

No console errors, runtime exceptions, failed requests, or external hosts were
recorded during the interaction run.

### Production browser smoke

Run against `https://5a1f.vercel.app` after the final deployment:

```text
Arabic home: title set, lang=ar, dir=rtl, canonical=/
Language switch: lang=en, dir=ltr, stored=en, English text present
/software: "Tools built by Amin.", canonical /software
/team: "The people behind 5A1F.", canonical /team
/team/amin: "Amin", canonical /team/amin
/blog: "Notes from the workshop.", canonical /blog
/privacy: "Privacy policy", canonical /privacy
/does-not-exist: "Page not found", robots=noindex, nofollow
Hosts: 5a1f.vercel.app + inline data: URLs only
Console errors / exceptions: none
```

The first harness pass read `/software` before its lazy chunk had rendered.
The wait condition was tightened to wait for route metadata and the pass was
repeated; the final results above are from the corrected run.

### Build and type checks

```text
npm run check          -> pass
npm run check-content  -> pass (0 errors)
npm run build          -> pass
```

---

## 9. SEO, metadata, and deployment hardening

Implemented:

- Per-route title, description, canonical URL, and Open Graph updates.
- Base `index.html` includes:
  - canonical;
  - Open Graph and Twitter card metadata;
  - JSON-LD Organization and WebSite;
  - theme color and color scheme;
  - favicon, Apple touch icon, manifest;
  - bilingual `noscript` message.
- `public/robots.txt` and `public/sitemap.xml`.
- `public/site.webmanifest` with generated icons.
- `og-image.png` generated from the brand.
- 404 route sets `noindex`.
- Vercel headers:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy` for camera, microphone, geolocation, payment, USB
  - immutable one-year caching for hashed `/assets/*`
  - one-day caching for icons/manifest/OG image
- SPA rewrite for deep links.

Deployment note: the first production deployment returned 404 for deep routes
because `cleanUrls` caused the `/index.html` rewrite destination to redirect.
`cleanUrls` was removed, the SPA rewrite was retained, and the site was
redeployed. Deep links were then verified on the production alias.

---

## 10. Deployment record

### GitHub

- Repository created: https://github.com/iamnxpro/5a1f-studio
- Branch: `main`
- Initial commit: `8216466 feat: complete 5A1F Studio bilingual static site`
- SPA fix: `3d0cc87 fix: restore SPA deep-link fallback on Vercel`
- Privacy metadata: `341e676 fix: add route metadata to privacy page`
- Performance: `e1a6b73 perf: preload only critical brand asset before entry`

### Vercel

- Project: `iamnxpro/5a1f`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required
- No serverless functions
- Build completed successfully on Vercel (2294 modules, Vite 7.3.8)
- Final production deployment: `dpl_a1LgJnzA7mRS7hZiU5DAEJ7Jcjv2` (READY)
  from commit `e1a6b73`
- Production deployment URL:
  https://5a1f-q4q38fcr9-iamnxpro.vercel.app
- Production alias: https://5a1f.vercel.app
- All tested deep links return 200: `/`, `/software`, `/productions`,
  `/services`, `/team`, `/team/amin`, `/team/abdulsamad`, `/team/emad`, `/blog`,
  `/blog/*`, `/privacy`, and unknown paths. Legacy `/team/abdullah` redirects to
  `/team/abdulsamad`.
- HTML is served with `max-age=0, must-revalidate`; hashed `/assets/*` files
  are served with `max-age=31536000, immutable`; icons and the manifest use
  one-day caching.
- Verified headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, and `Permissions-Policy`.
- Remote browser smoke: Arabic home loads RTL, language switch to English
  persists across hard navigation, all routes render their headings, the 404
  sets `noindex, nofollow`, and the privacy page has its own title and
  canonical URL. No console errors, runtime exceptions, or external asset
  hosts were recorded.
- Git auto-deploy is not connected. Deployments are run with the Vercel CLI.
  To enable push-to-deploy, connect the Vercel GitHub integration in the
  dashboard and link the `iamnxpro/5a1f-studio` repository.

---

## 11. Known limitations and pending input

These are content/assets, not code defects:

1. **Arabic font files** - waiting for owner-provided `.woff2` files. The site
   uses a system Arabic stack until then and makes no external font request.
2. **Team avatars** - supplied images were vectorized; Emad's picture is still
   pending, so his initials fallback is shown.
3. **Games** - two `PLACEHOLDER` entries.
4. **Software** - one `PLACEHOLDER` entry.
5. **Team bios/skills** - `PLACEHOLDER` values are hidden rather than invented.
6. **Studio social links** - five empty `href` values; hidden in the UI.
7. **Blog** - no posts; the empty state is intentional.
8. **Bundle advisory** - main JS chunk is 526.92 kB / 167.87 kB gzip. This is a
   warning only. Mobile Performance is 93.

No fabricated personal data, fake team biographies, fake games, or fake social
links were added.

---

## 12. Next steps

### For the studio owner

1. Supply the Arabic font files and activate the `@font-face` block in
   `src/styles/fonts.css`.
2. Add Emad's picture to `content/media/team/` (the other two are already
   vectorized).
3. Replace `PLACEHOLDER` values in:
   - `content/games/games.json`
   - `content/software/software.json`
   - `content/productions/productions.json`
   - `content/team/members.json`
4. Fill the pending studio, Abdul Samad, and Emad URLs in `content/social/studio.json`
   and `content/team/members.json`.
5. Publish blog posts in `content/blog/<slug>/` using the documented
   frontmatter.
6. Re-run `npm run check-content` and `npm run build`, then redeploy.

### Optional engineering polish

- Add `manualChunks` vendor splitting and rerun Lighthouse/axe.
- Add more automated visual regression coverage.
- Add a CI workflow for `check`, `check-content`, and `build`.
- Consider a privacy-friendly, self-hosted analytics alternative only if the
  zero-tracking requirement changes.

---

## 13. Final status

**Build:** complete
**Content architecture:** complete
**Bilingual/RTL:** complete
**Accessibility:** complete for current content
**Performance target:** met (production Mobile 97, local preview 93)
**Deployment:** Vercel production alias live; deep links, assets, headers, language persistence, 404 noindex, and route metadata verified
**Blocking issues:** none for launch; pending studio-supplied content only

---

## 14. Finalization update (2026-11-16)

### Typography (self-hosted, zero external requests)
- Installed and bundled `@fontsource/amiri` (Arabic editorial serif) and
  `@fontsource/ibm-plex-sans-arabic` (Arabic UI/body) alongside existing
  self-hosted Latin families.
- Updated `src/main.tsx`, `src/styles/fonts.css`, `src/styles/tokens.css`,
  `src/hooks/usePreloadProgress.ts`, and `src/assets/fonts/README.md`.
- Arabic body/headings resolve to `IBM Plex Sans Arabic` / `Amiri` (verified in
  local preview); no font CDN or external font request is used.

### Team avatars (vectorized SVG)
- Vectorized provided team images into clean SVG avatars:
  `content/media/team/amin.svg` and `content/media/team/abdulsamad.svg`
  (source raster images moved out of `content/` to `design/team-source/`,
  gitignored). Emad's avatar remains pending.
- Updated `content/team/members.json` avatar references and `content/media/README.md`.

### Verification
- `npm run check-content`: **0 errors, 6 warnings, 0 notes**.
- `npm run build`: **success** (0 errors).

### Deploy / auto-deploy
- Changes committed and pushed to `iamnxpro/5a1f-studio` `main`.
- Production deployed via Vercel CLI (`vercel deploy --prod --project 5a1f --yes`).
- Native GitHub→Vercel auto-deploy is **not yet connected**: `vercel git connect`
  / Vercel API reports `400` — “To link a GitHub repository, you need to install
  the GitHub integration first.” Install/authorize the Vercel GitHub App and
  grant repo access: https://github.com/apps/vercel, then run:
  `vercel git connect https://github.com/iamnxpro/5a1f-studio.git --project 5a1f --yes`
  (requires Vercel GitHub App installation for the account/repo; `gh` CLI not
  authenticated in this environment). Once connected, pushes to `main` will
  auto-deploy.

---

## 15. Team metadata update (2026-11-17)

### Content
- Added bilingual `country` to all member profiles and displayed it on team
  cards, member profile pages, and the home contact orbit:
  Amin — Morocco; Abdul Samad — Palestine; Emad — Sudan.
- Added Amin's kunya (`أبو عثمان` / `Abu Othman`), shown as “Also known as” on
  profile cards and pages.
- Changed the second founder's display name to `عبد الصمد` / `Abdul Samad` and
  kept the profile id as `abdulsamad`; `/team/abdullah` now redirects to
  `/team/abdulsamad`.
- Replaced Amin's placeholder skill with `2D Design` and `3D Design`, and
  reordered skills so both are visible on compact cards.
- Added Emad as a new member (`Programmer` / `مبرمج`) with `Programming` skill.
  Avatar and social links intentionally remain empty until the owner supplies
  his picture and links file; the initials fallback is shown meanwhile.
- Updated Arabic/English About copy, sitemap entries, content checker
  validation, and READMEs.

### Verification
- `npm run check-content`: **0 errors, 6 warnings, 0 notes** (177 translation
  keys matched).
- `npm run build`: **success** (0 errors; chunk-size advisory only).
- Remote browser QA on production: Arabic/English country labels, kunya,
  Abdul Samad rename, Emad profile, and old-URL redirect all pass. No console
  errors, 4xx responses, or external asset hosts.

### Deploy
- Commit: `2e80074 feat: localize team countries, kunya, and Emad profile`
  (pushed to `origin/main`).
- Vercel production deployment: `dpl_DWM6fo1pC5HKfaUPMNGf2mt1x5JS` (READY).
- Alias: https://5a1f.vercel.app

### Still pending from the studio owner
1. Emad's profile picture, to vectorize into `content/media/team/emad.svg`.
2. The links `.txt` file, to populate Emad's `social` array.

Native GitHub→Vercel auto-deploy remains blocked by the same missing GitHub
integration authorization described in section 14.

---

## 16. Comprehensive bilingual update (2026-11-18)

### Content and pages
- Added `/productions` (`الأعمال الفنية`) using the games/software showcase
  layout, with Abdul Samad credited as the requested section lead. Content lives
  in `content/productions/productions.json` with two placeholder entries.
- Added `/services` (`طلب عمل / خدمة`) matching the Join Us layout. The form has
  the six requested fields and two no-backend handoffs: WhatsApp (`wa.me`) and
  email (`mailto:` to the official studio address), both prefilled.
- Expanded the Join form with Department, Tools & Software Mastered, Previous
  Projects, the four exact AI-usage answers, Days/Hours per week, Internet &
  Electricity, Why join, and Where heard. Contact is now `وسيلة تواصل` /
  `Contact Method` with the exact requested placeholder and no phone-number
  restriction. The required pre-launch acknowledgment sits beside the Privacy
  Policy link.
- Moved `iamnx.amin.pro@gmail.com` to Amin's personal Team profile only. The
  official studio email remains `official5a1fstudios@gmail.com`.
- Added pending profile slots for Abdul Samad's Epic Games account and WhatsApp
  number, and for Emad's portfolio links. Added studio slots for GitHub
  Organization, Discord Server, WhatsApp Channel, PayPal, Ko-fi, and Itch.io.
- Removed Kareem completely from content, translations, avatars, sitemap, and
  documentation. Renamed the second founder's avatar to `abdulsamad.svg`;
  `/team/abdullah` remains only as a legacy redirect and is never displayed as
  a name.

### Verification
- `npm run check-content`: **0 errors, 10 warnings, 0 notes** (235 translation
  keys matched; warnings are the intentional empty pending `href` values and
  `PLACEHOLDER` copy).
- `npm run build`: **success** (chunk-size advisory only).
- Production browser QA at https://5a1f.vercel.app passed all 21 checks:
  both languages, no Kareem text, team names/countries, Amin's personal email
  only on his profile, official email unchanged on home, productions attribution,
  services field labels and both buttons, prefilled WhatsApp formatting, Join
  acknowledgment/contact/department/AI fields, legacy redirect, no external
  hosts, no 4xx responses, and no console errors.

### Deploy
- Commit: `9f0da6a feat: add productions and service request pages, expand join form, remove Kareem`
  (pushed to `origin/main`).
- Vercel production deployment: `dpl_E6BwfK9urXyS3PkefA71xj7qoktL` (READY).
- Alias: https://5a1f.vercel.app

### Still pending from the studio owner
1. Emad's profile picture, to vectorize into `content/media/team/emad.svg`.
2. The links `.txt` file, to populate Emad's portfolio slot, Abdul Samad's Epic
   Games/WhatsApp slots, and the six studio platform slots.

---

## 17. Team, avatar and platform update (2026-11-18)

### Content and assets
- Configured all six studio platform links: GitHub Organization
  (`official5a1fstudio`), Discord (`AGKpuRb5`), WhatsApp Channel
  (`0029Vb98zMkFSAtACEG6IX0T`), PayPal (`5a1fstudio`), Ko-fi (`5a1fstudio`),
  and Itch.io (`official5a1fstudio.itch.io`).
- Set Abdul Samad's WhatsApp to `https://wa.me/970598772823`. His Epic Games
  slot remains intentionally empty.
- Set Emad's WhatsApp to `https://wa.me/249924879166` and Discord to
  `https://discord.com/users/1561738177889181697`. The supplied JPEG was traced
  into `content/media/team/emad.svg`; the raster source is preserved in the
  gitignored `design/team-source/` folder.
- Added Hosin as a fourth team member with Instagram
  (`h.e.7.02_v1`) and Discord (`1418304955361525914`). No photo was supplied,
  so an original themed `hosin.svg` placeholder was designed. Country, specific
  role and skills were not invented: the profile uses generic `Team Member` /
  `عضو الفريق` wording with hidden `PLACEHOLDER` bio/skills.
- Amin's personal email remains `iamnx.amin.pro@gmail.com` on his profile only;
  the official studio email remains `official5a1fstudios@gmail.com`.
- Updated bilingual About copy from three to four paths, added `/team/hosin` to
  the sitemap, refreshed the READMEs, and taught `scripts/check-content.ts`
  that intentional `wa.me/<number>` contact links are not privacy leaks.

### Verification
- `npm run check`: **success** (0 TypeScript errors).
- `npm run check-content`: **0 errors, 3 warnings, 0 notes**; 235 translation
  keys matched, and all 18 visual assets are under 1 MB. The three warnings are
  the intentionally empty Epic Games and Emad portfolio slots plus hidden
  `PLACEHOLDER` copy.
- `npm run build`: **success** (chunk-size advisory only).
- Local production-preview QA: **32/32 checks passed**, with no external hosts,
  no 4xx responses, and no console errors.
- Production browser QA at https://5a1f.vercel.app: **32/32 checks passed**,
  including explicit checks for Hosin on both team pages and his profile, the
  four-path About copy in both languages, all six studio platform URLs, Emad's
  and Abdul Samad's contact links, avatar loading, and the `/team/hosin`
  sitemap entry. No external hosts, 4xx responses, or console errors.

### Deploy
- Commit: `e7b1426 feat: add Hosin, vectorize Emad avatar, configure studio links`
  (pushed to `origin/main`).
- Vercel production deployment: `dpl_DL47qQynQ5zSQhFb3dMLfecNh4Uv` (READY).
- Alias: https://5a1f.vercel.app

### Still pending from the studio owner
1. Abdul Samad's Epic Games URL.
2. Emad's portfolio/links URL.
3. Real bios, skills, and Hosin's specific role (currently generic and hidden
   placeholders where unknown).

Native GitHub → Vercel auto-deploy remains blocked by the missing GitHub
integration authorization described in section 14. CLI deploys work now; after
authorizing the Vercel GitHub App, run:
`vercel git connect https://github.com/iamnxpro/5a1f-studio.git --project 5a1f --yes`.
