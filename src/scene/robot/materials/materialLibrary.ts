import { MeshPhysicalMaterial } from 'three';
export type Surface =
  | 'shell'
  | 'panel'
  | 'secondary'
  | 'joint'
  | 'flex'
  | 'visor'
  | 'sensor'
  | 'hand'
  | 'seam';
export const palette = {
  graphite: {
    shell: '#454c51',
    panel: '#394247',
    secondary: '#687178',
    joint: '#171b1d',
    flex: '#111415',
    visor: '#030405',
    sensor: '#c6f7fa',
    hand: '#202629',
    seam: '#131719',
  },
  pearl: {
    shell: '#dcded7',
    panel: '#c8cdc7',
    secondary: '#c6ccc8',
    joint: '#171b1d',
    flex: '#111415',
    visor: '#030405',
    sensor: '#c6f7fa',
    hand: '#202629',
    seam: '#303638',
  },
};
export function createMaterial(surface: Surface, finish: keyof typeof palette = 'graphite') {
  const color = palette[finish][surface];
  const settings = {
    panel: { metalness: finish === 'graphite' ? 0.36 : 0.1, roughness: 0.56 },
    shell: {
      metalness: finish === 'graphite' ? 0.42 : 0.12,
      roughness: finish === 'graphite' ? 0.48 : 0.52,
    },
    secondary: {
      metalness: finish === 'graphite' ? 0.55 : 0.25,
      roughness: finish === 'graphite' ? 0.43 : 0.48,
    },
    joint: { metalness: 0.25, roughness: 0.5 },
    flex: { metalness: 0, roughness: 0.82 },
    visor: { metalness: 0.12, roughness: 0.08 },
    sensor: { metalness: 0.3, roughness: 0.18 },
    hand: { metalness: 0.18, roughness: 0.5 },
    seam: { metalness: 0.2, roughness: 0.58 },
  }[surface];
  return new MeshPhysicalMaterial({
    color,
    ...settings,
    clearcoat: surface === 'visor' ? 1 : surface === 'shell' || surface === 'secondary' ? 0.05 : 0,
    clearcoatRoughness: surface === 'visor' ? 0.08 : 0.45,
    emissive: surface === 'sensor' ? color : '#000000',
    emissiveIntensity: surface === 'sensor' ? 0.18 : 0,
  });
}
