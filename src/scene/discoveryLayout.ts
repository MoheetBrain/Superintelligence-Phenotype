import { Vector3, type Camera } from 'three';
export const rootAnchors = [
  [-2.6, 4.9, 0.1],
  [-2.9, 2.55, 0.2],
  [2.7, 4.9, 0.1],
  [2.9, 2.8, 0.2],
  [2.5, 0.85, 0],
] as const;
export function cloudAnchor(index: number, count: number, root: boolean) {
  if (root) return new Vector3(...rootAnchors[index]);
  const side = index % 2 === 0 ? -1 : 1,
    rows = Math.ceil(count / 2),
    row = Math.floor(index / 2);
  return new Vector3(side * 2.65, 5.45 - row * (4.8 / Math.max(1, rows - 1)), 0.15);
}
export function projected(point: Vector3, camera: Camera, width: number, height: number) {
  const local = point.clone().applyMatrix4(camera.matrixWorldInverse),
    p = point.clone().project(camera);
  return {
    x: ((p.x + 1) * width) / 2,
    y: ((1 - p.y) * height) / 2,
    visible: local.z < 0 && p.z >= -1 && p.z <= 1,
  };
}
export interface LabelPoint {
  key: string;
  x: number;
  y: number;
  visible: boolean;
}
export function placeCallouts(
  points: LabelPoint[],
  width: number,
  height: number,
  labelWidth = 205,
  labelHeight = 58,
) {
  const result = new Map<string, { x: number; y: number; visible: boolean }>(),
    gap = 10,
    maximum = height - 20;
  // Rebalance a crowded side when orbiting collapses several projected anchors
  // onto the same rail. Fixed outer limits reserve the body centre for geometry.
  const capacity = Math.max(1, Math.floor((height - 34) / (labelHeight + gap)));
  const rails = [points.filter((p) => p.x < width / 2), points.filter((p) => p.x >= width / 2)];
  for (let side = 0; side < 2; side++)
    while (rails[side].length > capacity && rails[1 - side].length < capacity)
      rails[1 - side].push(rails[side].pop()!);
  for (let side = 0; side < 2; side++) {
    const rail = rails[side].sort((a, b) => a.y - b.y);
    let cursor = 14;
    const placements = rail.map((p) => {
      const y = Math.max(cursor, Math.min(maximum - labelHeight, p.y - labelHeight / 2));
      cursor = y + labelHeight + gap;
      return { p, y };
    });
    const overflow = Math.max(0, cursor - gap - maximum);
    placements.forEach(({ p, y }, i) =>
      result.set(p.key, {
        x:
          side === 0
            ? Math.max(12, Math.min(width / 2 - labelWidth - 145, p.x - labelWidth - 18))
            : Math.min(width - labelWidth - 12, Math.max(width / 2 + 145, p.x + 18)),
        y: Math.max(14 + i * (labelHeight + gap), y - overflow),
        visible: p.visible && i < capacity,
      }),
    );
  }
  return result;
}
