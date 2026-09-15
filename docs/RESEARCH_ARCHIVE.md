# Research archive — 15 September 2026

Extends the existing React 19 / TypeScript / Vite 8 site and Sites deployment at
`https://superintel.site`. The map, robot exhibit, legacy share URLs and five
existing navigation destinations remain available. Research is the sixth destination.

## Sources and integrity

All 15 files under `~/Desktop/SUPERINTEL` were read completely. The folder contains
research, not another website checkout. Seven papers, five supporting Markdown
documents and the 68-row CSV were initially copied byte for byte into `content/research/documents`.
P1–P7 and the original CSV remain unchanged. The programme, novelty audit and release
plan now have dated v0.2 extensions; their byte-identical v0.1 copies are preserved
in `content/research/versions/2026-09-14`. P8 is a new v0.1 manuscript. Its four
O→F Atlas records are in `ATLAS_EXTENSIONS.json`, separate from the original CSV.
The builder merges them into 72 static records and a current CSV download without
changing any original field. The manifest records both editions and their hashes.
Two conversation exports are published as explicitly marked research extracts.
The manifest records original/published SHA-256 hashes and inclusive original line
ranges. All Desktop originals remain unchanged.

`scripts/research/import-desktop.py` is an explicit source-import operation. It is
not run during deployment. Review all newly supplied files and historical selection
boundaries before refreshing source content. Routine builds use committed content.

The historical extracts preserve strong conjectures, corrections, user/assistant
speaker labels and third-party quotations. Unrelated financial-account material,
trades and three account screenshots are excluded. Two research images are retained.

## Static publication architecture

`scripts/research/catalogue.mjs` maps filenames to stable routes. The builder reads
Markdown rather than duplicating manuscripts in components. `render.mjs` uses
Markdown-it, KaTeX with accessible MathML, heading anchors and footnotes. Display
math can interrupt paragraphs, preventing standalone equals signs from becoming
Markdown heading underlines. HTML input is escaped; KaTeX trust is disabled.

`npm run build` performs typechecking, renders all research HTML into `public/research`,
then builds the existing Vite app into `dist`. Generated files are ignored by Git;
sources, renderer, templates and shared navigation are committed. Vite development
and preview middleware resolve clean research paths to their static index files.

All 72 Atlas records are present without JavaScript. The small enhancement script
adds text search, ID/corpus/provenance/status/destination filters, reset, shareable query
parameters, and thesis fragment links. Assumptions, falsifiers, prior art and version
are in each record's native disclosure. Primary and secondary mappings come from the original CSV and separate extension JSON.

Each page includes author attribution near its title and at the end, canonical and
social metadata, and CreativeWork or ScholarlyArticle JSON-LD. Paper pages add
`citation_title`, `citation_author`, and the actual first HTML publication date.
Original manuscript dates remain distinct. No new PDF, DOI, journal, acceptance,
peer-review claim or executable research repository is fabricated.

## Routes

- `/research`
- `/research/papers`
- `/research/papers/capability-iteration-outruns-assurance`
- `/research/papers/hazardous-inference-frontier`
- `/research/papers/recursive-epistemic-dependence`
- `/research/papers/control-frontier`
- `/research/papers/closing-the-loop`
- `/research/papers/correlated-lineage-resilience`
- `/research/papers/updating-hazard-model`
- `/research/papers/embodiment-threshold`
- `/research/atlas`
- `/research/programme`
- `/research/novelty`
- `/research/release-order`
- `/research/clustering`
- `/research/source-index`
- `/research/sources`
- `/research/history`
- `/research/history/generalization-risks`
- `/research/history/evolution-and-strategy`
- `/research/notes/state-space-framework`

The sitemap, robots file and `llms.txt` include discoverable research routes. Source
downloads, hashes, a route index and rendering report are under `/research/sources/`.
The earlier working-note PDF remains available; no P1–P8 PDFs were supplied or created.

## Deliberately preserved ambiguities

- P2 equation (8), original line 253, has two backspace bytes before `eta_`.
  Display only restores the intended beta subscripts, with a visible repair note.
  The original downloadable file and hash preserve both bytes.
- T14 retains status CONJECTURE even though its title includes “Theorem.”
- T15 remains a historical conjecture and links to P4's conditional treatment and
  counterexamples; its strong source wording is not silently rewritten.
- REPLICATION labels do not assert that a replication experiment was run.
- RN1–RN4 are groups in the CSV; separate manuscripts were not supplied.
- P7's title says “Pre-Registered” but registration remains proposed. The page
  explicitly says so. Draft publication does not claim release criteria were met.
- The source index names absent blueprints, README files, metadata and BibTeX.
  Their labels remain visible as unavailable references, not working downloads.
- Suggested publication/PDF/code URLs and metadata examples remain manuscript
  text, not activated publication metadata or invented resources.
- Historical export timestamps have no timezone. Original manuscript dates are
  14 September; the archive's first HTML publication date is 15 September 2026.
- Embedded references are preserved as supplied. The dated HTTP audit found 48
  reachable URLs, 12 access-denied responses and two account-specific conversation
  URLs. P8 adds eight successfully resolved references; primary records were also
  reviewed for citation details and appropriate use. Reachability alone does not
  certify bibliographic accuracy or historical claims.

## Verification

The archive has nine integrity tests and 25 browser tests. Integrity checks cover
source hashes, full manuscript rendering, all Atlas fields and mappings, every
internal target/anchor/asset, mathematical delimiters, scholarly metadata, and the
sitemap. Browser tests inspect all 21 routes with JavaScript disabled at mobile width,
exercise filtering/reset/reload/deep links, and audit representative templates with
axe on desktop and mobile. KaTeX renders 663 manuscript expressions with no parse errors.

Reproduction:

```sh
npm ci
npm run build
npm run test:research
npm test
npm run test:e2e
```

Prettier is configured; no ESLint/lint script exists. Changed implementation files
are formatted, TypeScript is checked, and JavaScript/Python scripts receive syntax
checks. Canonical manuscript/CSV bytes are intentionally excluded from formatting.

Publishing reuses `.openai/hosting.json` and the existing public Sites destination.
Only the validated static build is packaged. Historical private originals and test
artifacts are not part of the deployment or source commit.

P8 separates MODEL, HYPOTHESIS, PROPOSITION and conditional THEOREM from proposed
experiments. The theorem proof includes fixed digital-pathway, finite-time and
common-threshold assumptions. No P8 empirical result, risk number, DOI or PDF is
claimed. The original P1–P7 hashes and all 68 original CSV fields are regression-tested.
