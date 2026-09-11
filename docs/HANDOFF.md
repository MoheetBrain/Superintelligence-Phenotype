# ASI Atlas — release handoff

**Implemented and verified:** an editorial ASI phenotype overview, twelve qualitative specification cards, a future-forms explainer and a functioning Body explorer with twelve substantive capability cards, original selectable Three.js robot geometry, HTML catalogue and inspector, isolation/reset, layers, local search, future-hypothesis filters, conceptual separation and camera-preserving share URLs.

Local development: **http://127.0.0.1:3016**. Static production preview: **http://127.0.0.1:4173** while `npm run preview` is running. These are local URLs, not public deployments.

## Product direction after refinement

ASI Atlas is a profile of possible superintelligence. The robot is an interactive navigation anchor. The landing screen pairs an ASI definition and three phenotype clusters with a capability snapshot. Below it, the twelve-domain index leads into rich dossiers, while the twelve-card specification sheet explains physical, cognitive and distributed possibilities qualitatively. Future forms distinguish remote control, execution migration and independent instances; persistence is conditional.

The visual design uses charcoal and ivory surfaces, warm metal accents, larger editorial typography, generous spacing and a light studio around the robot. Mobile visitors see the robot immediately after the ASI framing. Source-backed observations remain in their scoped evidence cards; no scenario is passed off as an observed capability.

## Substantive implementation

- Replaced the reference's anatomy asset/loading architecture with a fresh procedural renderer. The refinement uses original smooth lofted housings, beveled panels, a fitted crown, sensor face, articulated hands and tapered limbs in twelve independently selectable groups. A studio stage replaces the grid; decorative geometry stays outside the picking registry.
- Added the full required capability schema, editable domain names/aliases/mappings, conditional examples, subtraits, scientific distinctions, proposed protocols, null results, claim scope and source verification.
- Added one deterministic reducer for selection, visibility, isolation, separation, camera and filters. Canvas picking, catalogue search, related links, shared URLs and optional browser tools converge on the same action.
- Separated geometry creation, picking, gesture discrimination, camera fitting, layout and resource lifecycle. Bounds fitting operates within a canvas that is physically separate from the panels. Camera movement is debounced while gestures are active and committed on gesture completion; fitted views commit before sharing.
- Added versioned allowlisted hash state, range/coordinate validation, browser history, clipboard feedback and link fallback. Prototype-property names cannot masquerade as capability IDs.
- Built responsive shadcn-style components using semantic HTML and a CVA button primitive, native modal dialogs, visible keyboard focus, reduced-motion handling, WebGL fallback and accessible licence/methodology content.
- Added static root-level Vite configuration and lockfile, engineering tests, screenshot evidence, size measurements, deployment instructions and a ten-person usability protocol.

## Verification results

- Fresh `npm ci`, `npm run check`, `npm run test`, `npm run build`, `npm run size`: successful.
- **33 unit/component tests passed.**
- **18 production browser tests passed.** Development: **17 passed, 1 production-only budget test intentionally skipped.**
- Chromium 153.0.8010.12 through Playwright 1.63.0; desktop 1440×900, mobile 390×844, small mobile 320×568 and landscape 844×390. Actual canvas picking, touch/pinch emulation, keyboard, 200% text enlargement, reduced motion, WebGL failure/context loss, sharing and lifecycle were exercised. No physical-device testing is claimed.
- All four viewport axe scans and an expanded-profile scan returned zero violations. This does not replace manual screen-reader or conformance testing.
- Final JS/CSS: **238,240 gzip bytes** using the measurement script. Entire uncompressed dist: **893,604 bytes**. Cold browser transfer: **239,920 bytes**. Both 1 MB gzip and 2 MB transfer targets passed. Detailed measured values are in `build-size.json` and `preview-transfer.json`.
- `npm audit`: zero reported vulnerabilities. The initial Vite advisory was resolved; reference dependencies were left untouched.

See [VERIFICATION.md](VERIFICATION.md) for actual commands, intermediate failures and repairs, complete test coverage and methodological limits.

## Licensing and evidence limits

Original project geometry and code are MIT. Human Atlas commit `1c38bf35c254a891200d3cedecfd57abebe83d8d` was inspected and run; only its PointerTap helper is reused, with the full ashemag MIT notice preserved. Dependency notices accompany the static output. No anatomy assets or upstream history are distributed.

Three narrow paper-reported observations are supported by reviewed abstracts. No benchmark replication, present-model capability measurement, ASI score or human testing is claimed. Other cards omit unsupported empirical statements and visibly mark the synthesis gap. Memory and Control and Governance remain explicitly provisional navigation groupings.

**Deferred:** Network and Evolution implementations, broader evidence synthesis, empirical evaluations and further high-detail asset work. The original body was substantially redesigned in this pass; no additional view implementation or backend was added.

**Implemented but not verified on physical hardware:** phone touch performance, Safari/Firefox, manual screen readers, battery and GPU-memory behaviour. No fps or battery numbers are invented.

**Human usability pilot: not run.** The complete ten-person protocol and blank anonymous recording tables are in [USABILITY_TEST.md](USABILITY_TEST.md).

**Deployment blocked: no destination hosting project/account or publication authorisation established.** The tested `dist` build and exact Vite runbook are delivered. GitHub code publication and running-site publication are separate steps. No plan upgrade, asset purchase, domain purchase or live website deployment was performed.

## Actual implemented file tree

The application is at the repository root, which already existed. The ignored `.inspection/` checkout, `node_modules/`, test traces, reports and generated `dist/` are intentionally excluded from source publication. The static output is present locally and reproducible with `npm run build`.

```text
repository-root/
├── docs/
│   ├── screenshots/
│   │   ├── body-1440x900.png
│   │   ├── body-320x568.png
│   │   ├── body-390x844.png
│   │   ├── body-844x390.png
│   │   ├── capability-profile.png
│   │   ├── future-forms.png
│   │   ├── phenotype-mobile.png
│   │   ├── phenotype-overview.png
│   │   ├── production-body.png
│   │   └── production-metacognition.png
│   ├── CONTENT_GUIDE.md
│   ├── DEPLOYMENT.md
│   ├── HANDOFF.md
│   ├── HUMAN_ATLAS_LICENSE.txt
│   ├── ORIGINAL_README.md
│   ├── REFERENCE_INSPECTION.md
│   ├── USABILITY_TEST.md
│   ├── VERIFICATION.md
│   ├── build-size.json
│   └── preview-transfer.json
├── public/
│   ├── favicon.svg
│   └── third-party-notices.txt
├── scripts/
│   ├── measure-build.mjs
│   └── measure-preview.mjs
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── Button.tsx
│   │   ├── CapabilityCatalogue.tsx
│   │   ├── CapabilityInspector.tsx
│   │   ├── EvidenceBadge.tsx
│   │   ├── Methodology.tsx
│   │   ├── Modal.tsx
│   │   ├── PhenotypeProfile.tsx
│   │   ├── RoadmapView.tsx
│   │   └── SceneToolbar.tsx
│   ├── content/
│   │   └── methodology.ts
│   ├── data/
│   │   ├── capabilities.ts
│   │   ├── domains.ts
│   │   ├── profile.ts
│   │   ├── schema.ts
│   │   ├── sources.ts
│   │   ├── validateCatalogue.ts
│   │   └── visualMappings.ts
│   ├── scene/
│   │   ├── RobotScene.tsx
│   │   ├── camera.ts
│   │   ├── createRobot.ts
│   │   ├── explosionLayout.ts
│   │   ├── partRegistry.ts
│   │   ├── picking.ts
│   │   └── pointerTap.ts
│   ├── state/
│   │   ├── agentTools.ts
│   │   ├── explorerReducer.ts
│   │   ├── selectors.ts
│   │   ├── shareState.ts
│   │   └── useExplorer.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── components/
│   │   └── explorer.test.tsx
│   ├── e2e/
│   │   ├── explorer.spec.ts
│   │   └── lifecycle.spec.ts
│   ├── unit/
│   │   ├── agentTools.test.ts
│   │   ├── data.test.ts
│   │   ├── scene.test.ts
│   │   └── state.test.ts
│   └── setup.ts
├── .gitignore
├── .nvmrc
├── .prettierignore
├── .prettierrc.json
├── ASSET_LICENSES.md
├── LICENSE
├── README.md
├── THIRD_PARTY_NOTICES.md
├── index.html
├── package-lock.json
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vercel.json
├── vite.config.ts
└── vitest.config.ts
```
