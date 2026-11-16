# Arabic fonts (bundled)

The site now ships two open-source Arabic families from npm through
`src/main.tsx`:

- **Amiri** (`@fontsource/amiri`) — editorial Arabic serif for `.font-heading`.
- **IBM Plex Sans Arabic** (`@fontsource/ibm-plex-sans-arabic`) — Arabic UI/body.

Vite copies the WOFF2/WOFF files into `dist/assets/` at build time. No font CDN
or runtime network request is used.

This folder is kept only for optional future local font drops. To replace a
family without npm, add the files here, declare `@font-face` in
`src/styles/fonts.css`, and update the `--font-arabic-sans` /
`--font-arabic-serif` tokens.
