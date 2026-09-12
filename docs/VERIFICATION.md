# Current verification

See [DUAL_HOST_HANDOFF.md](DUAL_HOST_HANDOFF.md) for the latest dual-host implementation and checks. The earlier release measurements below are historical, not measurements of the new two-host renderer.

---

# Immersive atlas verification — 11 September 2026

This report covers the current immersive refinement. Earlier implementation/refinement results remain in Git history. No screenshot or automated browser run is presented as a human or physical-device test.

## Environment and final commands

macOS arm64, Node 24.18.0, npm 11.16.0; React 19.2.6, TypeScript 5.9.3, Vite 8.3.0 and direct Three.js 0.183.2. Existing locked dependencies were retained. Playwright runs Chromium 153.0.8010.12 with one worker and no retries.

| Command                            | Current result                                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run check`                    | Passed; application, tests and configuration typecheck.                                      |
| `npm test`                         | 43 unit/component tests passed in 6 files.                                                   |
| `npm run build`                    | Passed; static `dist` generated.                                                             |
| `npm run test:e2e`                 | 22 production tests passed, approximately 1.4 minutes.                                       |
| `E2E_DEV=1 npm run test:e2e`       | 21 passed, 1 production-only transfer test intentionally skipped; approximately 1.9 minutes. |
| `npm run size`                     | Passed existing ≤1 MB gzip and ≤2 MB transfer budgets.                                       |
| `node scripts/measure-preview.mjs` | Cold-context local transfer and event-driven rendering measurements recorded.                |
| `git diff --check`                 | Passed.                                                                                      |

Development and production servers run on strict loopback ports 3016 and 4173. The production suite uses the actual `dist` preview, not the dev server. Fresh installation and dependency audit were performed in the previous release; this pass changed no dependency manifests and does not claim a new audit.

## Coverage

**Unit/component checks:** stable twelve-domain schema; five connected subtopics each; 250–450 main-dossier word guard; null results and scoped evidence; provisional groupings; selection/layers/isolation; current and legacy URL validation; hierarchy Back; unrelated topic/profile rejection; conditional migration/copy states; bounded zoom; projected callout spacing and clipping; geometry/gesture handling; semantic catalogue and inspector; optional tool integration.

**Browser checks:** real assembled Metacognition hit; every separated body group independently raycastable; real Three.js discovery orb hit separately from HTML cloud click; all three local illustrations; changing mechanical highlights; migration source pause/destination resume; diverging copies; unavailable body/resources; shared demo conditions and restored subtopic; old v1 capability links; current camera/layer/filter shares; browser history; hierarchy Back/focus; tab/scroll reset; search through hidden layers; null measurement message; clipboard fallback; keyboard and 200% type; pinch/tap discrimination; orientation changes; successful local production requests; WebGL unavailable/context loss; repeated scene unmounts and cleanup.

**Accessibility:** WCAG 2 A/AA and 2.1 AA axe checks at 1440×900, 390×844, 320×568 and 844×390, plus the profile inspector. All five scans returned zero violations after the repairs below. Reduced motion was emulated; no automatic animation is used. This is limited automated evidence, not a complete conformance or screen-reader audit.

## Visual checkpoints

1. Captured the prior desktop, mobile and landscape presentation in `screenshots/before-immersive/` before edits.
2. Implemented title/date, body-bounds framing and coral/pearl robot treatment; inspected `/tmp/asi-checkpoint2.png` before moving to spatial navigation.
3. Replaced the main scrolling sections with five orbs and anchored labels. Inspected the real desktop scene and open panel; verified one inspector and no default overview/specification/future-form grids. The landing test asserts no desktop document scroll beyond rounding tolerance.
4. Expanded all dossiers and connected profile information to scene navigation. Main content is 3,444 words, plus 2,431 subtopic words. Counting excludes evidence/measurement tabs, navigation repetition and profile content; the previous overview/subtopics contained 1,893 words.
5. Interacted with strength, precision and execution arrangements in the real production preview, and inspected the host/path and mobile screenshots.
6. Captured and inspected final before/after sizes, an open inspector, expanded/restored subtopic and illustration states. Final files are in `screenshots/after-immersive/`; the running geometry remains interactive.

The body occupies approximately four-fifths of the unobstructed canvas in the default screenshot. The conservative projected axis-aligned body bounding box measures 83.3% of canvas height; this includes empty box corners and differs from visible silhouette height. The floor, nodes, labels and execution hosts are excluded from the default body fit. Opening the inspector changes the canvas dimensions and refits the body.

## Size and rendering

| Measurement                                           |                                  Actual result |
| ----------------------------------------------------- | ---------------------------------------------: |
| Initial JavaScript + CSS, gzip via checked-in script  |                                  260,522 bytes |
| Entire dist, uncompressed, including optional notices |                                  967,370 bytes |
| Cold initial transfer including navigation            |                                  262,206 bytes |
| Default rendered triangles                            |                                         56,698 |
| Renderer-tracked default geometries                   |                                            129 |
| Additional renders during 500 ms settled idle         | 0 at each of desktop and mobile viewport sizes |

Exact results: [build-size.json](build-size.json), [preview-transfer.json](preview-transfer.json), [content-depth.json](content-depth.json). Vite retains its warning for a raw JS chunk over 800 kB; measured gzip and transfer budgets pass. No external visual/model assets, fonts, analytics or model APIs are requested. Renderer geometry counts are not GPU memory in bytes. No phone FPS, heat, battery or throttled-network claim is made.

## Failures found and repaired in this pass

- Before the spatial stylesheet was finished, a zero-height inner canvas host produced an extreme camera fit. The flex canvas host now has explicit layout; screenshots and selection checks verify framing.
- The old unit assertion deliberately rejected v2; it was updated to reject an unknown v99 after v2 became the supported format. A broad example-text locator was made exact after adding a second worked scenario. Tests then passed.
- The first full production run passed 18 tests and failed four accessibility checks: three compact viewport scans found the List view button unnamed because its text was hidden; the profile scan found a low-contrast inherited scenario label. An explicit accessible name and corrected text colour repaired these. The focused five-scan rerun passed, followed by the complete 22-test production run.
- Author-level `display:flex` could override native hidden cloud buttons during separation/illustrations. Explicit hidden styling and navigation visibility now remove those buttons and leader lines from the interactive layout.
- Toolbar zoom could produce a camera beyond the URL parser's old coordinate range. A bounded reducer zoom action and compatible parse range now preserve the view; a unit regression covers it.
- Callouts now reserve a centre lane, rebalance crowded sides after orbit, and move to a compact strip for narrow/short layouts or enlarged type. Cloud raycasts respect intervening body geometry.

A final production smoke verified the updated browser title, Cobalt material selection, toolbar zoom and reset, then refreshed the desktop/mobile/landscape/small screenshots and captured the migration pause. No page errors were reported by the cold-preview measurement.

The final screenshot review also caught a material-state defect: the unavailable-body text changed while the robot remained opaque. Marking transparency changes for shader refresh, disabling depth writes/shadows for the dimmed body, and adding a visible body-status label repaired the scene. The execution and lifecycle production tests were rerun (2 passed); the corrected unavailable-body screenshot was visually inspected and the build/transfer figures above were refreshed.

## Scientific and release limits

The [focused source pass](SOURCE_REVIEW.md) checked primary abstracts and recorded version dates/scope. It did not reproduce experiments or add robot performance records. Every project measurement is still null. Educational scenes do not perform external execution, migration or copying, and do not establish subjective identity.

Network/Evolution remain planned, public hosting remains unperformed, and the participant pilot remains unrun. No paid assets, services or plan changes were used. Physical devices, other browser engines and manual screen readers remain to be tested.
