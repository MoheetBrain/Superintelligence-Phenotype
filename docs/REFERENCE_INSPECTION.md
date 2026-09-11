# Human Atlas inspection

- Upstream: https://github.com/ashemag/human-atlas
- Commit: `1c38bf35c254a891200d3cedecfd57abebe83d8d`
- Inspection date: 2026-09-11. Runtime: Node 24.18.0, npm 11.16.0, macOS arm64.
- Location: `.inspection/human-atlas/` inside the authorised workspace, excluded from target Git tracking and Vite output.
- The target initially contained only its README, at `a15780a4b2708810871a7dd9f5d2e9bb78e24aa5`. No supplementary research files or AGENTS.md were present.

## Actual run, before target implementation

`git clone --depth 1 https://github.com/ashemag/human-atlas.git .inspection/human-atlas` succeeded.

`npm ci` succeeded in the inspection checkout. It reported 11 dependency advisories (1 low, 2 moderate, 8 high); no upstream packages or source were modified to address them.

`npm run dev -- --host 127.0.0.1 --port 3017 --strictPort` started the original application. The Codex in-app browser loaded the Human Atlas title, controls and full visible anatomy. A screenshot inspection confirmed rendered anatomy after loading completed. This was a reference startup/visual inspection, not an independent validation of all upstream features.

## Responsibilities verified in checked-out code

| File | Finding and adaptation |
| --- | --- |
| `app/anatomy.ts` | Systems, parts, concepts, scene-state contract and descriptions. Replaced entirely with typed capability content and editable visual mappings. |
| `app/page.tsx` | React state, catalogue fetch, search, selection, layers, inspector and camera controls. Reimplemented around one reducer and static local content. |
| `app/scene.tsx` | Direct Three.js, binary chunk loading, batched GPU visibility/selection textures, pickers, bounds fitting, animation and cleanup. Replaced the entire binary loading layer with original named primitive groups. No anatomy renderer copied. |
| `app/explosion-layout.ts` | Bounds-based packing and interpolation. Used the responsibility separation as a reference; implemented a small deterministic conceptual grid suited to twelve groups. |
| `app/pointer-tap.ts` | Tracks pointer movement and blocks every lift in a multipointer sequence. Reused in `src/scene/pointerTap.ts` under MIT. |
| `vite.config.ts` | Active React Vite build, `web/` root and `dist/` output. The `app/` directory does not make this Next.js. |
| `package.json` | Node >=22.13.0, Vite scripts; many installed packages are not used by the active viewer. Only relevant target dependencies were installed. |
| `vercel.json` | Static Vite install/build/output configuration. Target uses the requested root-level Vite configuration. |
| `LICENSE` | MIT, copyright 2026 ashemag. Full notice preserved in `docs/HUMAN_ATLAS_LICENSE.txt` and third-party notices. |

The upstream repository, its Git history and all anatomy files stay outside the target application and production output. The target is based on the user's repository, not a fork of the upstream history.
