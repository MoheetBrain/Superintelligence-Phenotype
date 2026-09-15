export const author = 'Moheet Khawaja';
export const origin = 'https://superintel.site';
export const siteDate = '2026-09-15';
export const repo = 'https://github.com/MoheetBrain/Superintelligence-Phenotype';
export const papers = [
  [
    'P1',
    'P1_when_capability_iteration_outruns_assurance.md',
    'capability-iteration-outruns-assurance',
    'Working paper · Theory / methods proposal',
    'Simulations and public-data calibration remain proposed.',
  ],
  [
    'P2',
    'P2_hazardous_inference_frontier.md',
    'hazardous-inference-frontier',
    'Working paper · Proposed experiment',
    'No benchmark has yet been constructed; no empirical discovery is claimed.',
  ],
  [
    'P3',
    'P3_recursive_epistemic_dependence.md',
    'recursive-epistemic-dependence',
    'Working paper · Proposed experiment',
    'No human-subject experiment has yet been run.',
  ],
  [
    'P4',
    'P4_control_frontier.md',
    'control-frontier',
    'Working paper · Theory / formal framework',
    'Elementary conditional results; a stronger technical contribution requires new theory or data.',
  ],
  [
    'P5',
    'P5_closing_the_loop.md',
    'closing-the-loop',
    'Working paper · Proposed empirical programme',
    'Stage-ablation experiments remain proposed; full recursive self-improvement is not established.',
  ],
  [
    'P6',
    'P6_correlated_lineage_resilience.md',
    'correlated-lineage-resilience',
    'Working paper · Modelling proposal',
    'No dependency graph or probability model has yet been calibrated.',
  ],
  [
    'P7',
    'P7_updating_hazard_model.md',
    'updating-hazard-model',
    'Working paper · Research protocol',
    'Preregistration is proposed; no forecasts have yet been scored and no extinction probability is reported.',
  ],
  [
    'P8',
    'P8_embodiment_threshold.md',
    'embodiment-threshold',
    'Working paper · MODEL + PROPOSED EMPIRICAL PROGRAMME',
    'The delay bound is conditional on the stated model assumptions. All five experiments remain proposed; no numerical risk result exists.',
  ],
].map(([id, file, slug, status, readiness]) => ({
  id,
  file,
  route: `/research/papers/${slug}`,
  status,
  readiness,
  date: id === 'P8' ? '2026-09-15' : '2026-09-14',
  version: 'v0.1',
  type: 'paper',
}));
export const supporting = [
  ['PROGRAMME_OVERVIEW.md', 'programme', 'Research programme'],
  ['NOVELTY_AUDIT.md', 'novelty', 'Novelty audit'],
  ['RELEASE_ORDER.md', 'release-order', 'Publication readiness'],
  ['CLUSTERING_MATRIX.md', 'clustering', 'Provenance & clustering'],
  ['INDEX.md', 'source-index', 'Original package index'],
].map(([file, slug, status]) => ({
  file,
  route: `/research/${slug}`,
  status,
  date: ['programme', 'novelty', 'release-order'].includes(slug) ? '2026-09-15' : '2026-09-14',
  version: ['programme', 'novelty', 'release-order'].includes(slug) ? 'v0.2' : 'v0.1',
  type: 'support',
}));
export const history = [
  [
    'AI-Safety-Generalization-Risks-research-extract.md',
    'generalization-risks',
    'Generalization, hazardous inference and frontier governance',
  ],
  [
    'Improve-Game-Theory-Phrase-research-extract.md',
    'evolution-and-strategy',
    'Evolution, strategic capability and human futures',
  ],
].map(([file, slug, title]) => ({
  file,
  route: `/research/history/${slug}`,
  title,
  status: 'Historical formulation · Not established',
  date: '2026-09-13',
  version: 'Source unversioned · site extract 2026-09-15',
  type: 'history',
}));
export const note = {
  file: 'state-space-framework-v0.1.md',
  route: '/research/notes/state-space-framework',
  date: '2026-09-14',
  version: 'v0.1',
  status: 'Research note · Proposed framework',
  type: 'note',
};
export const documents = [...papers, ...supporting, ...history, note];
export const provenance = {
  O: 'Originated with Moheet Khawaja in the historical source material.',
  'O→F':
    'Core idea originated with Moheet Khawaja and was subsequently formalized collaboratively.',
  'A→U': 'Assistant-originated formulation subsequently adopted or reused by Moheet Khawaja.',
  'U?': 'Substantial framework supplied by the user; exact originality remains uncertain.',
  Q: 'Third-party material quoted or discussed; not claimed as original.',
};
