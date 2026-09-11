# Editing ASI Atlas content

The first release contains exactly twelve navigation domains and one substantive card per domain. These are research navigation choices, not measurements or a biological taxonomy.

1. Edit names, aliases and provisional-grouping notes in `src/data/domains.ts`. Keep stable IDs unchanged so saved URLs remain meaningful.
2. Edit definitions, conditional future examples, three or more subtraits, distinctions, proposed evaluations and related concepts in `src/data/capabilities.ts`.
3. Add reviewed source metadata in `src/data/sources.ts`. A verified source means the specified locator was checked; it does not imply independent experiment reproduction or a complete literature review.
4. Edit conceptual anchors and part labels in `src/data/visualMappings.ts`. Geometry constructors depend on shape choices, never on scientific claims. All coordinates are model-local and Y-up. One unit is an arbitrary design unit; the assembled robot is approximately 6.2 units tall. No physical scale is implied.
5. Run `npm run check`, `npm test`, `npm run build` and the relevant browser tests.

## Evidence rules

Use the four exact values: **Observed**, **Extrapolated**, **Theoretically Plausible**, **Speculative**. The top-level badge is always “Future hypothesis: …”. It classifies the stated future example, not every statement on the card or any unspecified present-day system.

An Observed claim must have a reviewed supporting source, an explicit system/task scope, limitations, and a `verified` editorial status. Do not turn an unsupported empirical statement into speculation to keep it on the page; omit it pending evidence. Broad extrapolations must remain visibly conditional.

Only three narrow paper-reported observations are included initially: metacognitive calibration, ReAct's evaluation setup, and Reflexion's episodic text-buffer method. Their source abstracts were reviewed on 2026-09-11. No numerical benchmark claims are reproduced. Other cards contain definitions and proposals; their evidence sections say that an empirical synthesis needs review. NIST is contextual reading on governance, not proof of a capability.

Do not equate self-description with self-monitoring, perspective modelling with consciousness, records with subjective identity, software copying with Darwinian evolution, or remote commands with execution migration. Keep operational control distinct from governance inside their provisional grouping. Memory is also explicitly provisional.

## Measurements

An uncollected value is `null`, displayed as **Not measured for this project.** Do not use zero or fabricated scores. Before publishing a result, populate the system version, task suite, resource context, time, unit, uncertainty, source IDs and an inspectable protocol. Record negative results with the same care as positive ones.

Network and evolution coordinates remain `null` while those views are not implemented. Do not create invented positions merely to populate the schema.

## Validation and future assets

`validateCatalogue` runs at application startup and in tests. It rejects duplicate capability IDs, missing domain coverage, invalid evidence levels, nonfinite anchors, broken relations/source IDs, invalid part mappings and unsupported Observed claims.

Content IDs, URL IDs and renderer part IDs are separate. A future asset can replace the primitive geometry while preserving part mappings. If a part maps to multiple concepts, `conceptsForPart` returns all candidates and the interface opens an explicit chooser.
