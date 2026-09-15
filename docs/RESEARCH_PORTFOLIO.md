# Research portfolio provenance

Prepared 14 September 2026. The portfolio has exactly five primary sections and preserves the original 3D atlas and share-state format.

## Artifact dates

- 29 June 2026: ASI Arrival Calculator commit `789af6f4bc02b47fc9dc2351714be7feda844a86`, author timestamp 20:30:42 UTC.
- 1 July 2026: calculator revision `a33ad3e9bf798580907ea39d21a93cb523f40a46`, author timestamp 15:19:38 UTC.
- 11 September 2026: atlas implementation commit `48fff46137eea1871aabc4b6aede57b56cacac22`, author timestamp 11:17:48 UTC.
- 15 September 2026: publication of working note v0.1, authored on 14 September before the publication crossed midnight in Europe/London. The versioned PDF and Markdown preserve their original authoring date and are under `public/research/`.

Git timestamps establish recorded source history, not independently verified conception dates. No exact June 2025 date has been invented. The available LinkedIn activity permalink `7335987842415751168` returned “Post not found” in the authenticated browser on 14 September 2026. The older alignment/value-drift, autonomy, monitoring and interpretability writings need recoverable original sources before inclusion as verified timeline entries.

## Forecasting reproduction

The public calculator is a separate experimental model, not a loss-of-control estimator. Source inspected at `a33ad3e9bf798580907ea39d21a93cb523f40a46`:

https://github.com/MoheetBrain/ASI-Arrival-Calculator/tree/a33ad3e9bf798580907ea39d21a93cb523f40a46

Run `python scripts/research-sensitivity.py /path/to/ASI-Arrival-Calculator` with that clean source revision and its requirements installed. The script validates the revision and does not modify that repository. It runs 100,000 samples with seed 42 for each of three scenarios:

1. Original published input set.
2. All three post-AGI cognitive lags doubled (low, mode, high, mean and standard deviation).
3. Infrastructure friction doubled using the same parameter scaling.

Only the stated inputs change. The alternative scenarios are analyst-chosen stress tests. Full result JSON includes package versions; CSV contains Spearman driver correlations. No fabricated data or chart values are used. Baseline batch medians span two months, failing the source's under-one-month stability check; the site explicitly reports this. Sobol analysis remains unimplemented upstream and is not claimed here. These results are conditional simulations, not empirical estimates of calibrated arrival probabilities.

## Working note

`public/research/state-space-framework-v0.1.md` is the authoring source. Run `python scripts/render-research-note.py` with ReportLab to create the searchable PDF. The note is marked as AI-assisted independent work, with unspecified model functions and experiments not yet run. It has no DOI, peer-review claim or novelty claim. Its related-work links are starting points, not a completed literature review.

## Application

Application text and personal form data are not part of this public repository.

## Validation

TypeScript and the production build pass. All 53 unit/component tests and 38 production Chromium checks pass, covering all twelve selectable parts, transfers, scene cleanup, sharing/history, responsive layouts, accessibility, research navigation, forecast target changes and PDF delivery. The two-page PDF was rendered and visually reviewed. The final publication-date wording distinguishes 14 September authoring from 15 September publication; the production build was refreshed afterward.
