# ASI Atlas · precision robot reconstruction

12 September 2026. This report supersedes the earlier reconstruction review. The two supplied screenshots are now part of the reference audit: the standing dark robot determines the proportions; the white robot in a bent kitchen pose informs the satin pearl / black material distribution. Different coverings, pose and perspective in the white image are not treated as a second geometry specification.

The [reference measurements](robot-reference-measurements.json) record manual landmarks, uncertainty and reference provenance. The [discrepancy audit](ROBOT_PRECISION_AUDIT.md) records the region-by-region comparison and the three correction passes. Rear surfaces and concealed drive details remain minimal inferred continuations. No reference photo, branded model, logo or manufacturer marking ships in the application.

## What changed

- **Head and neck:** taller tapered sensor pod, wraparound curved smoked visor, restrained sensor apertures, almost-flush temple hardware and a short flared black neck. The crown plate was inset after the finish review.
- **Torso and shoulders:** chest width reduced from 0.172H to 0.141H, with a flatter front, straighter middle walls and a controlled lower hem. The shoulder drive sits within a dark oval side cavity with a curved rim and a dense rib field. The lower front panel and seams follow the actual shell vertices.
- **Arms and hands:** upper arms and forearms use distinct flat-sided cross-sections, taper and rear inserts. Elbows have a central housing, lateral caps, hinge and mounting collar. Wrists were raised to the measured landmark; hand bodies are larger, palms face inward and graduated three-segment fingers flex gently. The redundant distal forearm insert was removed after close visual review to keep the wrist transition clean.
- **Waist and pelvis:** the bulky waist/bar was replaced with a compact coupling, slender side links, a notched central bridge, separate transverse hip housings and downward thigh pivots.
- **Legs:** cuffed thighs taper toward lateral knee actuators. Shins have a deep rear calf, flatter front, nonlinear taper and open lower front hem around the ankle bearing. Wider ankle links connect to a heel cage, wedge vamp, separate toe cap and bevelled dark sole.
- **Rendering and inspection:** graphite and pearl share exactly the same geometry and rig; only materials differ. Broad studio lighting and four soft contact-shadow patches ground the feet. State markers shrink when idle; transfer controls move away from the torso with projected leaders. The smallest phone layout uses two separate label columns. “Hide annotations” preserves execution and camera state.

## Final normalized dimensions

H = 1 is the intended floor-to-crown standing height; display scale is 6.2 scene units. These are reconstruction design targets, not manufacturer specifications. Seams, coating offsets and small bevels produce sub-percent differences in outer bounds. Full parameters, shell sections and joint landmarks are in [robot-final-parameters.json](robot-final-parameters.json).

| Dimension | Fraction of H |
| --- | ---: |
| head height | 0.130 |
| head width | 0.081 |
| head depth | 0.086 |
| shoulder width | 0.254 |
| torso height | 0.258 |
| torso width | 0.141 |
| torso upper width | 0.135 |
| torso lower width | 0.128 |
| torso depth | 0.102 |
| waist height | 0.037 |
| pelvis width | 0.202 |
| pelvis depth | 0.076 |
| upper arm | 0.153 |
| forearm | 0.134 |
| hand length | 0.114 |
| thigh | 0.179 |
| shin | 0.233 |
| knee width | 0.070 |
| ankle width | 0.037 |
| foot length | 0.112 |
| foot width | 0.051 |

Landmarks: head centre 0.935, shoulder 0.796, elbow 0.644, wrist 0.512, torso bottom 0.591, pelvis centre 0.514, hip pivot 0.475, knee 0.296, ankle 0.063. The primary screenshot gives approximate shoulder/elbow/wrist/knee heights of 0.794/0.644/0.512/0.296H. Manual landmark uncertainty is recorded in the measurement file; depth and rear contour cannot be calibrated from that front photograph.

## Actual PBR settings

All surfaces use MeshPhysicalMaterial. Colour values are sRGB inputs.

| Surface | Graphite colour / metalness / roughness | Pearl colour / metalness / roughness |
| --- | --- | --- |
| Main shell | #454c51 / 0.42 / 0.48 | #dcded7 / 0.12 / 0.52 |
| Lower service panel | #394247 / 0.36 / 0.56 | #c8cdc7 / 0.10 / 0.56 |
| Secondary shell/collar | #687178 / 0.55 / 0.43 | #c6ccc8 / 0.25 / 0.48 |
| Joints | #171b1d / 0.25 / 0.50 | Same |
| Flex/vent cavity/sole | #111415 / 0 / 0.82 | Same |
| Hands | #202629 / 0.18 / 0.50 | Same |
| Visor | #030405 / 0.12 / 0.08 | Same |
| Seams | #131719 / 0.20 / 0.58 | #303638 / 0.20 / 0.58 |

Shell and secondary clearcoat: 0.05, roughness 0.45. Visor clearcoat: 1.0, roughness 0.08. Other surfaces have no clearcoat. Sensors are tiny restrained apertures with emissive intensity 0.18; there are no luminous eyes. Environment intensity is 0.85; hemisphere 0.9, key 2.1, rim 1.4, fill 0.8, ACES exposure 0.85. These settings describe the base materials; selection, availability and transfer cues deliberately change colour/emission.

## Views and interaction review

Three stages were captured and compared: clay silhouette, mechanical assembly and industrial finish. Each stage's five largest remaining issues and resulting edits are recorded in the audit. Final development comparison supports front, left/right three-quarter, left/right side and back, with graphite/pearl/clay modes and normalized guides. It occupies a clean full-screen scene and is excluded from production.

- [Before: dual hosts](screenshots/precision/before-dual.png)
- [Final graphite: front](screenshots/precision/final-graphite-front.png), [three-quarter](screenshots/precision/final-graphite-three-quarter.png), [side](screenshots/precision/final-graphite-side.png), [back](screenshots/precision/final-graphite-back.png)
- [Final pearl: front](screenshots/precision/final-pearl-front.png), [three-quarter](screenshots/precision/final-pearl-three-quarter.png)
- [Upper-body close-up](screenshots/precision/detail-review-upper.png), [hands](screenshots/precision/detail-review-hands.png)
- [Public desktop](screenshots/precision/final-dual-front.png), [phone](screenshots/precision/final-mobile-390x844.png)

Public orbit uses a 55–120° polar range and distance 2–40 scene units, with a larger distance allowance for concept separation. Debug comparison remains unrestricted. Default phone fitting leaves additional room for the transfer callouts; the labels no longer cover the torsos. Capability IDs, reducer, transfer phases, keyboard alternatives, evidence, search and URL semantics remain intact.

## Verification and remaining limits

TypeScript and the production build pass. All 53 unit/component tests pass. The complete 34-test Chromium suite passes after the phone-layout correction; five targeted picking/drag/touch regressions pass after the final drop-target and geometry refinements, and both canvas-picking checks pass again after removing the redundant forearm patch. The suite covers all twelve raycast-selectable parts, share/history, fallback/context loss, transfer phases, cancellation, copy/fork/remote control, keyboard/touch, responsive layouts, accessibility and resource cleanup. No application errors or failed local requests were reported.

Automated tests are functional evidence; they do not establish a manufacturer's geometric accuracy.

Remaining visual approximations: the back, exact shell depth and concealed joints lack calibrated orthographic references; those shapes are inferred. The reference hand has finer phalange and tendon detail than this bounded web mesh. The shoulder recess/drive and ankle linkage reproduce the visible layering, not a mechanically validated engineering assembly. Photographic lighting and camera calibration differ from the app's consistent studio scene. The white reference has different coverings, so the shared pearl host is intentionally the same hard-shell geometry as graphite. Browser review covers local Chromium; physical-device, Safari/Firefox, manual screen-reader and participant tests remain unperformed.

## Measured performance

- **144,628 triangles per body**, shared geometry buffers between hosts; the 150,000 per-body budget is preserved.
- Default desktop scene: **296,322 rendered triangles, 412 draw calls and 217 geometry resources**. Counts vary with view, culling and annotation state. These are the main renderer pass, not an additive accounting of shadow passes.
- Initial JavaScript + CSS: **278,897 bytes gzipped**; all distribution files: **1,028,820 bytes uncompressed**. The existing Vite warning for a raw JavaScript chunk above 800 kB remains; the measured compressed initial payload stays below the project's 1 MB target.
- Body framing: **77.0%** of the desktop canvas and **73.8%** on the 390×844 phone viewport. The settled preview sampler observed **0 additional renders during 500 ms idle** at both sizes. The separate performance sampler saw one late startup render in its earlier window; the lifecycle test confirms there is no continuous idle render loop.
- During scripted desktop orbit, 90 requestAnimationFrame intervals averaged **92.40 ms**, with a **166.80 ms** 95th percentile (~10.8 callbacks/s). This measures headless browser scheduling, **not physical-device FPS or GPU timing**.
- One-process JS heap snapshots: **16,119,664 → 18,175,812 bytes** during that sample; garbage collection timing makes this unsuitable as a retained-memory/leak metric. Lifecycle cleanup is checked separately by the regression test.

Raw records: [performance](precision-performance.json), [build size](build-size.json), [cold preview transfer](preview-transfer.json), [canonical capture metrics](screenshots/precision/capture-metrics.json). Browser: local Chromium 153.0.8010.12; no throttling.
