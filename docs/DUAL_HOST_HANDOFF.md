# Dual-host substrate-mobility exhibit

## Delivered behaviour

Two instances of the same original humanoid platform occupy a light gallery: Host A uses graphite/titanium, Host B pearl/graphite. Adult proportions, a continuous tapered chest, smoked black visor with restrained sensor apertures, bearing shoulders, flexible waist, long forearms and shins, compact feet, and five separately articulated fingers replace the previous colourful concept robot. Geometry buffers are shared between hosts; transforms and materials are independent. There are no copied Figure models, markings, logos or affiliation.

Operational State is a luminous lattice representing task context, working memory, records, plans, runtime references, tool state and permissions. Dragging has pointer capture, a large compatible target, source dimming, a transfer path, target highlighting, rejection outside the target, Escape cancellation and pointer-cancel recovery. A dropped state remains at the destination during the explanatory restoration sequence. Buttons provide equivalent operations.

- Migrate: source execution pauses; destination receives, checks compatibility, restores state and becomes active. Source stays inactive.
- Copy: a separate instance begins while the source remains active.
- Fork: both instances start from shared state, then their memory and plan indicators diverge after 2.5 seconds.
- Remote control: state stays on A; B is an actuator/interface. A dashed commands-and-observations link and explicit text distinguish it from migration.

Each comparison starts from the same illustrative initial record. Receiving/checking/restoring takes approximately 1.95 seconds. Reduced motion uses immediate completion and textual status. No real files, models, credentials, permissions or executing processes move; the demonstration has no backend, remote access, model call or transport implementation.

## Architecture and principal files

- `src/scene/createRobot.ts`: shared procedural platform and independent host materials.
- `src/state/mobility.ts`: pure transfer transitions, operational records, host snapshots, revision guards and announcements.
- `src/scene/createOperationalState.ts`: lattice, drop target and transfer/communication line.
- `src/scene/RobotScene.tsx`: renderer lifecycle, projected host controls, local drag interaction, camera framing and legacy illustration adapter.
- `src/components/MobilityControls.tsx`: host presets, part inspection, action buttons, remote comparison, status ledger and lineage UI.
- `src/content/mobility.ts`, `src/components/SubstrateMobility.tsx`: definitions, requirements, failure cases, distinct execution arrangements, identity question and qualified implications.
- `src/state/explorerReducer.ts`, `shareState.ts`, `useExplorer.ts`: existing navigation extended with host view and version-3 simulation state; version-1/2 capability links retained. Partial shared transfers reopen in the ready phase.
- `src/App.tsx`, `src/content/arrival.ts`, `src/styles/globals.css`: integration, charcoal creator-belief banner and university attribution, responsive gallery and mobile bottom sheet.

Conceptual state does not depend on Three.js mesh identity. An obsolete timer cannot complete a reset/changed simulation. Geometry, materials, textures, observers, controls, listeners and animation frames are disposed on scene unmount. Rendering stops while idle; only the bounded explanatory transition animates.

## Accessibility and existing functionality

Migrate, Copy, Fork, remote control and reset work with native keyboard controls and without WebGL. Live announcements report host transitions, cancellation and restoration. Colour is supplemented by ACTIVE / AVAILABLE / INACTIVE / RECEIVING labels and state text. The state object has an inspectable explanation. Native dialogs preserve focus; mobile dossiers appear as scrollable bottom sheets. Scene gestures capture their pointers; ordinary scrolling outside the canvas remains available.

All twelve capability meshes remain raycast-selectable, including conceptual separation. Search, evidence filtering, layers, related links, old execution/strength/precision illustrations, isolation, zoom, orbit, Back/Forward, clipboard fallback and focus restoration are retained. Host A/B can be isolated, and head, torso and hands can be inspected directly. Body materials are fixed per host; the former finish preference now chooses the restrained sensor accent, retaining its URL field.

## Verification

Baseline before edits: 43 unit/component tests and 22 production browser tests passed; the before screenshot is in `screenshots/before-dual-host/`.

Verified on 12 September 2026:

- TypeScript passes; 50 unit/component tests pass.
- All 32 production Chromium browser tests pass, with no skipped tests. These cover the original capability journeys, all twelve separated mesh picks, old and new URLs, history, clipboard fallback, keyboard and enlarged text, context loss, resource cleanup, timed restoration and fork divergence, pointer rejection/cancellation, touch dragging, non-WebGL actions, and four responsive layouts with axe accessibility checks.
- The comparison/reset test observes zero network requests while exercising the local state machine after initial assets load.
- A cancellation test was corrected to wait for the projected handle to settle before measuring coordinates for synthetic pointer events. Three repeated runs and the production run pass.
- The production build passes. The final static build is approximately 979 kB uncompressed, with approximately 263 kB gzipped initial JS/CSS (see `build-size.json`). Vite reports its large-chunk advisory for bundled Three.js; the project transfer budgets pass.
- After aligning the settings swatches with their cyan/blue/white labels, the production asset check and all four viewport checks passed again (5/5).

The desktop, 390×844, 320×568 and 844×390 screenshots in `screenshots/dual-host/` were reviewed. They include the initial gallery, migration result, mobile dossier, and hand inspection. Visual review caught and corrected mobile footer/navigation overlap and host-only state-object leakage. Historical screenshots are retained separately.

New behavioural coverage is in `tests/unit/mobility.test.ts` and `tests/e2e/mobility.spec.ts`; the existing `tests/e2e/explorer.spec.ts` uses the redesigned geometry's real pick positions and updated banner/share expectations. README, asset licensing, content guidance, source review, publishing and verification documents describe this implementation.

## Limits

The bodies and their materials remain procedural, stylised product-design illustrations, not engineering CAD or a photoreal scan. Floor/environment reflections are approximate; no ray-traced reflections, cloth or physical hand mechanics are simulated. Finger articulation is modelled in a relaxed pose, without grasp planning. Mobile testing uses Chromium emulation, not physical devices. Safari/Firefox, manual screen-reader, participant usability and empirical ASI migration tests have not been performed. The demo does not establish consciousness, identity persistence, universal compatibility, indefinite survival or impossible regulation.
