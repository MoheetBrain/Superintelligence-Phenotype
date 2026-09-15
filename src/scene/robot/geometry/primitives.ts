import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { U, type ShellProfile } from '../robotSpec';
export type Station = readonly [y: number, width: number, depth: number, z?: number];
/** Smoothly lofted superellipse sections, with an optional curved front-only skin. */
export function shellGeometry(
  stations: readonly Station[],
  exponent = 2.6,
  frontOnly = false,
  fine = true,
  frontScale = 1,
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
      const theta = frontOnly ? 0.28 + (j / sides) * (Math.PI - 0.56) : (j / sides) * Math.PI * 2;
      const c = Math.cos(theta),
        s = Math.sin(theta),
        p = 2 / exponent;
      positions.push(
        U((Math.sign(c) * Math.abs(c) ** p * width) / 2),
        U(y),
        U(
          (Math.sign(s) * Math.abs(s) ** p * depth * (s > 0 ? frontScale : 2 - frontScale)) / 2 + z,
        ),
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
/** Flat central faces, controlled hems and an asymmetric front/rear volume. */
export function engineeredShell(profile: ShellProfile, frontScale = 0.93) {
  const {
    length: h,
    proximalWidth: top,
    midWidth: mid,
    distalWidth: bottom,
    depth: d,
    edgeRadius: r,
  } = profile;
  return shellGeometry(
    [
      [-h / 2, 0.0001, 0.0001],
      [-h / 2 + 0.0005, bottom - 2 * r, d * 0.65],
      [-h / 2 + r, bottom, d * 0.72],
      [-h * 0.24, bottom * 0.6 + mid * 0.4, d * 0.83, -0.001],
      [h * 0.02, mid, d * 0.94, -0.002],
      [h * 0.32, top, d, -0.002],
      [h / 2 - r, top * 0.98, d * 0.92],
      [h / 2 - 0.0005, top * 0.98 - 2 * r, d * 0.86],
      [h / 2, 0.0001, 0.0001],
    ],
    4.2,
    false,
    false,
    frontScale,
  );
}
/** Open-front ankle arch: lift the lower front hem continuously around the bearing.
 * The rear calf remains deep; no invented internal drive is filled into the opening. */
export function shinShell(profile: ShellProfile) {
  const geometry = engineeredShell(profile, 0.79);
  const positions = geometry.getAttribute('position');
  const bottom = -profile.length / 2;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) / U(1),
      y = positions.getY(i) / U(1),
      z = positions.getZ(i) / U(1);
    if (z <= 0 || Math.abs(x) >= 0.016 || y > bottom + 0.038) continue;
    const arch = 0.026 * Math.sqrt(1 - (x / 0.016) ** 2);
    const influence = Math.max(0, 1 - (y - bottom) / 0.038);
    positions.setY(i, U(y + arch * influence));
  }
  // The lower loft fan would close the ankle pocket with a sloping grey face.
  // Remove that end cap so the hem exposes the separate dark bearing behind it.
  geometry.setIndex(Array.from(geometry.index!.array).slice(geometry.userData.loft.sides * 6 * 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}
/** Bevelled XY outline extruded in depth. Holes remain real openings. */
export function outlinePlate(
  points: readonly (readonly [number, number])[],
  depth: number,
  bevel = 0.0015,
  hole?: readonly (readonly [number, number])[],
) {
  const path = (vertices: readonly (readonly [number, number])[], target: T.Shape | T.Path) => {
    vertices.forEach(([x, y], i) => (i ? target.lineTo(x, y) : target.moveTo(x, y)));
    target.closePath();
    return target;
  };
  const shape = path(points, new T.Shape()) as T.Shape;
  if (hole) shape.holes.push(path(hole, new T.Path()));
  const geometry = new T.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 3,
    steps: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.scale(U(1), U(1), U(1));
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
    radius < 0.01 ? 16 : 36,
  );
  shape.scale(U(1), U(1), U(1));
  return shape;
}
export function footShell(length: number, width: number, height: number) {
  // Low technical wedge with a defined heel and bevelled toe.
  const g = shellGeometry(
    [
      [-length / 2, 0.0001, 0.0001, height * 0.12],
      [-length * 0.49, width * 0.76, height * 0.48, height * 0.12],
      [-length * 0.43, width * 0.96, height * 0.62, height * 0.05],
      [-length * 0.25, width, height, -height * 0.06],
      [-length * 0.04, width * 0.96, height * 0.93, -height * 0.02],
      [length * 0.23, width * 0.83, height * 0.56, height * 0.17],
      [length * 0.43, width * 0.66, height * 0.31, height * 0.29],
      [length * 0.49, width * 0.61, height * 0.28, height * 0.3],
      [length / 2, 0.0001, 0.0001, height * 0.3],
    ],
    4.3,
  );
  g.rotateX(Math.PI / 2);
  return g;
}
