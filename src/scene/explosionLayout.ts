import { Vector3 } from 'three';
import type { PartRegistry } from './partRegistry';
export function applyExplosion(registry: PartRegistry, amount: number, aspect: number) {
  const columns = aspect < 0.8 ? 2 : aspect > 1.8 ? 4 : 3;
  const entries = [...registry.values()];
  const rows = Math.ceil(entries.length / columns);
  entries.forEach((p, i) => {
    const destination = new Vector3(
      ((i % columns) - (columns - 1) / 2) * 3.5,
      (rows - 1 - Math.floor(i / columns)) * 3.1 + 1.5,
      0,
    );
    p.group.position.copy(p.assembled).lerp(destination, amount);
  });
}
