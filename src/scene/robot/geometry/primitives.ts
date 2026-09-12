import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { U } from '../robotSpec';
export type Station = readonly [y: number, width: number, depth: number, z?: number];
/** Smoothly lofted superellipse sections, with an optional curved front-only skin. */
export function shellGeometry(
  stations: readonly Station[],
  exponent = 2.6,
  frontOnly = false,
  fine = true,
) {
  const positions: number[] = [],
    indices: number[] = [],
    sides = frontOnly ? 36 : fine ? 56 : 24,
    subdivisions = fine ? 5 : 3;
  const sections: Station[] = [];
  const slope = (i: number, axis: number) => {
    const value = (n: number) => stations[n][axis] ?? 0;
    const secant = (a: number, b: number) =>
      (value(b) - value(a)) / (stations[b][0] - stations[a][0]);
    if (i === 0) return secant(0, 1);
    if (i === stations.length - 1) return secant(i - 1, i);
    const left = secant(i - 1, i),
      right = secant(i, i + 1);
    return left * right <= 0 ? 0 : (2 * left * right) / (left + right);
  };
  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i],
      b = stations[i + 1];
    for (let j = 0; j < subdivisions; j++) {
      const t = j / subdivisions,
        t2 = t * t,
        t3 = t2 * t,
        dy = b[0] - a[0];
      const interpolate = (axis: number) =>
        (2 * t3 - 3 * t2 + 1) * (a[axis] ?? 0) +
        (t3 - 2 * t2 + t) * dy * slope(i, axis) +
        (-2 * t3 + 3 * t2) * (b[axis] ?? 0) +
        (t3 - t2) * dy * slope(i + 1, axis);
      sections.push([
        T.MathUtils.lerp(a[0], b[0], t),
        Math.max(0.0001, interpolate(1)),
        Math.max(0.0001, interpolate(2)),
        interpolate(3),
      ]);
    }
  }
  sections.push(stations[stations.length - 1]);
  for (const [y, width, depth, z = 0] of sections) {
    for (let j = 0; j <= sides; j++) {
      const theta = frontOnly ? 0.15 + (j / sides) * (Math.PI - 0.3) : (j / sides) * Math.PI * 2;
      const c = Math.cos(theta),
        s = Math.sin(theta),
        p = 2 / exponent;
      positions.push(
        U((Math.sign(c) * Math.abs(c) ** p * width) / 2),
        U(y),
        U((Math.sign(s) * Math.abs(s) ** p * depth) / 2 + z),
      );
    }
  }
  for (let row = 0; row < sections.length - 1; row++)
    for (let col = 0; col < sides; col++) {
      const a = row * (sides + 1) + col,
        b = a + sides + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const geometry = new T.BufferGeometry();
  geometry.userData.loft = { sides, rows: sections.length };
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  if (!frontOnly) {
    const normals = geometry.getAttribute('normal');
    for (let i = 0; i < sections.length; i++) {
      const a = i * (sides + 1),
        b = a + sides;
      const n = new T.Vector3()
        .fromBufferAttribute(normals, a)
        .add(new T.Vector3().fromBufferAttribute(normals, b))
        .normalize();
      normals.setXYZ(a, n.x, n.y, n.z);
      normals.setXYZ(b, n.x, n.y, n.z);
    }
  }
  geometry.computeBoundingBox();
  return geometry;
}
export function taperedShell(
  length: number,
  width: number,
  depth: number,
  distal = 0.72,
  flatten = 2.6,
) {
  return shellGeometry(
    [
      [-length / 2, 0.0001, 0.0001],
      [-length / 2 + length * 0.035, width * distal * 0.85, depth * 0.66],
      [-length * 0.4, width * distal, depth * 0.8],
      [length * 0.2, width, depth],
      [length * 0.42, width * 0.96, depth * 0.91],
      [length / 2 - length * 0.015, width * 0.74, depth * 0.69],
      [length / 2, 0.0001, 0.0001],
    ],
    flatten,
    false,
    width > 0.06,
  );
}
export const rounded = (w: number, h: number, d: number, r = 0.003) =>
  new RoundedBoxGeometry(U(w), U(h), U(d), 3, U(Math.min(r, w / 3, h / 3, d / 3)));
export function jointDisc(radius: number, depth: number) {
  const shape = new T.LatheGeometry(
    [
      new T.Vector2(0, -depth / 2),
      new T.Vector2(radius * 0.81, -depth / 2),
      new T.Vector2(radius * 0.96, -depth * 0.34),
      new T.Vector2(radius, -depth * 0.12),
      new T.Vector2(radius, depth * 0.15),
      new T.Vector2(radius * 0.95, depth * 0.4),
      new T.Vector2(radius * 0.78, depth / 2),
      new T.Vector2(0, depth / 2),
    ],
    radius < 0.01 ? 16 : 40,
  );
  shape.scale(U(1), U(1), U(1));
  return shape;
}
export function footShell(length: number, width: number, height: number) {
  // Horizontal shoe loft: rounded toe, low vamp, distinct higher heel.
  const g = shellGeometry(
    [
      [-length / 2, 0.0001, 0.0001, height * 0.06],
      [-length * 0.46, width * 0.73, height * 0.62, height * 0.03],
      [-length * 0.29, width, height, 0],
      [length * 0.04, width * 0.97, height * 0.77, height * 0.09],
      [length * 0.32, width * 0.89, height * 0.57, height * 0.18],
      [length * 0.46, width * 0.63, height * 0.37, height * 0.24],
      [length / 2, 0.0001, 0.0001, height * 0.265],
    ],
    3.0,
  );
  g.rotateX(Math.PI / 2);
  return g;
}
