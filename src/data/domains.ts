import type { Domain, DomainId } from './schema';
export const domainIds = [
  'cognition',
  'metacognition',
  'memory',
  'theory-of-mind',
  'agency',
  'coordination',
  'replication',
  'substrate-mobility',
  'embodiment',
  'control-governance',
  'ecology',
  'self-improvement',
] as const;
const names = [
  'Cognition and Epistemic Reach',
  'Metacognition',
  'Memory and Operational Continuity',
  'Theory of Mind',
  'Agency and Planning',
  'Collective Organisation',
  'Replication and Evolution',
  'Substrate Mobility',
  'Embodiment',
  'Control and Governance',
  'Ecology and Resources',
  'Recursive Self-Improvement',
];
const aliases = [
  ['reasoning', 'world modelling'],
  ['confidence', 'self-monitoring'],
  ['persistence', 'retrieval'],
  ['beliefs', 'perspective'],
  ['planning', 'autonomy'],
  ['multi-agent', 'coordination'],
  ['copying', 'lineage'],
  ['migration', 'state transfer'],
  ['sensors', 'actuators'],
  ['shutdown', 'accountability'],
  ['resource layers', 'compute', 'energy'],
  ['recursive improvement', 'successors'],
];
export const domains: readonly Domain[] = domainIds.map((id, i) => ({
  id,
  name: names[i],
  aliases: aliases[i],
  provisional: id === 'memory' || id === 'control-governance',
  provisionalNote:
    id === 'memory' || id === 'control-governance' ? 'Provisional navigation grouping.' : null,
}));
export const domainById = Object.fromEntries(domains.map((d) => [d.id, d])) as Record<
  DomainId,
  Domain
>;
export const shortNames = [
  'Cognition',
  'Metacognition',
  'Memory',
  'Theory of Mind',
  'Agency',
  'Coordination',
  'Replication',
  'Substrate Mobility',
  'Embodiment',
  'Control & Governance',
  'Ecology & Resources',
  'Self-Improvement',
];
