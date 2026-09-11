# ASI Atlas — immersive release handoff

Implemented in the existing `codex/asi-atlas` checkout of `MoheetBrain/Superintelligence-Phenotype`. The app is a scene-first portrait of artificial superintelligence, with the original twelve capability IDs, part mappings and evidence model preserved.

Local development: **http://127.0.0.1:3016**. Production preview: **http://127.0.0.1:4173** while the existing preview process runs. These are local URLs; the running website has not been publicly deployed.

## What changed

- **Identity:** Artificial Superintelligence is the primary heading, ASI Atlas the secondary identity. The prominent 2030–2035 badge opens the exact qualified creator-scenario explanation; it promises no date for this robot or any capability. Text and provenance are editable in `src/content/arrival.ts`.
- **Main journey:** the permanent overview, snapshot, index, beige specification grid and future-forms cards were replaced by five spatial discovery groups and one inspector. Search/List view supplies the complete HTML alternative. Camera/layer settings and planned views sit under Controls. The default desktop page fits the viewport without scrolling to a content grid.
- **Original robot:** coral enamel, pearl panels, graphite joints and cyan sensors; broader shoulders, stronger limb proportions, a coherent waist, articulated fingers, fitted crown and relaxed stance. Real physical materials, controlled reflections and shadows. Body-only bounds drive framing; the floor and orbs do not shrink the robot. Coral, Cobalt and Pearl finishes are available.
- **Spatial navigation:** real raycastable orbs with camera-projected HTML labels, hover/focus previews, collision spacing, viewport clamping, behind-camera clipping and a selected-context leader line. Narrow/short layouts and enlarged type use a stable label strip. Canvas drag and pinch do not count as clicks. No automatic drift or orbit.
- **Depth:** twelve main dossiers of **270–306 words**; **60 connected subtopics**. Overview and subtopic text totals **5,875 words**, approximately **3,982 net words added** relative to the previous inspector. Evidence, measurement proposals and fourteen qualitative physical/cognitive/distributed profiles are additional. Each dossier provides mechanisms, requirements, limits, a worked scenario and open question.
- **Physical profiles:** strength, running, jumping, dexterity, precision, reaction and endurance have selectable nodes and relevant robot highlights. Text distinguishes mass/force/torque, accuracy/repeatability, inference/full-loop latency and peak/sustained output. No physical performance numbers were invented.
- **Local illustrations:** selectable strength contexts; five precision feedback stages; and spatial hosts/paths for remote control, migration and copying. Migration pauses the source before destination resumption. Copies retain two running instances and diverge. Removing required resources prevents execution; losing the body does not invent continuity. These are educational diagrams, not validated simulations.
- **State and navigation:** one reducer connects geometry, cloud buttons, catalogue results, related links, subtopics and illustrations. Back/Escape follows the hierarchy and restores focus. New capability selection resets Overview and scroll. Version 2 share URLs retain extended exploration state and migrate version 1 links. Toolbar zoom now stays within the range that sharing can restore.

## Verification

- `npm run check`, `npm test`, `npm run build`, `npm run size`, and `git diff --check` passed.
- **43 unit/component tests passed.**
- Development Strict Mode: **21 tests passed, 1 production-only transfer test skipped**. Final production title, finish and zoom smoke also passed.
- **22 production browser tests passed**, without retries, including all twelve separated part picks, a real 3D cloud pick, HTML cloud selection, the illustrations, legacy/current shares, navigation, mobile, fallback and lifecycle.
- Four viewport axe scans and the profile-inspector scan returned **zero violations** after fixing a compact button name and a profile-label contrast issue.
- Desktop **1440×900**, mobile **390×844**, small mobile **320×568** and landscape **844×390** were exercised with Chromium emulation. Actual before/after images, an inspector, subtopic/restored link and illustrations were captured and inspected.
- **260,522 bytes** gzipped initial JS/CSS; **262,206 bytes** cold initial browser transfer including navigation. Both existing budgets pass. No added packages or downloaded visual assets.
- Default scene: **56,698 rendered triangles**, **129 renderer-tracked geometries**, and **zero additional renders** during each 500 ms idle observation at desktop and mobile dimensions. This is not an FPS, battery or physical-device performance measurement.

See [VERIFICATION.md](VERIFICATION.md), [content-depth.json](content-depth.json), [preview-transfer.json](preview-transfer.json), and [SOURCE_REVIEW.md](SOURCE_REVIEW.md) for scope and exact measurements.

## Review the result

- [Desktop after](screenshots/after-immersive/1440x900.png) and [desktop before](screenshots/before-immersive/1440x900.png).
- [Mobile after](screenshots/after-immersive/390x844.png) and [mobile before](screenshots/before-immersive/390x844.png).
- [Landscape after](screenshots/after-immersive/844x390.png) and [landscape before](screenshots/before-immersive/844x390.png).
- [Restored subtopic](screenshots/after-immersive/restored-subtopic.png), [precision](screenshots/after-immersive/precision.png), and [copying](screenshots/after-immersive/copying.png).

## Remaining limits and boundaries

Network and Evolution are still explicitly planned views. Broader literature synthesis and empirical ASI/robot measurements are not implemented. Only the three existing narrow paper observations have a focused primary-abstract review; other empirical gaps remain visible.

Physical devices, Safari/Firefox, manual screen readers and human usability participants have not been tested. No subjective continuity, general ASI performance, battery or FPS result is inferred from the model. The ten-person [usability protocol](USABILITY_TEST.md) remains unrun.

No running-site deployment, main-branch merge, asset purchase, hosting upgrade or external replication/control was performed. The local static build and existing draft PR are the reviewable deliverables; hosting needs an authorised destination.

## Implemented source tree

```text
src/
  App.tsx
  main.tsx
  components/
    CapabilityCatalogue.tsx
    CapabilityInspector.tsx
    CloudNavigation.tsx
    EvidenceBadge.tsx
    IllustrationPanel.tsx
    Methodology.tsx
    Modal.tsx
    RoadmapView.tsx
    SceneToolbar.tsx
    ui/
      Button.tsx
  content/
    arrival.ts
    methodology.ts
  data/
    capabilities.ts
    discovery.ts
    domains.ts
    dossiers.ts
    illustrations.ts
    profile.ts
    schema.ts
    sources.ts
    validateCatalogue.ts
    visualMappings.ts
  scene/
    RobotScene.tsx
    camera.ts
    createDiscovery.ts
    createExecution.ts
    createRobot.ts
    discoveryLayout.ts
    explosionLayout.ts
    partRegistry.ts
    picking.ts
    pointerTap.ts
  state/
    agentTools.ts
    explorerReducer.ts
    selectors.ts
    shareState.ts
    useExplorer.ts
  styles/
    globals.css
tests/
  setup.ts
  components/
    explorer.test.tsx
  e2e/
    explorer.spec.ts
    lifecycle.spec.ts
  unit/
    agentTools.test.ts
    data.test.ts
    discovery.test.ts
    scene.test.ts
    state.test.ts
scripts/
  measure-build.mjs
  measure-preview.mjs
package.json, package-lock.json, index.html
vite.config.ts, vitest.config.ts, playwright.config.ts, tsconfig.json
vercel.json, LICENSE, THIRD_PARTY_NOTICES.md, ASSET_LICENSES.md
docs/ — handoff, verification, source review, content guide, measurements, screenshots
```
