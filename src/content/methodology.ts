import type { EvidenceLevel } from '../data/schema';
export const evidenceLevels: readonly EvidenceLevel[] = [
  'Observed',
  'Extrapolated',
  'Theoretically Plausible',
  'Speculative',
];
export const evidenceMeaning: Record<EvidenceLevel, string> = {
  Observed:
    'Reported in a specified evaluated system and task, with a reviewed source. It does not generalise to every AI.',
  Extrapolated:
    'Extends a limited finding to a new capability or setting. That extension has not been demonstrated here.',
  'Theoretically Plausible':
    'A coherent proposed mechanism whose relevant system-level behaviour remains to be demonstrated.',
  Speculative:
    'A possibility with substantial unresolved mechanisms or assumptions. It is not a forecast or measurement.',
};
export const metaphor =
  'The robot is a navigation aid. AI need not be humanoid, and capabilities do not occupy physical organs.';
