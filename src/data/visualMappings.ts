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
    anchor: [0, 5.5, 0],
    color: '#c9d4cf',
    shape: 'head',
  },
  {
    domain: 'metacognition',
    partId: 'reflection-halo',
    label: 'Reflection halo',
    anchor: [0, 6.08, 0],
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
    anchor: [0, 5.48, 0.57],
    color: '#9db8c9',
    shape: 'eyes',
  },
  {
    domain: 'agency',
    partId: 'planning-chest',
    label: 'Planning chest',
    anchor: [0, 4.36, 0],
    color: '#c9d4cf',
    shape: 'chest',
  },
  {
    domain: 'coordination',
    partId: 'coordination-shoulders',
    label: 'Coordination links',
    anchor: [0, 4.7, 0],
    color: '#aec1b6',
    shape: 'shoulders',
  },
  {
    domain: 'replication',
    partId: 'lineage-hub',
    label: 'Lineage hub',
    anchor: [0, 2.72, 0],
    color: '#c7b29a',
    shape: 'hips',
  },
  {
    domain: 'substrate-mobility',
    partId: 'transfer-legs',
    label: 'Transfer struts',
    anchor: [0, 1.35, 0],
    color: '#b8c5c1',
    shape: 'legs',
  },
  {
    domain: 'embodiment',
    partId: 'interface-hands',
    label: 'Interface hands',
    anchor: [0, 2.92, 0.05],
    color: '#c9d4cf',
    shape: 'hands',
  },
  {
    domain: 'control-governance',
    partId: 'intervention-shield',
    label: 'Intervention shield',
    anchor: [0, 4.45, 0.54],
    color: '#d4bc8c',
    shape: 'shield',
  },
  {
    domain: 'ecology',
    partId: 'resource-core',
    label: 'Resource core',
    anchor: [0, 3.4, 0.1],
    color: '#a8c9a2',
    shape: 'core',
  },
  {
    domain: 'self-improvement',
    partId: 'revision-arms',
    label: 'Revision arms',
    anchor: [0, 3.92, 0],
    color: '#b8c5c1',
    shape: 'arm',
  },
];
