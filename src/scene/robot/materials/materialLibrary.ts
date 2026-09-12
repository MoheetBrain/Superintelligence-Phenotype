import { MeshPhysicalMaterial } from 'three';
export type Surface =
  | 'shell'
  | 'secondary'
  | 'joint'
  | 'flex'
  | 'visor'
  | 'sensor'
  | 'hand'
  | 'seam';
export const palette = {
  graphite: {
    shell: '#555b60',
    secondary: '#8a9093',
    joint: '#171b1d',
    flex: '#111415',
    visor: '#030405',
    sensor: '#c6f7fa',
    hand: '#202629',
    seam: '#131719',
  },
  pearl: {
    shell: '#e7e8e5',
    secondary: '#bac0bd',
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
    shell: { metalness: finish === 'graphite' ? 0.78 : 0.38, roughness: 0.32 },
    secondary: { metalness: 0.78, roughness: 0.3 },
    joint: { metalness: 0.45, roughness: 0.44 },
    flex: { metalness: 0, roughness: 0.74 },
    visor: { metalness: 0.2, roughness: 0.11 },
    sensor: { metalness: 0.3, roughness: 0.18 },
    hand: { metalness: 0.36, roughness: 0.45 },
    seam: { metalness: 0.2, roughness: 0.58 },
  }[surface];
  return new MeshPhysicalMaterial({
    color,
    ...settings,
    clearcoat: surface === 'visor' ? 1 : 0.22,
    clearcoatRoughness: surface === 'visor' ? 0.08 : 0.3,
    emissive: surface === 'sensor' ? color : '#000000',
    emissiveIntensity: surface === 'sensor' ? 0.18 : 0,
  });
}
