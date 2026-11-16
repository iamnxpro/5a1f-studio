# Blog content structure

Each article lives in its own folder:

```
content/blog/<slug>/
  post.ar.md
  post.en.md
  cover.webp        (optional)
```

`<slug>` becomes the URL: `/blog/<slug>` — use lowercase latin letters, digits and
hyphens only (e.g. `first-devlog`).

## Frontmatter (required)

```yaml
---
title: "Article title"
summary: "One-sentence summary used in the index."
date: "2026-01-20"
tags: ["devlog", "godot"]
cover: "cover.webp"   # optional, relative to the post folder
---
```

Arabic posts use the same keys in Arabic. If only one language exists, the reader
shows the available version with a localized notice banner.

> Do not put personal data (phone numbers, addresses, school names) in posts.
> `npm run check-content` scans every Markdown file for leaks.
