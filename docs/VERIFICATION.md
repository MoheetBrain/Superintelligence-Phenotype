# Engineering verification — 2026-09-11

This report separates a reproducible engineering release from research validation, human usability and website publication. Tests were actually executed locally; no physical-device or participant results are claimed.

## Environment

- macOS arm64; Node **24.18.0**, npm **11.16.0**.
- React / React DOM **19.2.6**, TypeScript **5.9.3**, Vite **8.3.0**, direct Three.js **0.183.2**.
- Vitest **4.1.11**, Playwright **1.63.0**, Chromium **153.0.8010.12**, axe-core Playwright **4.13.0**.
- Target branch: `codex/asi-atlas`, based on the existing target repository's `main` commit `a15780a4b2708810871a7dd9f5d2e9bb78e24aa5`.
- No research documents besides the original README were present. That README is preserved separately.

## Commands and outcomes

| Command | Actual result |
| --- | --- |
| `npm install` | Exit 0; created the package lockfile. Initially reported one Vite advisory. |
| `npm install -D vite@8.3.0` | Exit 0; upgraded the affected build tool to a patched release. |
| `npm ci` | Exit 0; fresh installation from the committed lockfile succeeded. |
| `npm run dev` | Started successfully at `http://127.0.0.1:3016`, strict port and loopback binding. HTTP check returned 200. |
| `npm run check` | Exit 0; strict TypeScript check includes application, tests and configuration. |
| `npm run test` / `npm test` | Exit 0; **33 tests passed in 5 files**. |
| `npm run build` | Exit 0; independently usable static `dist` output. |
| `npm run preview` | Started successfully at `http://127.0.0.1:4173`; production browser tests use this server. |
| `npx playwright install chromium` | Exit 0; installed the test browser. |
| `npm run test:e2e` | Exit 0; **18 production tests passed**, final refinement run 56.1 seconds. No retries. |
| `E2E_DEV=1 npm run test:e2e` | Exit 0; **17 passed, 1 intentionally skipped** (production transfer-budget test), including Strict Mode lifecycle and focus checks. Refinement run approximately 1.3 minutes. |
| `npm run size` | Exit 0; both provisional size targets met. Machine-readable output in `build-size.json`. |
| `node scripts/measure-preview.mjs` | Cold-context browser transfer measurement saved to `preview-transfer.json`. |
| `npm audit` / `npm audit --omit=dev` | Exit 0; **0 reported vulnerabilities** after updating Vite. |
| `git diff --check` | Exit 0; no whitespace errors. |

## What was exercised

**Data/state:** all twelve records validate; original part mappings resolve; three or more subtraits per card; null measurements; provisional groupings; selection under hidden layers; clearing; isolation and previous camera restoration; layer changes; reset; malformed URLs; prototype-name rejection; evidence/query combination; shared filters, camera and previous camera.

**Components:** keyboard catalogue selection, all twelve HTML entry points, empty results, layer toggles, related selection, future-hypothesis badge, scoped Observed evidence and the exact missing-result message.

**Real browser interactions:**

- Canvas raycasting selects Metacognition in the assembled robot.
- Every one of the twelve groups is selected by a real canvas click in the separated layout. Tests derive screen points from the shared camera and authored geometry, then dispatch actual pointer input; they do not invoke application selection directly.
- The inspector opens its substantive card; evidence and proposed measurements are reachable; isolate/exit/reset complete the loop.
- Dragging or a two-pointer pinch does not select a component. A subsequent actual touch tap does select Metacognition after restoring its visible framing. Touch input uses Chromium's protocol emulation, not physical hardware.
- Search discovers hidden layers, selection re-enables them, related links use the same state transition, and hiding a selected domain clears its inspector.
- A shared separated view restores selection, separation and camera in a separate browser context. Back/Forward restore distinct selections. Malformed links recover safely.
- Clipboard rejection leaves a selectable URL. Escape closes the modal and returns keyboard focus to Share, including under development Strict Mode.
- Forced WebGL startup failure and context loss leave a functioning HTML catalogue.
- Repeated Body → Network → Body navigation maintains one canvas. Instrumentation checks zero pending animation frames while idle, one active resize observer while mounted, zero after unmount, and zero remaining listeners on detached canvases. Geometry/material/environment disposal is also explicit in renderer cleanup; GPU memory profiling is not claimed.
- Optional WebMCP search and inspection tools were called in the Codex in-app browser. `resource layers` returned Ecology; Substrate Mobility opened the corresponding visible card; invalid `constructor` ID failed with “Unknown capability” without changing the selection. Unit tests also check cleanup and input validation.

## Browser and viewport coverage

| Viewport | Result |
| --- | --- |
| Desktop 1440 × 900 | Catalogue, scene controls, selection, isolation, screenshot and axe checks passed. |
| Mobile 390 × 844 | Same checks passed; no horizontal overflow. Stacked content avoids panel/canvas occlusion. |
| Small mobile 320 × 568 | Same checks passed; content and controls are scrollable without horizontal overflow. |
| Landscape 844 × 390 | Same checks passed; vertically scrolling two-column layout. |

Orientation change from 390 × 844 to 844 × 390 retains a separated selection and refits its geometry. Keyboard selection/close focus restoration and 200% root text enlargement were tested. Reduced-motion media was emulated in all four viewport checks; the application has no automatic rotation or nonessential animation.

All four viewport axe scans and the expanded profile-card scan returned **zero violations** for the configured WCAG 2 A/AA and 2.1 AA rules. This is limited automated evidence, not a complete accessibility conformance audit. Screen-reader use on physical devices has not been tested.

Screenshots in `docs/screenshots/` are captures of the real app. The four viewport screenshots were also visually inspected. The production Body and Metacognition captures are separate from device emulation images. No screenshot is presented as a physical-device test.

## Size and network budget

Provisional targets from the brief were adopted before visual polishing: **≤1,000,000 bytes gzipped initial JS/CSS** and **≤2,000,000 bytes total initial transfer**.

Final local gzip measurement (`node:zlib` default compression):

| Asset / total | Uncompressed bytes | Gzip bytes |
| --- | ---: | ---: |
| JavaScript | 847,661 | 232,261 |
| CSS | 23,866 | 5,977 |
| HTML | 780 | 465 |
| Original SVG favicon | 209 | 178 |
| Optional third-party notices | 21,084 | 5,535 |
| **Initial JavaScript + CSS** | **871,527** | **238,238** |
| **Entire dist directory, including optional notices** | **893,600** | — |

Vite emits a non-blocking warning because the raw single JS chunk exceeds its configured 800 kB warning threshold; the project’s measured gzip and transfer budgets both pass. Vite's console uses its own gzip settings and reported 234.23 kB JS and 6.02 kB CSS; the values above consistently use the checked-in measurement script. The whole uncompressed output is a conservative upper bound for asset bodies, not a claim that the browser requests the notices on startup.

The browser resource test observed only successful same-origin requests, no failed network requests and no page errors; its initial-transfer assertion passed below 2 MB. The cold-context browser reported **239,918 transferred bytes**, including navigation and resource timing overhead. The exact transfer and browser version are recorded separately in [preview-transfer.json](preview-transfer.json). No external fonts, model files, images, analytics or model APIs are requested. Latency, battery life and physical-device frame performance remain unmeasured.

## Failures found and repaired

Initial test-source type errors were corrected before tests ran. The first browser suite had one ambiguous test locator for Observed and a real missing accessible name on the mobile Share button. The locator was scoped to the inspector, and Share now has an explicit accessible name. A later development run exposed Strict Mode modal focus loss, fixed by preserving the original trigger across effect replay and closing the dialog during cleanup. A touch-test target was outside the canvas after pinch zoom; restoring framing made the intended follow-up tap test valid. These failures are not counted as passing runs.

## Release boundaries

- **Implemented and verified:** phenotype overview, twelve qualitative specification cards, future forms, working Body explorer, original redesigned procedural geometry, twelve rich dossiers, state transitions, HTML alternative, query/evidence/layers, separation, sharing, static production build and the engineering checks above.
- **Implemented but not verified in this environment:** physical mobile/browser behaviour, Safari/Firefox rendering, manual screen-reader workflows, hosting-specific cache/headers. These are not implied by Chromium emulation.
- **Deferred:** Network and Evolution implementations; broader literature synthesis; further high-detail asset work beyond the redesigned original body; empirical capability measurements.
- **Blocked by external access or authorisation:** public deployment (no destination project/account or publication authorisation established).
- **Human usability pilot: not run.** A ten-participant protocol is delivered; no participants were available during implementation.

The repository root has the requested static Vite hosting settings. Publishing code to GitHub does not publish the running site. Vercel's official Hobby and fair-use pages were checked on 2026-09-11 and retain the personal/non-commercial restriction; a later publisher must recheck suitability and obtain destination authorisation.

## Focused phenotype refinement

The course correction preserves the reducer, stable capability/part IDs, URL format, measurements and source-review model. It replaces the anatomy-first presentation with an ASI overview, a capability snapshot, twelve qualitative specification cards, a phenotype index and three future-form mechanisms. The inspector now explains contribution to the overall profile, possible uses and conditional scaling. No new empirical claims or measured physical capabilities were introduced.

Original geometry was substantially redesigned with smooth lofted housings, beveled fitted panels, a sensor face, crown/temple interface, articulated fingers, tapered limbs and cylindrical bearings. A studio floor and subtle shadow replace the grid. Camera fitting now uses projected bounds corners for more useful framing; the shadow target is explicitly disposed. The twelve IDs and independent picking groups remain intact.

The first refinement browser run passed 14 tests and failed three assertions because the newly added Substrate Mobility spec heading made the original global heading locator ambiguous. Scoping inspector assertions repaired those tests without removing coverage. Raycast target points were updated to the redesigned geometry. The new eighteenth test opens Persistence with the keyboard, checks its limits and evidence qualifier, scans the expanded profile for accessibility, opens its linked dossier, checks the null measurement, restores focus on close, and follows the migration explanation.

The existing 33 unit/component tests still pass. Production and development runs retain all prior interaction coverage. Dedicated screenshots capture the desktop overview, mobile first screen, specification sheet and future forms. The in-app preview was also opened and visually inspected. Public deployment, a participant pilot and empirical ASI measurement remain outside this completed refinement.
