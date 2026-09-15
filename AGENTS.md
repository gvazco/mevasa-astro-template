# AGENTS.md

## Quick commands

```bash
npm install          # first time
npm run dev          # dev server on :4321
npm run build        # production build → dist/
npm run start        # node ./dist/server/entry.mjs (Docker entrypoint)
npx astro check      # type-check (no npm script wrapper)
npx astro sync       # regenerate .astro/types.d.ts after schema changes
```

No `lint`, `test`, or `format` scripts exist. Prettier config is in `.prettierrc` (semi, singleQuote, tabWidth 2).

## Architecture

**Astro 6 SSR** with Node.js standalone adapter. Not a static site.

- **CMS:** Directus at `api-mevasa.mevasa-comercializadora.com`. All content fetched via `fetch()` + Zod validation (`src/types/index.ts`).
- **Contact form:** Posts to WordPress Contact Form 7 REST endpoint using `HOME_URL`.
- **Rendering:** Category/tag listing pages pre-render (`getStaticPaths`). All `[slug].astro` detail pages are SSR (`prerender = false`). On Zod validation failure, detail pages redirect to `/404`.
- **Images:** Served from `PUBLIC_ASSETS` URL, rendered via `<Picture>` in avif/webp. Domain allowlist in `astro.config.mjs`.

## Environment setup

**No `.env.example` exists.** Three env vars are required — the app fails without them:

| Variable | Purpose | Dev value |
|---|---|---|
| `API_ITEMS` | Directus `/items` base URL | `https://api-mevasa.mevasa-comercializadora.com/items` |
| `PUBLIC_ASSETS` | Directus asset image base | `https://api-mevasa.mevasa-comercializadora.com/assets/` |
| `HOME_URL` | Contact form POST target | `http://comercializadora-mevasa.local` (dev) / production URL |

`.env.development` and `.env.production` are gitignored. Copy or recreate them after clone.

## Gotchas

- **Node 22+:** `.nvmrc`, `package.json` engines, and Docker (`node:22-alpine`) all require Node 22.
- **Tailwind v4:** No `tailwind.config.*`. Theme is CSS-first in `src/styles/global.css` via `@theme` block. Custom utilities (`bg-image`, `coffee-icon`, etc.) defined with `@utility`.
- **Path alias:** `@/*` → `src/*` (used in all imports).
- **Unused declared deps:** `gsap`, `@astrojs/react` are in `package.json` but not imported in `src/`. `swiper` CSS is loaded but JS import is absent.
- **`src/pages/api/`** exists but is empty.
- **Image domains:** `astro.config.mjs` allowlists `coffeeshop.local` and the Directus host. Add new image domains there.

## Deployment

Docker via `dockerfile` (node:22-alpine, `npm ci`, `npm run build`, `node ./dist/server/entry.mjs`). Deployed through Coolify. No CI/CD workflows.
