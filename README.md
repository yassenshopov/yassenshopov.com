# yassenshopov.com

Personal website of Yassen Shopov — blog ("Life Engineering"), project showcase,
Notion templates, a digital-art gallery, and a media **Library** (books, movies &
series) with a drag-to-rank tier list.

Built with the Next.js App Router, TypeScript (strict), and Tailwind CSS, and
deployed on Vercel.

## Tech stack

- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + `tailwindcss-animate`, shadcn/ui-style primitives (Radix)
- **Content:** local JSON (blog posts, library items, tier boards), validated with Zod
- **Email:** Resend (contact form)
- **Assets:** Vercel Blob for offloaded images
- **Tooling:** ESLint (flat config), Prettier, Vitest, Playwright, Husky + lint-staged
- **CI/CD:** GitHub Actions (lint · typecheck · test · build), Lighthouse CI, Dependabot

## Getting started

```bash
npm install
npm run dev          # http://localhost:26
```

Create a `.env.local` for the optional integrations:

```bash
RESEND_API_KEY=...           # contact form email delivery (optional in dev)
CONTACT_FROM_EMAIL=...        # verified Resend sender (falls back to onboarding@resend.dev)
BLOB_READ_WRITE_TOKEN=...     # only needed to run scripts/migrate-images-to-blob.mjs
```

## Scripts

| Command                           | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `npm run dev`                     | Start the dev server (Turbopack) on port 26     |
| `npm run build`                   | Production build                                |
| `npm run lint` / `lint:fix`       | ESLint over the app source                      |
| `npm run typecheck`               | `tsc --noEmit`                                  |
| `npm run format` / `format:check` | Prettier                                        |
| `npm test` / `test:watch`         | Vitest unit tests                               |
| `npm run e2e`                     | Playwright end-to-end tests                     |
| `npm run analyze`                 | Build with the bundle analyzer (`ANALYZE=true`) |

## Architecture

```
src/
  app/                 # App Router routes (each section has page.tsx + layout.tsx)
    api/               # Route handlers (contact + dev-only library admin)
    error.tsx          # Route error boundary  ·  global-error.tsx  ·  not-found.tsx
  components/          # UI — server components by default, 'use client' only where needed
    home/ blog/ library/ projects/ about/ notion/ ui/
    Reveal.tsx         # CSS scroll-reveal wrapper (replaces framer-motion fade-ins)
  data/                # Content + typed access layer (see "Data layer" below)
  hooks/               # Client hooks (useLibrary, useLibraryEntryEditor)
  lib/                 # Pure helpers (blog, library-utils, rate-limit, format-date, …)
  types/               # Shared types (blog)
```

### Server vs client boundaries

The site favours **React Server Components**. Sections are only marked
`'use client'` when they need state, effects, or event handlers. Presentational
scroll-in animations use `components/Reveal.tsx` — a tiny client leaf backed by
CSS in `globals.css` (with reduced-motion and no-JS fallbacks) — so the sections
that use it stay on the server.

### Data layer

Content lives as local JSON with a typed, validated access layer:

- **Blog** — `data/blog-posts.json` holds posts (markdown in a `content` field).
  `lib/blog.ts` is **server-only**: it Zod-validates the payload, sorts newest-first,
  and pre-computes reading time. Only the single post being viewed is sent to the
  client. The canonical type is `types/blog.ts` (`BlogPost`).
- **Library** — `data/library-items.json` (~400 works). `data/library.ts` holds the
  **client-safe types + pure helpers**; `data/library.server.ts` is **server-only**
  and owns the JSON import + Zod validation. The `/library` and `/library/tier-list`
  routes are server components that load the validated catalogue and pass it into
  client islands (`components/library/LibraryView.tsx`, `LibraryTierListView.tsx`),
  keeping the big JSON and Zod out of the browser bundle.
- **Tier list** — `data/library-tiers.json` stores ordered item ids per board/tier;
  `data/library-tiers.ts` normalizes it at the boundary (Zod-free so it stays
  client-safe for the `TierBadge`).

## Authoring content

### Add a blog post

Append an entry to the `posts` array in `src/data/blog-posts.json`:

```jsonc
{
  "slug": "my-post", // URL: /blog/my-post (must be unique)
  "title": "My Post",
  "description": "One-line summary used in cards and metadata.",
  "date": "2026-06-28", // ISO; drives ordering + prev/next
  "coverImage": "/resources/images/blog/my-post.webp",
  "tags": ["engineering"],
  "author": "Yassen Shopov",
  "content": "# Heading\n\nMarkdown body…",
}
```

The schema is enforced at build time (`lib/blog.ts`) — a malformed post fails the
build rather than rendering broken. Reading time is derived automatically.

### Add a library item

Append to `src/data/library-items.json` (validated by `data/library.server.ts`):

```jsonc
{
  "id": "unique-id",
  "title": "The Work",
  "type": "book", // "book" | "movie" | "series"
  "author": "Author Name", // or "director" / "creator"
  "genre": ["Sci-Fi"],
  "description": "Short blurb.",
  "coverImage": "/resources/images/library/the-work.webp",
  "entries": [
    // one per reading/watch; supports re-reads
    { "status": "completed", "rating": 5, "dateCompleted": "2026-01-15" },
  ],
}
```

In development you can also drag-and-drop a new cover onto a card, and edit
ratings/dates inline from the item modal — these write back to the JSON via the
dev-only routes under `app/api/library/` (disabled in production).

## Deployment

Pushes to `main` deploy automatically on Vercel. CI must pass first
(`.github/workflows/ci.yml`): Prettier → ESLint → typecheck → unit tests → build.

## License

MIT — see [LICENSE](LICENSE).
