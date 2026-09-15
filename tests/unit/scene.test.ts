import { describe, it, expect } from 'vitest';
import { MeshStandardMaterial } from 'three';
import { createRobot } from '../../src/scene/createRobot';
import { applyExplosion } from '../../src/scene/explosionLayout';
import { highlightParts, conceptsForPart } from '../../src/scene/partRegistry';
import { PointerTap } from '../../src/scene/pointerTap';
describe('procedural mappings', () => {
  it('has twelve original mapped groups and no decorative pickers', () => {
    const { registry, decoration } = createRobot();
    expect(registry.size).toBe(12);
    for (const p of registry.values()) {
      expect(conceptsForPart(p.id)).toHaveLength(1);
      expect(p.meshes.length).toBeGreaterThan(0);
      expect(p.meshes.every((m) => m.parent !== decoration)).toBe(true);
    }
  });
  it('repeated explosion returns exactly to stored transforms', () => {
    const { registry } = createRobot();
    for (let i = 0; i < 10; i++) {
      applyExplosion(registry, 0.7, 0.6);
      applyExplosion(registry, 1, 2);
      applyExplosion(registry, 0, 1);
    }
    for (const p of registry.values())
      expect(p.group.position.toArray()).toEqual(p.assembled.toArray());
  });
  it('selected materials do not leak across unrelated meshes', () => {
    const { registry } = createRobot();
    const chest = registry.get('planning-chest')!.meshes[0].material as MeshStandardMaterial;
    const before = chest.color.getHex();
    highlightParts(registry, 'metacognition', null);
    expect(chest.color.getHex()).toBe(before);
    const halo = registry.get('reflection-halo')!.meshes[0].material as MeshStandardMaterial;
    expect(halo.emissiveIntensity).toBe(0.23);
  });
});
describe('tap arbitration', () => {
  it('accepts a deliberate tap', () => {
    const tap = new PointerTap();
    tap.down(1, 10, 10, 5);
    expect(tap.up(1, 12, 11)).toBe(true);
  });
  it('rejects a drag even if the pointer returns', () => {
    const tap = new PointerTap();
    tap.down(1, 10, 10, 5);
    tap.move(1, 50, 50);
    expect(tap.up(1, 10, 10)).toBe(false);
  });
  it('rejects both fingers of a pinch and permits the next tap', () => {
    const tap = new PointerTap();
    tap.down(1, 10, 10, 10);
    tap.down(2, 20, 20, 10);
    expect(tap.up(1, 10, 10)).toBe(false);
    expect(tap.up(2, 20, 20)).toBe(false);
    tap.down(3, 10, 10, 10);
    expect(tap.up(3, 10, 10)).toBe(true);
  });
  it('rejects a cancelled gesture', () => {
    const tap = new PointerTap();
    tap.down(1, 10, 10, 5);
    tap.cancel(1);
    expect(tap.up(1, 10, 10)).toBe(false);
  });
});
