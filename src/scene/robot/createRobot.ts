import * as T from 'three';
import { visualMappings } from '../../data/visualMappings';
import type { PartRegistry } from '../partRegistry';
import { robotSpec as s, robotLandmarks, U } from './robotSpec';
import { shellGeometry, taperedShell, rounded, footShell } from './geometry/primitives';
import { createMaterial, palette, type Surface } from './materials/materialLibrary';
import { createRobotRig } from './rig/createRobotRig';
import { createMechanicalAssembly } from './geometry/createMechanicalAssembly';
import { createIndustrialDetails } from './geometry/createIndustrialDetails';

export function createRobot() {
  const robot = new T.Group();
  robot.name = 'Atlas Humanoid';
  const { rig, bones } = createRobotRig();
  robot.add(rig);
  const decoration = new T.Group();
  decoration.name = 'Structural details';
  robot.add(decoration);
  const registry: PartRegistry = new Map(),
    materials = new Map<string, T.MeshPhysicalMaterial>();
  for (const v of visualMappings) {
    const group = new T.Group();
    group.name = v.partId;
    robot.add(group);
    registry.set(v.partId, {
      id: v.partId,
      domain: v.domain,
      label: v.label,
      group,
      meshes: [],
      assembled: new T.Vector3(),
      color: v.color,
    });
  }
  const parts = Object.fromEntries(visualMappings.map((v) => [v.shape, v.partId]));
  function add(
    part: string,
    bone: string,
    geometry: T.BufferGeometry,
    position: readonly number[],
    surface: Surface = 'shell',
    stage = 1,
  ) {
    const key = `${part}:${surface}`;
    if (!materials.has(key)) materials.set(key, createMaterial(surface));
    const mesh = new T.Mesh(geometry, materials.get(key));
    mesh.name = `${part}-${registry.get(part)!.meshes.length}`;
    mesh.position.set(...(position.map(U) as [number, number, number]));
    Object.assign(mesh.userData, {
      partId: part,
      surface,
      stage,
      baseColor: palette.graphite[surface],
      baseEmissive: surface === 'sensor' ? palette.graphite.sensor : '#000000',
    });
    mesh.castShadow = mesh.receiveShadow = true;
    bones.get(bone)!.add(mesh);
    registry.get(part)!.meshes.push(mesh);
    return mesh;
  }
  const headStations = [
    [-s.head.height * 0.5, 0.001, 0.001],
    [-s.head.height * 0.46, s.head.width * 0.56, s.head.depth * 0.58],
    [-s.head.height * 0.32, s.head.width * 0.8, s.head.depth * 0.84],
    [-s.head.height * 0.04, s.head.width * 0.99, s.head.depth],
    [s.head.height * 0.2, s.head.width, s.head.depth * 0.98],
    [s.head.height * 0.38, s.head.width * 0.85, s.head.depth * 0.84],
    [s.head.height * 0.48, s.head.width * 0.45, s.head.depth * 0.44],
    [s.head.height * 0.5, 0.001, 0.001],
  ] as const;
  add(parts.head, 'head', shellGeometry(headStations, 2.08), [0, 0, 0]);
  const visorGeometry = shellGeometry(headStations, 2.08, true);
  visorGeometry.scale(1.012, 1.012, 1.012);
  add(parts.eyes, 'head', visorGeometry, [0, 0, 0], 'visor');
  for (const sign of [-1, 1])
    add(
      parts.halo,
      'head',
      taperedShell(0.023, 0.008, 0.034, 0.8),
      [sign * s.head.width * 0.488, 0.011, -0.003],
      'joint',
    );
  add(
    parts.halo,
    'head',
    rounded(0.028, 0.0015, 0.03, 0.0006),
    [0, s.head.height * 0.495, -0.003],
    'secondary',
  );
  add(
    parts.head,
    'neck',
    taperedShell(s.neck.height, s.neck.width, 0.041, 0.82, 2.2),
    [0, 0, -0.003],
    'flex',
  );
  const th = s.torso.height,
    tw = s.torso.chestWidth,
    td = s.torso.depth;
  add(
    parts.chest,
    'torso',
    shellGeometry(
      [
        [-th / 2, 0.001, 0.001],
        [-th / 2 + 0.006, s.torso.waistWidth * 0.76, td * 0.67],
        [-th / 2 + 0.017, s.torso.waistWidth, td * 0.88],
        [-th * 0.23, tw * 0.97, td],
        [th * 0.1, tw, td],
        [th * 0.29, tw * 0.92, td * 0.97],
        [th * 0.43, tw * 0.72, td * 0.85],
        [th / 2 - 0.002, tw * 0.56, td * 0.65],
        [th / 2, 0.001, 0.001],
      ],
      2.6,
    ),
    [0, 0, 0],
  );
  add(
    parts.spine,
    'torso',
    taperedShell(th * 0.84, 0.047, 0.018, 0.84, 3),
    [0, -0.004, -td * 0.5],
    'joint',
  );
  add(
    parts.core,
    'waist',
    taperedShell(s.waist.height, s.waist.width, s.waist.depth, 0.7, 2.3),
    [0, 0, 0],
    'joint',
  );
  const beam = taperedShell(s.pelvis.width, s.pelvis.height, s.pelvis.depth, 0.94, 2.8);
  beam.rotateZ(Math.PI / 2);
  add(parts.hips, 'pelvis', beam, [0, 0, 0], 'joint');
  add(
    parts.shield,
    'torso',
    rounded(0.013, 0.019, 0.002, 0.003),
    [0, 0.046, td * 0.5 + 0.001],
    'joint',
  );
  const lm = robotLandmarks();
  for (const [side, sign] of [
    ['L', -1],
    ['R', 1],
  ] as const) {
    add(
      parts.shoulders,
      `shoulder_${side}`,
      shellGeometry(
        [
          [-0.035, 0.028, 0.033],
          [-0.024, 0.049, 0.054],
          [0, 0.062, 0.062],
          [0.022, 0.055, 0.057],
          [0.03, 0.027, 0.03],
          [0.031, 0.001, 0.001],
        ],
        2.1,
      ),
      [0, 0, 0],
    );
    const upperLength = lm[`shoulder${side}`][1] - lm[`elbow${side}`][1];
    const upper = add(
      parts.arm,
      `upperArm_${side}`,
      taperedShell(upperLength - 0.048, s.arm.upperWidth, s.arm.upperDepth, 0.78),
      [sign * 0.009, -upperLength / 2, 0],
    );
    upper.rotation.z = sign * 0.115;
    const lowerLength = lm[`elbow${side}`][1] - lm[`wrist${side}`][1];
    const lower = add(
      parts.arm,
      `forearm_${side}`,
      taperedShell(
        lowerLength - 0.031,
        s.arm.proximalForearmWidth,
        s.arm.forearmDepth,
        s.arm.distalForearmWidth / s.arm.proximalForearmWidth,
        2.9,
      ),
      [sign * 0.01, -lowerLength / 2, 0.005],
      'secondary',
    );
    lower.rotation.z = sign * 0.115;
    add(
      parts.hands,
      `hand_${side}`,
      taperedShell(s.arm.palmLength, s.arm.palmWidth, s.arm.palmDepth, 0.88, 3),
      [0, -s.arm.palmLength / 2, 0.002],
      'hand',
    );
    for (let finger = 0; finger < 4; finger++) {
      const length = s.arm.fingerLengths[finger],
        px = sign * (finger - 1.5) * 0.0107;
      let parent = bones.get(`hand_${side}`)!;
      for (let joint = 0; joint < 3; joint++) {
        const name = `finger_${side}_${finger}_${joint}`,
          node = new T.Group();
        node.name = name;
        node.position.set(
          joint === 0 ? U(px) : 0,
          joint === 0 ? -U(s.arm.palmLength * 0.94) : -U(length * 0.34),
          0,
        );
        node.rotation.x = joint === 0 ? -0.07 : -0.14;
        parent.add(node);
        bones.set(name, node);
        add(
          parts.hands,
          name,
          taperedShell(
            length * 0.315,
            s.arm.fingerWidth * (1 - joint * 0.09),
            0.011 * (1 - joint * 0.08),
            0.85,
            2.5,
          ),
          [0, -length * 0.17, 0],
          'hand',
        );
        parent = node;
      }
    }
    const thumb = new T.Group();
    thumb.name = `thumb_${side}`;
    thumb.position.set(U(-sign * s.arm.palmWidth * 0.43), -U(0.018), U(0.005));
    thumb.rotation.z = -sign * 0.46;
    thumb.rotation.x = -0.25;
    bones.get(`hand_${side}`)!.add(thumb);
    bones.set(thumb.name, thumb);
    add(parts.hands, thumb.name, taperedShell(0.025, 0.013, 0.015, 0.85), [0, -0.012, 0], 'hand');
    const thumbTip = new T.Group();
    thumbTip.name = `thumb_tip_${side}`;
    thumbTip.position.y = -U(0.024);
    thumbTip.rotation.z = sign * 0.22;
    thumb.add(thumbTip);
    bones.set(thumbTip.name, thumbTip);
    add(parts.hands, thumbTip.name, taperedShell(0.023, 0.011, 0.013, 0.8), [0, -0.011, 0], 'hand');
    const thighLength = s.leg.hipY - s.leg.kneeY - 0.04;
    add(
      parts.legs,
      `thigh_${side}`,
      taperedShell(thighLength, s.leg.thighWidth, s.leg.thighDepth, 0.77, 2.8),
      [0, -(s.leg.hipY - s.leg.kneeY) / 2, 0],
    );
    const shinLength = s.leg.kneeY - s.leg.ankleY - 0.025;
    add(
      parts.legs,
      `shin_${side}`,
      shellGeometry(
        [
          [-shinLength, 0.001, 0.001],
          [-shinLength + 0.005, s.leg.distalShinWidth * 0.8, 0.027],
          [-shinLength + 0.02, s.leg.distalShinWidth, 0.038, -0.002],
          [-shinLength * 0.4, s.leg.proximalShinWidth * 0.87, s.leg.shinDepth * 0.9, -0.006],
          [-shinLength * 0.12, s.leg.proximalShinWidth, s.leg.shinDepth, -0.004],
          [-0.004, s.leg.proximalShinWidth * 0.85, 0.047],
          [0, 0.001, 0.001],
        ],
        3.0,
      ),
      [0, -0.012, 0],
    );
    add(
      parts.legs,
      `foot_${side}`,
      footShell(s.leg.footLength, s.leg.footWidth, s.leg.footHeight),
      [0, -s.leg.ankleY + s.leg.footHeight * 0.58, s.leg.footForward],
    );
  }
  createMechanicalAssembly(add, parts);
  createIndustrialDetails(add, parts, registry);
  robot.updateMatrixWorld(true);
  for (const p of registry.values()) {
    const bounds = new T.Box3();
    p.meshes.forEach((mesh) => bounds.union(new T.Box3().setFromObject(mesh)));
    p.assembled.copy(bounds.getCenter(new T.Vector3()));
    p.group.position.copy(p.assembled);
    const proxy = new T.Mesh(
      new T.BoxGeometry(...bounds.getSize(new T.Vector3()).toArray()),
      new T.MeshBasicMaterial(),
    );
    proxy.name = `${p.id}-bounds`;
    proxy.visible = false;
    proxy.userData.boundsOnly = true;
    p.group.add(proxy);
    p.group.updateMatrixWorld(true);
    for (const mesh of p.meshes) {
      mesh.userData.rigParent = mesh.parent!.name;
      mesh.userData.restLocal = mesh.matrix.toArray();
      mesh.userData.restPart = new T.Matrix4()
        .copy(p.group.matrixWorld)
        .invert()
        .multiply(mesh.matrixWorld)
        .toArray();
    }
  }
  return { robot, registry, decoration, rig, bones };
}
export type AtlasRobot = ReturnType<typeof createRobot>;
/** The rig owns visuals when assembled. Separation reparents them into the
 * concept containers; returning restores the exact joint-relative transforms. */
export function syncRobotPresentation(item: AtlasRobot, separated: boolean) {
  for (const p of item.registry.values())
    for (const mesh of p.meshes) {
      const parent = separated ? p.group : item.bones.get(mesh.userData.rigParent)!;
      if (mesh.parent !== parent) {
        parent.add(mesh);
        new T.Matrix4()
          .fromArray(separated ? mesh.userData.restPart : mesh.userData.restLocal)
          .decompose(mesh.position, mesh.quaternion, mesh.scale);
      }
      mesh.visible = p.group.visible;
    }
}
export function createRobotPair() {
  const a = createRobot(),
    robot = a.robot.clone(true),
    registry: PartRegistry = new Map(),
    bones = new Map<string, T.Group>();
  const materialClones = new Map<string, T.MeshPhysicalMaterial>();
  robot.traverse((o) => {
    if (o instanceof T.Group && a.bones.has(o.name)) bones.set(o.name, o);
    if (o instanceof T.Mesh && !o.userData.boundsOnly) {
      const key = `${o.userData.partId}:${o.userData.surface}`;
      if (!materialClones.has(key))
        materialClones.set(key, createMaterial(o.userData.surface, 'pearl'));
      o.material = materialClones.get(key)!;
      o.userData.baseColor = palette.pearl[o.userData.surface as Surface];
    }
  });
  for (const [id, p] of a.registry) {
    const meshes = p.meshes.map((mesh) => robot.getObjectByName(mesh.name) as T.Mesh);
    registry.set(id, {
      ...p,
      group: robot.getObjectByName(id) as T.Group,
      meshes,
      assembled: p.assembled.clone(),
    });
  }
  const b = {
    robot,
    registry,
    bones,
    rig: robot.getObjectByName('robot-rig') as T.Group,
    decoration: robot.getObjectByName('Structural details') as T.Group,
  };
  for (const [id, item] of [
    ['host-a', a],
    ['host-b', b],
  ] as const)
    item.robot.traverse((o) => (o.userData.hostId = id));
  return { a, b };
}
