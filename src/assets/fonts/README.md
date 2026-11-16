# Arabic fonts (drop-in folder)

The Arabic typeface is intentionally **not** bundled yet — the studio owner will
add it. Until then the site falls back to a local/system Arabic stack with zero
network requests.

## Required files

Place the Arabic `.woff2` files here with these exact names:

```
src/assets/fonts/cairo-400.woff2
src/assets/fonts/cairo-600.woff2
src/assets/fonts/cairo-700.woff2
src/assets/fonts/cairo-800.woff2
```

If you prefer **Tajawal**, use:

```
src/assets/fonts/tajawal-400.woff2
src/assets/fonts/tajawal-700.woff2
```

## Activate

1. Drop the files in this folder.
2. Open `src/styles/fonts.css`.
3. Uncomment the `@font-face` block and keep the `font-family: "Cairo";` name.
4. Restart `npm run dev` (or rebuild).

Arabic text is then rendered with Cairo first, falling back to system fonts.

> Latin text is already self-hosted from npm: **Inter** (UI), **DM Serif Display**
> (editorial headings) and **Orbitron** (numerals / wordmark). No font CDN is used.
