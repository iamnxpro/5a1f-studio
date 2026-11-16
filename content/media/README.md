# content/media - editable assets

This folder is the only place site images live. Paths in JSON are relative to
`content/` and are resolved to bundled assets at build time. No image is fetched
from a remote host at runtime.

## Main assets

| File | Purpose |
|---|---|
| `content/media/logo.svg` | Traced 5A1F wordmark used by the navbar, preloader, hero, and contact orbit. Favicons, PWA icons, and the OG image were generated from it. |
| `content/media/logo.png` | Optional raster fallback; the live site uses the SVG. |
| `content/media/team/amin.svg` | Amin's vector avatar (square, stylized/illustrated; never a real face photo). |
| `content/media/team/abdullah.svg` | Abdullah's vector avatar, same rules. |
| `content/media/team/kareem.svg` | Kareem's vector avatar, same rules. |

If an avatar is missing, the UI renders the member's initials. Nothing breaks.
If the SVG logo is unavailable, `StudioLogo` falls back to the built-in `5A1F`
monogram. Keep individual images under **1 MB**; `npm run check-content`
reports oversized files.

## Icons

`media/images/` contains:

`whatsapp.webp`, `instagram.webp`, `facebook.svg`, `github.webp`, `gmail.webp`,
`discord.png`, `youtube.svg`, `itchio.svg`.

Replace them with your own icons using the same filenames, or update the paths
in the relevant JSON file.

## Future folders

Optional future folders include `media/games/` and `media/software/` for covers
and screenshots. Add the corresponding paths to the JSON content.
