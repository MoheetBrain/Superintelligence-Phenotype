import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { robotSpec as s, U } from '../robotSpec';
import { jointDisc, rounded, footShell, taperedShell } from './primitives';
import type { AddMesh } from './createMechanicalAssembly';
import type { PartRegistry } from '../../partRegistry';

export function createIndustrialDetails(
  add: AddMesh,
  parts: Record<string, string>,
  registry: PartRegistry,
) {
  function line(part: string, bone: string, points: T.Vector3[], radius = 0.00055) {
    return add(
      part,
      bone,
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points),
        Math.max(16, points.length * 2),
        U(radius),
        4,
        false,
      ),
      [0, 0, 0],
      'seam',
      3,
    );
  }
  const chestGeometry = registry.get(parts.chest)!.meshes[0].geometry;
  const chest = chestGeometry.getAttribute('position');
  const ringSize = chestGeometry.userData.loft.sides + 1,
    rows = chestGeometry.userData.loft.rows;
  const at = (row: number, col: number) =>
    new T.Vector3().fromBufferAttribute(chest, row * ringSize + col).multiplyScalar(1.006);
  const perimeter: T.Vector3[] = [];
  for (let row = 4; row < rows - 4; row++) perimeter.push(at(row, 21));
  for (let col = 21; col >= 7; col--) perimeter.push(at(rows - 5, col));
  for (let row = rows - 5; row >= 4; row--) perimeter.push(at(row, 7));
  for (let col = 7; col <= 21; col++) perimeter.push(at(4, col));
  line(parts.chest, 'torso', perimeter, 0.0006);
  function shellSeam(part: string, bone: string, sign: number, radius: number) {
    const shell = registry
      .get(part)!
      .meshes.find((mesh) => mesh.parent?.name === bone && mesh.userData.stage === 1)!;
    const { sides, rows } = shell.geometry.userData.loft;
    const positions = shell.geometry.getAttribute('position');
    const col = Math.round(sides * (sign > 0 ? 0.125 : 0.375));
    shell.updateMatrix();
    const points: T.Vector3[] = [];
    for (let row = 2; row < rows - 2; row++) {
      const point = new T.Vector3().fromBufferAttribute(positions, row * (sides + 1) + col);
      // Follow the actual rotated shell, including its changing cross-section.
      point.x *= 1.006;
      point.z *= 1.006;
      points.push(point.applyMatrix4(shell.matrix));
    }
    return line(part, bone, points, radius);
  }
  for (const row of [6, 14, 26, 32])
    for (const col of [10, 18]) {
      const p = at(row, col);
      p.z += U(0.0006);
      const screw = add(
        parts.chest,
        'torso',
        jointDisc(s.detail.fastenerRadius, 0.0011),
        p.toArray().map((v) => v / U(1)),
        'secondary',
        3,
      );
      screw.rotation.x = Math.PI / 2;
      add(
        parts.chest,
        'torso',
        rounded(0.0015, 0.00035, 0.0006, 0.0001),
        [p.x / U(1), p.y / U(1), p.z / U(1) + 0.0006],
        'seam',
        3,
      );
    }
  for (const [y, z, r] of [
    [0.025, 0.039, 0.0042],
    [-0.038, 0.032, 0.0038],
  ] as const) {
    const housing = add(parts.eyes, 'head', jointDisc(r, 0.0025), [0, y, z + 0.002], 'joint', 3);
    housing.rotation.x = Math.PI / 2;
    const lens = add(parts.eyes, 'head', jointDisc(r * 0.52, 0.001), [0, y, z + 0.004], 'visor', 3);
    lens.rotation.x = Math.PI / 2;
  }
  add(
    parts.eyes,
    'head',
    rounded(0.006, 0.0012, 0.001, 0.0004),
    [0.011, 0.003, 0.039],
    'sensor',
    3,
  );
  add(
    parts.shield,
    'torso',
    rounded(0.006, 0.001, 0.001, 0.0003),
    [0, 0.047, s.torso.depth * 0.5 + 0.0025],
    'sensor',
    3,
  );
  for (const [side, sign] of [
    ['L', -1],
    ['R', 1],
  ] as const) {
    // Fine ribs lie on the lateral curved structure. They share one buffer per side.
    const fins: T.BufferGeometry[] = [];
    for (let i = 0; i < 25; i++) {
      const z = (i - 12) * 0.0031,
        extent = 0.089 * Math.sqrt(Math.max(0.05, 1 - (z / 0.046) ** 2));
      const g = new T.BoxGeometry(U(0.0015), U(extent), U(0.0012));
      g.translate(U(sign * 0.084), U(-0.003 - extent / 2 + 0.024), U(z - 0.004));
      fins.push(g);
    }
    add(parts.chest, 'torso', mergeGeometries(fins), [0, 0, 0], 'secondary', 3);
    fins.forEach((g) => g.dispose());
    const vent: T.BufferGeometry[] = [];
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 4; j++) {
        const g = new T.BoxGeometry(U(0.003), U(0.002), U(0.001));
        g.translate(U((i - 2.5) * 0.0044), U((j - 1.5) * 0.0038), 0);
        vent.push(g);
      }
    add(
      parts.arm,
      `upperArm_${side}`,
      mergeGeometries(vent),
      [sign * 0.017, -0.137, 0.022],
      'joint',
      3,
    );
    vent.forEach((g) => g.dispose());
    const forearmSeam = shellSeam(parts.arm, `forearm_${side}`, sign, 0.0005);
    forearmSeam.userData.detail = 'longitudinal seam';
    add(
      parts.arm,
      `forearm_${side}`,
      taperedShell(0.025, 0.033, 0.002, 0.92),
      [sign * 0.017, -0.126, 0.027],
      'joint',
      3,
    );
    add(
      parts.hands,
      `hand_${side}`,
      rounded(0.03, 0.031, 0.003, 0.004),
      [0, -0.024, -0.011],
      'flex',
      3,
    );
    for (let finger = 0; finger < 4; finger++) {
      const length = s.arm.fingerLengths[finger];
      add(
        parts.hands,
        `finger_${side}_${finger}_2`,
        rounded(0.0065, length * 0.2, 0.002, 0.0015),
        [0, -length * 0.17, 0.005],
        'flex',
        3,
      );
    }
    const foot = `foot_${side}`;
    add(
      parts.legs,
      foot,
      footShell(s.leg.footLength * 1.018, s.leg.footWidth * 1.04, 0.008),
      [0, -s.leg.ankleY + 0.004, s.leg.footForward],
      'flex',
      3,
    );
    line(
      parts.legs,
      foot,
      [
        new T.Vector3(-U(0.018), -U(0.035), U(0.048)),
        new T.Vector3(0, -U(0.03), U(0.054)),
        new T.Vector3(U(0.018), -U(0.035), U(0.048)),
      ],
      0.0006,
    );
    add(
      parts.legs,
      `shin_${side}`,
      taperedShell(0.159, 0.021, 0.012, 0.77),
      [0, -0.103, -0.027],
      'joint',
      3,
    );
    shellSeam(parts.legs, `shin_${side}`, sign, 0.00045);
  }
}
