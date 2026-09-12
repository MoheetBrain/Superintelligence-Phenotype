import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { visualMappings } from '../data/visualMappings';
import type { PartRegistry } from './partRegistry';

type Surface = 'shell' | 'secondary' | 'joint' | 'flex' | 'visor' | 'sensor';
const palettes = {
  graphite: {
    shell: '#555f65',
    secondary: '#9da6aa',
    joint: '#20262b',
    flex: '#171c20',
    visor: '#080e14',
    sensor: '#c6f7fa',
  },
  pearl: {
    shell: '#e5e7e3',
    secondary: '#c5cbc9',
    joint: '#20262b',
    flex: '#171c20',
    visor: '#080e14',
    sensor: '#c6f7fa',
  },
};
/** Original industrial platform: arbitrary design units, not a robotics performance model. */
export function createRobot() {
  const robot = new T.Group();
  robot.name = 'Atlas industrial humanoid';
  const decoration = new T.Group();
  decoration.name = 'Structural details';
  robot.add(decoration);
  const registry: PartRegistry = new Map();
  const add = (
    g: T.Group,
    geometry: T.BufferGeometry,
    x: number,
    y: number,
    z: number,
    surface: Surface = 'shell',
  ) => {
    const color = palettes.graphite[surface];
    const polished = surface === 'visor';
    const material = new T.MeshPhysicalMaterial({
      color,
      metalness: polished ? 0.35 : surface === 'flex' ? 0.05 : 0.62,
      roughness: polished ? 0.12 : surface === 'flex' ? 0.78 : 0.33,
      clearcoat: polished ? 1 : 0.3,
      clearcoatRoughness: 0.14,
      emissive: surface === 'sensor' ? color : '#000000',
      emissiveIntensity: surface === 'sensor' ? 0.35 : 0,
    });
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    Object.assign(mesh.userData, {
      surface,
      baseColor: color,
      baseEmissive: surface === 'sensor' ? color : '#000000',
    });
    mesh.castShadow = mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  };
  const box = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    surface: Surface = 'shell',
    r = 0.035,
  ) =>
    add(g, new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)), x, y, z, surface);
  const disc = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    r: number,
    depth: number,
    surface: Surface = 'joint',
  ) => {
    const mesh = add(g, new T.CylinderGeometry(r, r, depth, 24), x, y, z, surface);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  };
  const ring = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    r: number,
    tube: number,
    surface: Surface = 'secondary',
  ) => add(g, new T.TorusGeometry(r, tube, 8, 32), x, y, z, surface);
  const loft = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    stations: readonly (readonly [number, number, number])[],
    surface: Surface = 'shell',
  ) => {
    const positions: number[] = [],
      indices: number[] = [],
      sides = 32;
    for (const [sy, w, d] of stations)
      for (let j = 0; j <= sides; j++) {
        const angle = (j / sides) * Math.PI * 2,
          c = Math.cos(angle),
          s = Math.sin(angle);
        positions.push(
          (Math.sign(c) * Math.abs(c) ** 0.72 * w) / 2,
          sy,
          (Math.sign(s) * Math.abs(s) ** 0.72 * d) / 2,
        );
      }
    for (let i = 0; i < stations.length - 1; i++)
      for (let j = 0; j < sides; j++) {
        const a = i * (sides + 1) + j,
          b = a + sides + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return add(g, geometry, x, y, z, surface);
  };
  const shell = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    surface: Surface = 'shell',
    taper = 0.76,
  ) =>
    loft(
      g,
      x,
      y,
      z,
      [
        [-h / 2, 0, 0],
        [-h / 2, w * taper * 0.8, d * 0.7],
        [-h / 2 + 0.07, w * taper, d],
        [h * 0.28, w, d],
        [h / 2 - 0.04, w * 0.92, d * 0.92],
        [h / 2, w * 0.68, d * 0.6],
        [h / 2, 0, 0],
      ],
      surface,
    );
  for (const v of visualMappings) {
    const group = new T.Group();
    group.name = v.partId;
    group.position.fromArray(v.anchor);
    robot.add(group);
    switch (v.shape) {
      case 'head':
        loft(group, 0, 0, -0.02, [
          [-0.4, 0, 0],
          [-0.38, 0.35, 0.38],
          [-0.29, 0.53, 0.5],
          [0.16, 0.66, 0.57],
          [0.31, 0.58, 0.49],
          [0.39, 0.33, 0.28],
          [0.4, 0, 0],
        ]);
        box(group, 0, 0, -0.305, 0.24, 0.5, 0.025, 'secondary', 0.01);
        break;
      case 'eyes':
        loft(
          group,
          0,
          -0.025,
          -0.09,
          [
            [-0.32, 0, 0],
            [-0.3, 0.3, 0.05],
            [-0.21, 0.48, 0.12],
            [0.16, 0.57, 0.14],
            [0.25, 0.48, 0.08],
            [0.28, 0, 0],
          ],
          'visor',
        );
        for (const x of [-0.12, 0.12]) {
          disc(group, x, 0.07, 0.008, 0.022, 0.016, 'joint');
          disc(group, x, 0.07, 0.02, 0.009, 0.008, 'sensor');
        }
        box(group, 0, 0.18, 0.005, 0.07, 0.012, 0.014, 'sensor', 0.004);
        break;
      case 'halo':
        box(group, 0, -0.062, -0.02, 0.37, 0.018, 0.34, 'secondary', 0.005);
        for (const side of [-1, 1]) {
          box(group, side * 0.326, -0.29, -0.005, 0.055, 0.21, 0.21, 'joint');
          disc(group, side * 0.33, -0.27, 0.107, 0.027, 0.012, 'secondary');
        }
        break;
      case 'chest':
        // A continuous shoulder-to-waist shell with inset titanium flanks.
        loft(group, 0, -0.02, -0.04, [
          [-0.48, 0, 0],
          [-0.46, 0.68, 0.37],
          [-0.34, 0.88, 0.52],
          [0.15, 1.29, 0.65],
          [0.32, 1.23, 0.57],
          [0.43, 0.79, 0.37],
          [0.45, 0, 0],
        ]);
        for (const side of [-1, 1]) {
          const flank = shell(group, side * 0.55, -0.07, 0.08, 0.22, 0.65, 0.38, 'secondary', 0.55);
          flank.rotation.z = -side * 0.25;
          box(group, side * 0.36, 0.31, 0.23, 0.32, 0.025, 0.025, 'joint', 0.008);
        }
        box(group, 0, -0.17, 0.292, 0.35, 0.017, 0.015, 'joint', 0.004);
        break;
      case 'shoulders':
        for (const side of [-1, 1]) {
          disc(group, side * 0.87, -0.065, -0.015, 0.245, 0.34);
          ring(group, side * 0.87, -0.065, 0.167, 0.207, 0.028);
          disc(group, side * 0.87, -0.065, 0.18, 0.178, 0.026, 'visor');
          disc(group, side * 0.87, -0.065, 0.198, 0.061, 0.018, 'secondary');
          box(group, side * 0.71, 0.12, -0.035, 0.22, 0.12, 0.24, 'flex');
        }
        break;
      case 'spine':
        box(group, 0, 0, 0.085, 0.22, 1.35, 0.12, 'joint');
        for (let i = 0; i < 8; i++)
          box(group, 0, 0.58 - i * 0.16, 0.015, 0.28, 0.08, 0.07, 'secondary', 0.018);
        break;
      case 'core':
        shell(group, 0, 0.06, -0.035, 0.7, 0.88, 0.46, 'flex');
        for (let i = 0; i < 6; i++)
          box(group, 0, -0.22 + i * 0.1, 0.196, 0.61 - i * 0.012, 0.025, 0.025, 'joint', 0.008);
        for (const side of [-1, 1])
          box(group, side * 0.285, 0.09, -0.15, 0.06, 0.51, 0.06, 'secondary', 0.02);
        break;
      case 'hips':
        shell(group, 0, 0.02, -0.015, 0.87, 0.35, 0.47, 'joint');
        for (const side of [-1, 1]) {
          shell(group, side * 0.32, 0, 0.04, 0.35, 0.33, 0.43, 'shell', 0.65);
          disc(group, side * 0.37, -0.19, 0.015, 0.165, 0.3);
        }
        break;
      case 'arm':
        for (const side of [-1, 1]) {
          const upper = shell(group, side * 1.01, 0.4, 0, 0.28, 0.67, 0.31, 'secondary');
          upper.rotation.z = side * 0.08;
          disc(group, side * 1.045, -0.035, 0, 0.143, 0.26);
          ring(group, side * 1.045, -0.035, 0.135, 0.114, 0.015);
          const forearm = shell(group, side * 1.09, -0.46, 0.01, 0.3, 0.75, 0.3);
          forearm.rotation.z = side * 0.04;
          for (let i = 0; i < 5; i++)
            box(group, side * 1.09, -0.29 - i * 0.065, 0.164, 0.13, 0.017, 0.012, 'joint', 0.004);
          box(group, side * 1.075, -0.72, -0.13, 0.08, 0.1, 0.025, 'secondary', 0.01);
        }
        break;
      case 'hands':
        for (const side of [-1, 1]) {
          const x = side * 1.12;
          disc(group, x, 0.05, 0.01, 0.085, 0.14, 'joint');
          box(group, x, -0.095, 0.035, 0.238, 0.24, 0.14, 'flex');
          box(group, x, -0.085, 0.12, 0.204, 0.19, 0.032, 'secondary', 0.03);
          // Four separately spaced, three-link fingers with curled distal pads.
          for (let i = 0; i < 4; i++) {
            const px = x + (i - 1.5) * 0.067,
              length = [0.22, 0.28, 0.26, 0.2][i];
            for (let j = 0; j < 3; j++) {
              const segment = length / 3,
                py = -0.235 - j * segment;
              disc(group, px, py + 0.025, 0.047 + j * 0.022, 0.026, 0.065, 'joint');
              const link = box(
                group,
                px,
                py - segment / 3,
                0.06 + j * 0.029,
                0.048,
                segment * 0.84,
                0.06,
                'secondary',
                0.015,
              );
              link.rotation.x = -0.12 - j * 0.18;
              if (j === 2)
                box(
                  group,
                  px,
                  py - segment * 0.6,
                  0.101 + j * 0.021,
                  0.041,
                  0.035,
                  0.03,
                  'flex',
                  0.01,
                );
            }
          }
          const thumb = new T.Group();
          thumb.position.set(x - side * 0.137, -0.14, 0.07);
          thumb.rotation.z = -side * 0.45;
          thumb.rotation.x = -0.3;
          group.add(thumb);
          for (let j = 0; j < 2; j++) {
            disc(thumb, 0, -j * 0.092, 0.014 + j * 0.02, 0.032, 0.07);
            box(
              thumb,
              0,
              -0.04 - j * 0.09,
              0.032 + j * 0.026,
              0.058,
              0.081,
              0.062,
              'secondary',
              0.02,
            );
          }
        }
        break;
      case 'legs':
        for (const side of [-1, 1]) {
          const x = side * 0.36;
          shell(group, x, 0.72, -0.015, 0.41, 1.07, 0.45);
          box(group, x + side * 0.155, 0.79, 0.02, 0.042, 0.63, 0.26, 'secondary', 0.016);
          disc(group, x, 0.065, 0, 0.169, 0.34);
          ring(group, x, 0.065, 0.18, 0.137, 0.018);
          box(group, x, 0.07, 0.215, 0.22, 0.18, 0.095, 'secondary', 0.05);
          shell(group, x, -0.58, -0.015, 0.32, 1.13, 0.33, 'secondary', 0.63);
          box(group, x, -0.54, -0.18, 0.16, 0.78, 0.065, 'joint');
          box(group, x + side * 0.065, -0.52, 0.157, 0.016, 0.69, 0.015, 'shell', 0.005);
          disc(group, x, -1.17, 0, 0.112, 0.23);
          box(group, x, -1.3, 0.13, 0.32, 0.17, 0.59, 'shell', 0.06);
          box(group, x, -1.377, 0.13, 0.33, 0.055, 0.61, 'flex', 0.018);
          box(group, x, -1.278, 0.28, 0.29, 0.017, 0.019, 'joint', 0.004);
        }
        break;
      case 'shield':
        box(group, 0, 0, -0.115, 0.11, 0.15, 0.018, 'joint', 0.015);
        box(group, 0, 0.015, -0.101, 0.048, 0.012, 0.01, 'sensor', 0.003);
        break;
    }
    const meshes: T.Mesh[] = [];
    group.traverse((o) => {
      if (o instanceof T.Mesh) {
        o.name = `${v.partId}-${meshes.length + 1}`;
        o.userData.partId = v.partId;
        meshes.push(o);
      }
    });
    registry.set(v.partId, {
      id: v.partId,
      domain: v.domain,
      label: v.label,
      group,
      meshes,
      assembled: group.position.clone(),
      color: v.color,
    });
  }
  const neck = add(decoration, new T.CylinderGeometry(0.12, 0.17, 0.3, 24), 0, 5.14, -0.02, 'flex');
  for (let i = 0; i < 4; i++)
    ring(decoration, 0, 5.02 + i * 0.062, -0.02, 0.132, 0.013, 'joint').rotation.x = Math.PI / 2;
  neck.userData.structural = true;
  add(decoration, new T.CylinderGeometry(0.24, 0.25, 0.16, 32), 0, 3.12, -0.015, 'secondary');
  return { robot, registry, decoration };
}
/** Identical geometry buffers; independent materials, transforms and capability registries. */
export function createRobotPair() {
  const a = createRobot(),
    robot = a.robot.clone(true),
    registry: PartRegistry = new Map();
  robot.traverse((o) => {
    if (o instanceof T.Mesh) {
      o.material = (o.material as T.MeshPhysicalMaterial).clone();
      const color =
        o.userData.partId === 'interface-hands' && o.userData.surface === 'secondary'
          ? '#626e72'
          : palettes.pearl[o.userData.surface as Surface];
      o.userData.baseColor = color;
      (o.material as T.MeshPhysicalMaterial).color.set(color);
    }
  });
  for (const part of a.registry.values()) {
    const group = robot.getObjectByName(part.id) as T.Group,
      meshes: T.Mesh[] = [];
    group.traverse((o) => {
      if (o instanceof T.Mesh) meshes.push(o);
    });
    registry.set(part.id, { ...part, group, meshes, assembled: part.assembled.clone() });
  }
  const b = { robot, registry, decoration: robot.getObjectByName('Structural details') as T.Group };
  for (const [host, item] of [
    ['host-a', a],
    ['host-b', b],
  ] as const)
    item.robot.traverse((o) => {
      o.userData.hostId = host;
    });
  return { a, b };
}
