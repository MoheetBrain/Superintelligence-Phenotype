# Deployment runbook

**Update — 12 September 2026:** The creator has requested publication and a Sites destination is registered in `.openai/hosting.json`. The current workflow uses Sites with owner-private access by default; see [PUBLISHING.md](PUBLISHING.md). The Vercel-specific guidance below remains an alternative hosting runbook. Registration alone is not proof of a successful deployment.

**Publishing code on GitHub and publishing the running website are separate steps.** A Git branch or repository URL is not a live website.

## Reproduce locally

Use Node >=22.13.0 compatible with the locked packages. This release was built with Node **24.18.0** and npm **11.16.0**; `.nvmrc` records the tested runtime.

```sh
npm ci
npm run dev
# Open http://127.0.0.1:3016 — strict port, loopback only.
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
# Open http://127.0.0.1:4173
npm run size
```

`test:e2e` starts a production preview if one is not already running. Build first. To exercise the development server, run `E2E_DEV=1 npm run test:e2e`. Do not run concurrent suites writing to the same report paths.

## Static hosting configuration

| Setting          | Value                                     |
| ---------------- | ----------------------------------------- |
| Framework        | Vite                                      |
| Project root     | Repository root containing `package.json` |
| Install command  | `npm ci`                                  |
| Build command    | `npm run build`                           |
| Output directory | `dist`                                    |

The checked-in `vercel.json` contains exactly these four settings. Do not set the root to `app/` or `web/`. There is no backend, environment secret, account feature, model API or database to configure. Hash-based views do not need SPA path rewrites. Deploy at the hostname root; deploying to a GitHub Pages subdirectory would require a separately tested Vite base-path change.

## Publication prerequisites

1. Identify the destination project and account and obtain explicit publication authorisation for that destination.
2. Verify the provider's current terms immediately before publication. The supplied constraint is that **Vercel Hobby is for personal, non-commercial use only**. Do not assume a founder or commercial project qualifies. The linked Hobby plan and fair-use pages were checked on 2026-09-11 and retain that restriction; recheck before publication. Review the current [Hobby plan documentation](https://vercel.com/docs/plans/hobby) and [fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines). Do not buy or upgrade anything without authorisation.
3. Run a fresh install, checks, tests and build. Publish only `dist`, preserving the public third-party notices. Never upload `.inspection`, local environment files, test traces, private research or `node_modules`.
4. Enable normal static compression and cache hashed assets immutably; revalidate `index.html`. The app can run without analytics or third-party requests.
5. Open the actual preview URL. Select Metacognition by canvas and catalogue, isolate, reset, share into a fresh browser context, test Back/Forward and test the mobile catalogue. Check network and console errors at the actual destination.
6. Record the deployed commit, URL, hosting project, terms check and smoke-test results. Mark the site live only after this step succeeds.

## Rollback

Keep the previous deployment available. Restore that version through the host's normal rollback mechanism if the smoke test fails. Saved URLs are versioned; keep support for `v=1` when evolving the schema.
