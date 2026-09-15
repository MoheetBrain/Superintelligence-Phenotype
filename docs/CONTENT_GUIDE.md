# Editing ASI Atlas content

The first release contains exactly twelve navigation domains and one substantive card per domain. These are research navigation choices, not measurements or a biological taxonomy.

1. Edit names, aliases and provisional-grouping notes in `src/data/domains.ts`. Keep stable IDs unchanged so saved URLs remain meaningful.
2. Edit definitions, conditional future examples, three or more subtraits, distinctions, proposed evaluations and related concepts in `src/data/capabilities.ts`.
3. Add reviewed source metadata in `src/data/sources.ts`. A verified source means the specified locator was checked; it does not imply independent experiment reproduction or a complete literature review.
4. Edit conceptual anchors and part labels in `src/data/visualMappings.ts`. Geometry constructors depend on shape choices, never on scientific claims. All coordinates are model-local and Y-up. One unit is an arbitrary design unit; the assembled robot is approximately 6.2 units tall. No physical scale is implied.
5. Edit the separate qualitative specification layer and per-domain dossier context in `src/data/profile.ts`. Keep its scenario framing distinct from the research evidence model. Profile-to-domain links must resolve to existing domain IDs; do not create extra navigation domains for physical stats.
6. Run `npm run check`, `npm test`, `npm run build` and the relevant browser tests.

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

## Profile scenarios

The specification sheet is intentionally qualitative. Each entry has a meaning, possible use, boundary and scaling condition. Do not invent lift capacity, running speed, reaction time, scores, dates or ceilings. The four framing labels describe scenario type rather than probability or a promised arrival date. None of the current profile entries is labelled **Observed today**. Any future use of that label must attach a specific system/task result, a reviewed primary source and clear limitations. A source in a linked phenotype dossier supports only its stated claim; it does not validate the profile scenario.

Remote control leaves computation on its host. Migration transfers execution and relevant state to another compatible host. Replication produces separate instances that may diverge. Persistence depends on surviving computation or recoverable state, resources and access; do not imply guaranteed personal continuity or immortality.

## Immersive atlas editing

The specification content is now accessed through the five groups in `src/data/discovery.ts` and the optional List view. The old scrolling specification grid, overview and future-form cards have been removed. `profile.ts` retains their useful information and adds Jumping and Endurance, for fourteen qualitative profiles.

`src/data/dossiers.ts` supplies each main dossier's mechanism, prerequisites, limits, worked scenario and open question, plus five subtopic explanations and related-domain links. The first three subtopic IDs retain their original meanings; new topics use suffixes 4 and 5. Keep main overviews around 250–450 useful words, excluding subtopics and investigation tabs. The unit suite checks depth and valid connections. Never pad an empirical claim with conceptual text to make it appear supported.

`src/data/illustrations.ts` holds the local strength tasks, precision steps and conditional execution states. `src/scene/createExecution.ts` draws illustrative hosts and transfer paths; it does not move computation. Keep source-stop and destination-resume states distinct for migration; copying must retain two independent instances; unavailable required resources must prevent execution in the illustration.

`src/content/arrival.ts` is the single editable source for the arrival scenario and creator provenance. The current headline is **IT IS HERE ALREADY!**, explicitly attributed as the creator’s personal belief as an AI undergraduate, with the user-supplied attribution U O W · University of Westminster. It replaces the previous arrival window. Do not present it as an established scientific finding or attach unrelated model papers as verification.

Discovery lenses may overlap, but the twelve domain IDs remain the source of truth. Add aliases or profile links instead of inventing new top-level IDs for running, strength or precision. Version 2 URLs include group, profile, topic and illustration state while continuing to parse version 1 links.

The dual-host exhibit uses `src/content/mobility.ts` and `src/components/SubstrateMobility.tsx` for operational-state requirements, failure cases, distinctions and qualified implications. Its general ASI hypothesis is **Theoretically Plausible**. The creator’s belief does not reclassify that hypothesis or represent a university position.
