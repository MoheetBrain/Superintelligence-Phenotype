# Hamiltonian Recovery website

The public website for **Hamiltonian Recovery**, the supplier-account recovery and reconciliation service of
Hamiltonian Labs Ltd (Companies House No. 17347944). It is served at <https://superintel.site>.

The site is three static pages and a 404 page:

| Route       | Source                                                                     |
| ----------- | -------------------------------------------------------------------------- |
| `/`         | `src/pages/HomePage.tsx` with copy from `src/content/site.ts`              |
| `/privacy/` | `src/pages/LegalPage.tsx` with `privacyPolicy` from `src/content/legal.ts` |
| `/terms/`   | `src/pages/LegalPage.tsx` with `websiteTerms` from `src/content/legal.ts`  |
| `404.html`  | `src/pages/NotFoundPage.tsx`                                               |

There are no cookies, analytics, trackers, third-party fonts or CDNs. Pages make no requests to any other origin.
The enquiry form never transmits data: it composes a pre-addressed email in the visitor's own mail application.

## How it is built

React and TypeScript are used only as a **build-time templating language**. Every page is rendered to static HTML,
so all content is in the document for search engines and readers without JavaScript.

```
vite build                                  # browser assets: one stylesheet + a ~2 kB vanilla TS module
vite build --ssr src/entry-server.tsx       # page templates bundled for Node
node scripts/prerender.mjs                  # writes dist/**/index.html, 404.html, sitemap.xml, robots.txt
```

The only JavaScript shipped to the browser (`src/client/`) enhances two things: the mobile navigation disclosure
and the enquiry composer. Without JavaScript the navigation is shown in full (`public/noscript.css`) and the
`mailto:` link and visible email address remain the contact route.

| Concern                                   | Location                                  |
| ----------------------------------------- | ----------------------------------------- |
| Copy, company details, navigation, legal  | `src/content/` (`types.ts` is the schema) |
| Hero illustration rows (fictional)        | `src/content/illustration.ts`             |
| Interface microcopy (labels, 404 text)    | `src/lib/ui-text.ts`                      |
| Document head, header, footer, components | `src/components/`                         |
| Page templates                            | `src/pages/`                              |
| Routes, sitemap and robots rendering      | `src/entry-server.tsx`                    |
| `mailto:` URL builder (pure, unit-tested) | `src/lib/mailto.ts`                       |
| Styles (plain CSS, custom properties)     | `src/styles/`                             |
| Static files (favicon, icons, OG image)   | `public/`                                 |

Fonts are self-hosted from Fontsource (Inter and Source Serif 4, Latin subset, SIL Open Font License).
Icons are Lucide, rendered to inline SVG at build time.

## Requirements

Node.js 22.13 or later (`.nvmrc` pins 24.18.0) and npm.

## Commands

```sh
npm ci                 # install exact dependencies
npm run dev            # development server at http://127.0.0.1:3016 (pages rendered on request)
npm run check          # TypeScript
npm test               # unit tests (Vitest)
npm run build          # check + client build + SSR build + prerender into dist/
npm run preview        # serve dist/ at http://127.0.0.1:4173 with production headers and 404 handling
npm run test:e2e       # browser tests against the preview (run `npm run build` first)
npm run format         # Prettier
```

End-to-end tests need Chromium once: `npx playwright install chromium`.

Other scripts:

- `npm run images` regenerates `public/og-image.png` (1200×630) and `public/apple-touch-icon.png` (180×180) from
  the brand and hero headline. Run it after changing either, then commit the PNGs. Needs Node 22.18+.
- `npm run screenshots` writes full-page screenshots of the running preview to `$TMPDIR/hr-shots`
  (`SHOTS_EXTRA=1` adds more widths; `SHOTS_SEGMENT=1200` also writes page segments).

## Tests

- **Unit** (`tests/unit/`): renders every page and checks company identification (legal name, company number,
  registered office, relationship line), that no prospective client is named, that every `#…` and `/#…` link
  resolves to an existing id, head metadata, no third-party or inline resources, the sitemap and robots, the
  footer's jurisdiction rule, and the `mailto:` encoder.
- **End-to-end** (`tests/e2e/`, Playwright, desktop 1440×900 and mobile 390×844): navigation scrolling, the mobile
  menu (button, Escape, link selection), the composer's `mailto:` URL, legal pages, the 404 page, the no-JavaScript
  experience, security headers, and axe accessibility checks (no serious or critical violations). Every test fails
  on console errors or any request to another origin.

## Deployment (Vercel)

`vercel.json` configures the Vite framework preset, `npm ci`, `npm run build` and the `dist` output directory.
It also sets:

- `trailingSlash: true`, so `/privacy` and `/terms` redirect to their canonical `/privacy/` and `/terms/`.
- Security headers on every route: a strict Content-Security-Policy (`'self'` only; `form-action` also allows
  `mailto:`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` and
  `X-Frame-Options`. `npm run preview` applies the same headers so tests catch policy violations.
- Long-lived immutable caching for hashed files under `/assets/`.
- Temporary (307) redirects for the former research site: `/research`, `/research/*` and `/llms.txt` go to
  `https://superintel-research-archive.vercel.app`. Update the host if the archive is deployed elsewhere.

Vercel serves `dist/404.html` for unknown routes automatically.

## Preserved research website

This repository previously hosted the Superintel independent AI research website. It is preserved unchanged:

- Branch: `archive/superintel-original-2026-11`
- Tag: `superintel-original-2026-11-19`
- Commit: `980dd3eed7701958257a96b3452b93ba4a14382d`

## Licence

See `LICENSE`.
