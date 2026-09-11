import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { visualMappings } from '../data/visualMappings';
import type { PartRegistry } from './partRegistry';

/** Original, dimensionless concept body. Geometry is an interface, never a capability model. */
export function createRobot() {
  const robot = new T.Group();
  robot.name = 'Original ASI concept body';
  const decoration = new T.Group();
  decoration.name = 'Non-interactive structural details';
  robot.add(decoration);
  const registry: PartRegistry = new Map();
  const enamel = '#d94435',
    shell = '#e9ebe4',
    dark = '#202d31',
    joint = '#52636a',
    accent = '#75e5ed';
  const add = (
    group: T.Group,
    geometry: T.BufferGeometry,
    position: readonly number[],
    color = shell,
  ) => {
    const material = new T.MeshPhysicalMaterial({
      color,
      metalness: color === dark ? 0.72 : color === enamel ? 0.32 : 0.24,
      clearcoat: color === enamel ? 0.85 : 0.2,
      clearcoatRoughness: 0.24,
      roughness: color === dark ? 0.3 : color === enamel ? 0.25 : 0.38,
      emissive: color === accent ? accent : '#000000',
      emissiveIntensity: color === accent ? 0.5 : 0,
    });
    const mesh = new T.Mesh(geometry, material);
    mesh.position.fromArray(position);
    mesh.userData.baseColor = color;
    mesh.userData.finishPanel = color === enamel;
    mesh.userData.baseEmissive = color === accent ? accent : '#000000';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
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
    c = shell,
    r = 0.055,
  ) => add(g, new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 3, h / 3, d / 3)), [x, y, z], c);
  const plate = (
    g: T.Group,
    points: readonly (readonly [number, number])[],
    x: number,
    y: number,
    z: number,
    depth: number,
    c = shell,
    bevel = 0.035,
  ) => {
    const shape = new T.Shape();
    points.forEach(([px, py], i) => (i ? shape.lineTo(px, py) : shape.moveTo(px, py)));
    shape.closePath();
    return add(
      g,
      new T.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: bevel,
        bevelThickness: bevel,
      }),
      [x, y, z - depth / 2],
      c,
    );
  };
  const bearing = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    r: number,
    depth: number,
    c = joint,
  ) => {
    const mesh = add(g, new T.CylinderGeometry(r, r, depth, 32), [x, y, z], c);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  };
  const loft = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    stations: readonly (readonly [number, number, number])[],
    c = shell,
  ) => {
    const positions: number[] = [],
      indices: number[] = [],
      sides = 40;
    // Smooth rounded-rectangle sections create curved industrial housings.
    for (const [sy, width, depth] of stations)
      for (let j = 0; j <= sides; j++) {
        const theta = (j / sides) * Math.PI * 2,
          cos = Math.cos(theta),
          sin = Math.sin(theta);
        positions.push(
          (Math.sign(cos) * Math.abs(cos) ** 0.7 * width) / 2,
          sy,
          (Math.sign(sin) * Math.abs(sin) ** 0.7 * depth) / 2,
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
    return add(g, geometry, [x, y, z], c);
  };
  const taper = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    top: number,
    bottom: number,
    height: number,
    depth: number,
    c = shell,
  ) =>
    loft(
      g,
      x,
      y,
      z,
      [
        [-height / 2, 0, 0],
        [-height / 2, bottom * 0.65, depth * 0.65],
        [-height / 2 + 0.06, bottom + 0.07, depth],
        [-height * 0.12, (top + bottom) / 2 + 0.1, depth * 1.1],
        [height / 2 - 0.09, top + 0.05, depth],
        [height / 2, top * 0.8, depth * 0.78],
        [height / 2, 0, 0],
      ],
      c,
    );

  for (const v of visualMappings) {
    const group = new T.Group();
    group.name = v.partId;
    group.position.fromArray(v.anchor);
    robot.add(group);
    switch (v.shape) {
      case 'head':
        loft(
          group,
          0,
          0,
          -0.025,
          [
            [-0.44, 0, 0],
            [-0.43, 0.32, 0.36],
            [-0.32, 0.57, 0.54],
            [0.1, 0.76, 0.64],
            [0.32, 0.7, 0.6],
            [0.41, 0.5, 0.46],
            [0.43, 0, 0],
          ],
          enamel,
        );
        box(group, 0, -0.38, 0.235, 0.37, 0.075, 0.09, dark);
        box(group, 0, 0.05, -0.35, 0.24, 0.54, 0.06, joint);
        break;
      case 'halo':
        // A fitted crown and temple interface, not a floating halo. Stable part ID retained.
        box(group, 0, -0.012, 0.01, 0.62, 0.065, 0.49, shell, 0.02);
        for (const s of [-1, 1]) {
          box(group, s * 0.408, -0.2, 0.01, 0.075, 0.34, 0.34, joint, 0.03);
          box(group, s * 0.43, -0.17, 0.195, 0.027, 0.19, 0.025, accent, 0.008);
        }
        break;
      case 'eyes':
        plate(
          group,
          [
            [-0.28, 0.23],
            [0.28, 0.23],
            [0.31, 0.11],
            [0.24, -0.23],
            [-0.24, -0.23],
            [-0.31, 0.11],
          ],
          0,
          0,
          0,
          0.12,
          dark,
          0.045,
        );
        for (const x of [-0.135, 0.135])
          box(group, x, 0.03, 0.105, 0.11, 0.07, 0.025, accent, 0.025);
        box(group, 0, -0.11, 0.108, 0.16, 0.014, 0.025, joint, 0.004);
        break;
      case 'spine':
        box(group, 0, 0, -0.02, 0.19, 1.52, 0.16, dark);
        for (let i = 0; i < 6; i++)
          box(group, 0, 0.66 - i * 0.245, -0.1, 0.35, 0.15, 0.11, i === 0 ? accent : joint, 0.025);
        break;
      case 'chest':
        taper(group, 0, -0.03, -0.03, 1.35, 0.93, 0.93, 0.58, dark);
        for (const s of [-1, 1]) {
          const panel = plate(
            group,
            [
              [-0.03, 0.44],
              [0.56, 0.36],
              [0.7, 0.14],
              [0.53, -0.32],
              [0.13, -0.4],
              [-0.02, -0.2],
            ],
            0,
            0,
            0.25,
            0.2,
            enamel,
            0.06,
          );
          panel.scale.x = s;
          box(group, s * 0.34, 0.21, 0.4, 0.38, 0.16, 0.08, shell, 0.035);
          box(group, s * 0.14, -0.24, 0.395, 0.1, 0.1, 0.025, joint, 0.015);
          box(group, s * 0.39, 0.37, 0.405, 0.34, 0.035, 0.035, joint, 0.008);
          for (let i = 0; i < 3; i++)
            box(
              group,
              s * (0.53 - i * 0.012),
              -0.13 - i * 0.07,
              0.388,
              0.13,
              0.018,
              0.035,
              dark,
              0.005,
            );
        }
        break;
      case 'shoulders':
        for (const s of [-1, 1]) {
          bearing(group, s * 0.89, -0.05, 0, 0.24, 0.38, dark);
          const cap = box(group, s * 0.98, 0.035, 0.025, 0.44, 0.44, 0.52, enamel, 0.12);
          cap.rotation.z = s * 0.18;
          bearing(group, s * 1.02, -0.06, 0.285, 0.105, 0.045, joint);
          bearing(group, s * 1.02, -0.06, 0.312, 0.047, 0.025, dark);
        }
        break;
      case 'hips':
        taper(group, 0, 0.03, -0.02, 0.87, 0.65, 0.36, 0.5, dark);
        for (const s of [-1, 1]) {
          plate(
            group,
            [
              [-0.19, 0.22],
              [0.2, 0.16],
              [0.19, -0.22],
              [-0.09, -0.2],
            ],
            s * 0.28,
            0,
            0.2,
            0.16,
            shell,
            0.04,
          );
          bearing(group, s * 0.43, -0.17, 0, 0.2, 0.32, joint);
        }
        box(group, 0, 0.19, 0.32, 0.38, 0.038, 0.035, accent, 0.01);
        break;
      case 'legs':
        for (const s of [-1, 1]) {
          const x = s * 0.44;
          taper(group, x, 0.72, 0, 0.43, 0.32, 1.05, 0.43, enamel);
          box(group, x, 0.7, 0.26, 0.105, 0.6, 0.025, shell, 0.01);
          bearing(group, x, 0.08, 0.02, 0.185, 0.36, dark);
          box(group, x, 0.085, 0.24, 0.24, 0.21, 0.1, shell, 0.07);
          taper(group, x, -0.56, -0.025, 0.37, 0.23, 1.04, 0.36);
          box(group, x, -0.51, 0.19, 0.07, 0.65, 0.035, joint, 0.012);
          bearing(group, x, -1.14, 0.0, 0.13, 0.23, dark);
          box(group, x, -1.27, 0.15, 0.37, 0.2, 0.72, shell, 0.075);
          box(group, x, -1.365, 0.15, 0.38, 0.065, 0.74, dark, 0.025);
        }
        break;
      case 'hands':
        for (const s of [-1, 1]) {
          const x = s * 1.25;
          bearing(group, x, 0.12, 0, 0.105, 0.18, dark);
          box(group, x, -0.025, 0.03, 0.23, 0.26, 0.17, joint, 0.045);
          box(group, x, -0.01, 0.133, 0.19, 0.2, 0.04, shell, 0.025);
          for (let i = 0; i < 4; i++) {
            const px = x + (i - 1.5) * 0.06,
              length = i === 0 || i === 3 ? 0.19 : 0.24;
            box(group, px, -0.2, 0.052, 0.046, 0.12, 0.067, shell, 0.016);
            bearing(group, px, -0.255, 0.07, 0.025, 0.063, dark);
            box(group, px, -0.255 - length / 3, 0.085, 0.044, length * 0.6, 0.063, shell, 0.016);
          }
          const thumb = box(group, x - s * 0.15, -0.08, 0.09, 0.066, 0.19, 0.075, shell, 0.024);
          thumb.rotation.z = -s * 0.38;
        }
        break;
      case 'shield':
        plate(
          group,
          [
            [-0.08, 0.15],
            [0.08, 0.15],
            [0.075, -0.08],
            [0, -0.15],
            [-0.075, -0.08],
          ],
          0,
          0,
          0,
          0.055,
          accent,
          0.018,
        );
        box(group, 0, 0.025, 0.048, 0.016, 0.13, 0.015, dark, 0.004);
        break;
      case 'core':
        taper(group, 0, 0.02, -0.03, 0.84, 0.66, 0.91, 0.47, dark);
        taper(group, 0, 0.015, 0.2, 0.54, 0.4, 0.67, 0.13, shell);
        for (const x of [-0.35, 0.35]) {
          box(group, x, 0, 0.22, 0.08, 0.52, 0.1, enamel, 0.025);
          box(group, x, 0.12, 0.29, 0.018, 0.19, 0.022, accent, 0.006);
        }
        break;
      case 'arm':
        for (const s of [-1, 1]) {
          const upper = taper(group, s * 1.12, 0.37, -0.005, 0.34, 0.25, 0.68, 0.36);
          upper.rotation.z = s * 0.1;
          bearing(group, s * 1.18, -0.045, 0, 0.15, 0.29, dark);
          const forearm = taper(group, s * 1.225, -0.45, 0.015, 0.3, 0.2, 0.61, 0.34, enamel);
          forearm.rotation.z = s * 0.04;
          box(group, s * 1.23, -0.4, 0.195, 0.065, 0.33, 0.035, joint, 0.01);
        }
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
  add(decoration, new T.CylinderGeometry(0.15, 0.21, 0.32, 32), [0, 5.12, -0.025], dark);
  box(decoration, 0, 3.08, -0.03, 0.5, 0.22, 0.35, joint);
  return { robot, registry, decoration };
}
