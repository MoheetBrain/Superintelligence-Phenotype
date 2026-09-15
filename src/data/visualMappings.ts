import type { DomainId, Vec3 } from './schema';
export interface VisualMapping {
  domain: DomainId;
  partId: string;
  label: string;
  anchor: Vec3;
  color: string;
  shape:
    | 'head'
    | 'halo'
    | 'spine'
    | 'eyes'
    | 'chest'
    | 'shoulders'
    | 'hips'
    | 'legs'
    | 'hands'
    | 'shield'
    | 'core'
    | 'arm';
}
// Original conceptual assignments. Model-local Y-up; one unit is an arbitrary design unit.
export const visualMappings: readonly VisualMapping[] = [
  {
    domain: 'cognition',
    partId: 'cognitive-shell',
    label: 'Cognitive shell',
    anchor: [0, 5.64, 0],
    color: '#c9d4cf',
    shape: 'head',
  },
  {
    domain: 'metacognition',
    partId: 'reflection-halo',
    label: 'Reflection crown',
    anchor: [0, 6.09, 0],
    color: '#d9fc8c',
    shape: 'halo',
  },
  {
    domain: 'memory',
    partId: 'memory-spine',
    label: 'Memory spine',
    anchor: [0, 4.12, -0.45],
    color: '#9db8c9',
    shape: 'spine',
  },
  {
    domain: 'theory-of-mind',
    partId: 'perspective-visor',
    label: 'Perspective visor',
    anchor: [0, 5.66, 0.35],
    color: '#9db8c9',
    shape: 'eyes',
  },
  {
    domain: 'agency',
    partId: 'planning-chest',
    label: 'Planning chest',
    anchor: [0, 4.57, 0],
    color: '#c9d4cf',
    shape: 'chest',
  },
  {
    domain: 'coordination',
    partId: 'coordination-shoulders',
    label: 'Coordination links',
    anchor: [0, 4.87, 0],
    color: '#aec1b6',
    shape: 'shoulders',
  },
  {
    domain: 'replication',
    partId: 'lineage-hub',
    label: 'Lineage hub',
    anchor: [0, 3.0, 0],
    color: '#c7b29a',
    shape: 'hips',
  },
  {
    domain: 'substrate-mobility',
    partId: 'transfer-legs',
    label: 'Transfer struts',
    anchor: [0, 1.47, 0],
    color: '#b8c5c1',
    shape: 'legs',
  },
  {
    domain: 'embodiment',
    partId: 'interface-hands',
    label: 'Interface hands',
    anchor: [0, 3.02, 0.025],
    color: '#c9d4cf',
    shape: 'hands',
  },
  {
    domain: 'control-governance',
    partId: 'intervention-shield',
    label: 'Intervention shield',
    anchor: [0, 4.64, 0.45],
    color: '#d4bc8c',
    shape: 'shield',
  },
  {
    domain: 'ecology',
    partId: 'resource-core',
    label: 'Resource core',
    anchor: [0, 3.57, 0],
    color: '#a8c9a2',
    shape: 'core',
  },
  {
    domain: 'self-improvement',
    partId: 'revision-arms',
    label: 'Revision arms',
    anchor: [0, 3.96, 0],
    color: '#b8c5c1',
    shape: 'arm',
  },
];
