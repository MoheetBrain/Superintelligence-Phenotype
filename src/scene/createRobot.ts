import * as T from 'three';
import { visualMappings } from '../data/visualMappings';
import type { PartRegistry } from './partRegistry';
export function createRobot() {
  const robot = new T.Group();
  robot.name = 'ASI Atlas — original procedural robot';
  const registry: PartRegistry = new Map();
  const decoration = new T.Group();
  decoration.name = 'nonselectable-structure';
  robot.add(decoration);
  const metal = '#43534e',
    shell = '#c9d4cf';
  const add = (
    group: T.Group,
    geometry: T.BufferGeometry,
    pos: readonly number[],
    color: string,
    scale?: readonly number[],
  ) => {
    const mesh = new T.Mesh(
      geometry,
      new T.MeshStandardMaterial({ color, metalness: 0.52, roughness: 0.32 }),
    );
    mesh.position.fromArray(pos);
    if (scale) mesh.scale.fromArray(scale);
    mesh.userData.baseColor = color;
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
  ) => add(g, new T.BoxGeometry(w, h, d), [x, y, z], c);
  const ball = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    r: number,
    c = metal,
    scale?: readonly number[],
  ) => add(g, new T.SphereGeometry(r, 24, 16), [x, y, z], c, scale);
  const capsule = (g: T.Group, x: number, y: number, z: number, r: number, h: number, c = shell) =>
    add(g, new T.CapsuleGeometry(r, h, 6, 16), [x, y, z], c);
  const ring = (
    g: T.Group,
    x: number,
    y: number,
    z: number,
    r: number,
    tube: number,
    c: string,
  ) => {
    const m = add(g, new T.TorusGeometry(r, tube, 10, 64), [x, y, z], c);
    m.rotation.x = Math.PI / 2;
    return m;
  };
  for (const v of visualMappings) {
    const group = new T.Group();
    group.name = v.partId;
    group.position.fromArray(v.anchor);
    robot.add(group);
    switch (v.shape) {
      case 'head':
        ball(group, 0, 0, 0, 0.59, v.color, [0.88, 1, 0.85]);
        box(group, 0, -0.25, -0.06, 0.79, 0.38, 0.68);
        break;
      case 'halo':
        ring(group, 0, 0, 0, 0.73, 0.065, v.color);
        for (const x of [-0.57, 0.57]) capsule(group, x, -0.14, 0, 0.046, 0.22, v.color);
        break;
      case 'eyes':
        box(group, 0, 0, 0, 0.72, 0.15, 0.11, metal);
        for (const x of [-0.21, 0.21]) ball(group, x, 0, 0.075, 0.074, '#b2ead7', [1, 0.5, 0.6]);
        break;
      case 'spine':
        for (let i = 0; i < 6; i++) box(group, 0, 0.69 - i * 0.25, 0, 0.4, 0.18, 0.22, v.color);
        capsule(group, 0, 0, -0.12, 0.09, 1.4, metal);
        break;
      case 'chest':
        ball(group, 0, 0, -0.05, 0.8, v.color, [1.15, 0.72, 0.62]);
        box(group, 0, -0.33, 0, 1.25, 0.44, 0.65);
        for (const x of [-0.42, 0.42]) box(group, x, 0.12, 0.44, 0.25, 0.23, 0.08, metal);
        break;
      case 'shoulders':
        for (const x of [-1.03, 1.03]) {
          ball(group, x, 0, 0, 0.29, metal);
          ball(group, x, -0.08, 0.02, 0.34, v.color, [1.15, 0.8, 1]);
        }
        break;
      case 'hips':
        box(group, 0, 0, 0, 1.09, 0.44, 0.63, v.color);
        for (const x of [-0.39, 0.39]) ball(group, x, -0.18, 0, 0.26, metal);
        box(group, 0, 0.05, 0.34, 0.22, 0.2, 0.08, metal);
        break;
      case 'legs':
        for (const x of [-0.4, 0.4]) {
          capsule(group, x, 0.56, 0, 0.22, 0.65, v.color);
          ball(group, x, -0.02, 0.02, 0.23, metal);
          capsule(group, x, -0.56, 0, 0.19, 0.63, v.color);
          box(group, x, -1.12, 0.13, 0.47, 0.23, 0.8, v.color);
          box(group, x, 0.56, 0.2, 0.12, 0.52, 0.05, metal);
        }
        break;
      case 'hands':
        for (const x of [-1.37, 1.37]) {
          ball(group, x, 0.1, 0, 0.17, metal);
          box(group, x, -0.1, 0.04, 0.25, 0.31, 0.21, v.color);
          for (let i = 0; i < 3; i++)
            capsule(group, x - 0.08 + i * 0.08, -0.33, 0.06, 0.034, 0.16, v.color);
          capsule(group, x + Math.sign(x) * 0.17, -0.08, 0.1, 0.045, 0.12, v.color);
        }
        break;
      case 'shield': {
        const m = add(group, new T.CylinderGeometry(0.24, 0.24, 0.095, 6), [0, 0, 0], v.color);
        m.rotation.x = Math.PI / 2;
        box(group, 0, 0, 0.07, 0.035, 0.17, 0.03, metal);
        break;
      }
      case 'core':
        capsule(group, 0, 0, 0, 0.31, 0.53, metal);
        for (const y of [-0.34, -0.14, 0.06, 0.26]) ring(group, 0, y, 0, 0.34, 0.053, v.color);
        break;
      case 'arm':
        for (const x of [-1.28, 1.28]) {
          capsule(group, x, 0.3, 0, 0.19, 0.38, v.color);
          ball(group, x, -0.08, 0, 0.2, metal);
          capsule(group, x + Math.sign(x) * 0.045, -0.41, 0.03, 0.17, 0.34, v.color);
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
  capsule(decoration, 0, 4.98, 0, 0.17, 0.3, metal);
  for (const y of [3.03, 3.84]) ring(decoration, 0, y, 0, 0.4, 0.055, metal);
  return { robot, registry, decoration };
}
