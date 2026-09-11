import type { DomainId } from './schema';
import { domainById } from './domains';
import { profileTraits } from './profile';
export const groupIds = ['mind', 'physical', 'beyond', 'learning', 'resources'] as const;
export type DiscoveryGroupId = (typeof groupIds)[number];
export interface DiscoveryNode {
  key: string;
  label: string;
  preview: string;
  color: string;
  group?: DiscoveryGroupId;
  capability?: DomainId;
  profile?: string;
  topic?: string;
  illustration?: 'strength' | 'precision' | 'execution';
}
export const discoveryGroups = [
  {
    id: 'mind',
    name: 'Mind',
    color: '#9ca8ff',
    preview: 'Reason across domains, remember, and recognize what remains unknown.',
  },
  {
    id: 'physical',
    name: 'Physical capabilities',
    color: '#ff9a7b',
    preview: 'Turn intelligence into movement through a body, sensors and feedback.',
  },
  {
    id: 'beyond',
    name: 'Beyond one body',
    color: '#70e3e5',
    preview: 'Explore different hosts, many interfaces and conditional continuity.',
  },
  {
    id: 'learning',
    name: 'Learning & evolution',
    color: '#d9a2ff',
    preview: 'Investigate improvement, inheritance and collective organization.',
  },
  {
    id: 'resources',
    name: 'Resources & control',
    color: '#d7de87',
    preview: 'Understand the energy, hardware, permissions and people behind capability.',
  },
] as const;
export const primaryGroup: Record<DomainId, DiscoveryGroupId> = {
  cognition: 'mind',
  metacognition: 'mind',
  memory: 'mind',
  'theory-of-mind': 'mind',
  agency: 'physical',
  embodiment: 'physical',
  coordination: 'beyond',
  replication: 'beyond',
  'substrate-mobility': 'beyond',
  'self-improvement': 'learning',
  'control-governance': 'resources',
  ecology: 'resources',
};
const lensContent: Record<DiscoveryGroupId, readonly string[]> = {
  mind: ['cognition', 'metacognition', 'memory', 'theory-of-mind', 'p:knowledge', 'p:strategy'],
  physical: [
    'p:strength',
    'p:speed',
    'p:jumping',
    'p:dexterity',
    'p:precision',
    'p:reaction',
    'p:endurance',
    'embodiment',
    'agency',
  ],
  beyond: [
    'substrate-mobility',
    'replication',
    'coordination',
    'p:persistence',
    'p:flexibility',
    'p:parallel',
    'demo:execution',
  ],
  learning: ['self-improvement', 'replication', 'coordination', 'metacognition', 'p:improvement'],
  resources: ['ecology', 'control-governance', 'agency', 'coordination'],
};
export function discoveryNodes(group: DiscoveryGroupId | null): DiscoveryNode[] {
  if (!group)
    return discoveryGroups.map((g) => ({
      key: `group-${g.id}`,
      label: g.name,
      preview: g.preview,
      color: g.color,
      group: g.id,
    }));
  const color = discoveryGroups.find((g) => g.id === group)!.color;
  return lensContent[group].map((id) => {
    if (id === 'demo:execution')
      return {
        key: 'demo-execution',
        label: 'Different execution arrangements',
        preview: 'Compare remote control, migration and copying, step by step.',
        color,
        capability: 'substrate-mobility',
        illustration: 'execution',
      };
    if (id.startsWith('p:')) {
      const p = profileTraits.find((t) => t.id === id.slice(2))!;
      return {
        key: `profile-${p.id}`,
        label: p.name === 'Running Speed' ? 'Running' : p.name,
        preview: p.meaning,
        color,
        capability: p.domain,
        profile: p.id,
      };
    }
    return {
      key: `cap-${id}`,
      label: domainById[id as DomainId].name,
      preview: domainById[id as DomainId].aliases.join(' · '),
      color,
      capability: id as DomainId,
    };
  });
}
