import * as T from 'three';
import { visualMappings } from '../../data/visualMappings';
import type { PartRegistry } from '../partRegistry';
import { robotSpec as s, robotLandmarks, shellProfiles, U } from './robotSpec';
import {
  shellGeometry,
  engineeredShell,
  outlinePlate,
  jointDisc,
  taperedShell,
  rounded,
  footShell,
  shinShell,
} from './geometry/primitives';
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
    [-s.head.height * 0.494, s.head.lowerWidth * 0.86, s.head.depth * 0.51, 0.005],
    [-s.head.height * 0.43, s.head.lowerWidth, s.head.depth * 0.7, 0.005],
    [-s.head.height * 0.2, s.head.width * 0.89, s.head.depth * 0.91, 0.001],
    [s.head.height * 0.18, s.head.width, s.head.depth, -0.002],
    [s.head.height * 0.34, s.head.width * 0.95, s.head.depth * 0.96, -0.002],
    [s.head.height * 0.46, s.head.width * 0.66, s.head.depth * 0.7, -0.001],
    [s.head.height * 0.5, 0.001, 0.001],
  ] as const;
  add(parts.head, 'head', shellGeometry(headStations, 2.45), [0, 0, 0]);
  const visorGeometry = shellGeometry(headStations, 2.45, true);
  visorGeometry.scale(1.012, 1.012, 1.012);
  add(parts.eyes, 'head', visorGeometry, [0, 0, 0], 'visor');
  for (const sign of [-1, 1])
    add(
      parts.halo,
      'head',
      taperedShell(0.021, 0.002, 0.023, 0.8),
      [sign * s.head.width * 0.496, 0.009, -0.004],
      'joint',
    );
  add(
    parts.halo,
    'head',
    rounded(0.018, 0.001, 0.019, 0.0003),
    [0, s.head.height * 0.485, -0.01],
    'secondary',
  );
  add(
    parts.head,
    'neck',
    shellGeometry(
      [
        [-s.neck.height / 2, 0.056, 0.054, -0.006],
        [-s.neck.height * 0.25, 0.048, 0.048, -0.003],
        [s.neck.height * 0.26, s.neck.width, 0.042, 0],
        [s.neck.height / 2, 0.047, 0.047, 0.001],
      ],
      3.2,
    ),
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
        [-th / 2 + 0.0008, s.torso.waistWidth * 0.94, td * 0.78],
        [-th / 2 + 0.005, s.torso.waistWidth, td * 0.91],
        [-th * 0.5 + th * s.torso.lowerTaperStart, tw, td],
        [th * 0.08, tw, td, -0.001],
        [th * 0.29, s.torso.upperWidth, td * 0.97, -0.002],
        [th * 0.43, s.torso.topWidth * 1.1, td * 0.78, -0.001],
        [th / 2 - 0.001, s.torso.topWidth, td * 0.65],
        [th / 2, 0.001, 0.001],
      ],
      4.8,
      false,
      true,
      0.88,
    ),
    [0, 0, 0],
  );
  add(
    parts.spine,
    'torso',
    engineeredShell({
      length: th * 0.76,
      proximalWidth: 0.056,
      midWidth: 0.054,
      distalWidth: 0.048,
      depth: 0.012,
      edgeRadius: 0.003,
    }),
    [0, -0.008, -td * 0.56],
    'joint',
  );
  add(
    parts.core,
    'waist',
    engineeredShell({
      length: s.waist.height,
      proximalWidth: s.waist.width,
      midWidth: 0.047,
      distalWidth: 0.042,
      depth: s.waist.depth,
      edgeRadius: 0.003,
    }),
    [0, 0, 0],
    'joint',
  );
  const bridge = outlinePlate(
    [
      [-0.067, 0.02],
      [-0.035, 0.02],
      [-0.022, 0.002],
      [0.022, 0.002],
      [0.035, 0.02],
      [0.067, 0.02],
      [0.067, -0.024],
      [0.033, -0.024],
      [0.023, -0.013],
      [-0.023, -0.013],
      [-0.033, -0.024],
      [-0.067, -0.024],
    ],
    s.pelvis.depth * 0.73,
    0.003,
  );
  add(parts.hips, 'pelvis', bridge, [0, 0, 0], 'joint');
  for (const sign of [-1, 1]) {
    const housing = add(
      parts.hips,
      'pelvis',
      jointDisc(s.pelvis.hipRadius, s.pelvis.hipDepth),
      [sign * 0.072, 0, 0],
      'secondary',
    );
    housing.rotation.z = Math.PI / 2;
  }
  add(
    parts.shield,
    'torso',
    rounded(0.013, 0.019, 0.002, 0.003),
    [0, 0.046, td * 0.44 + 0.001],
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
          [-0.032, 0.024, 0.032],
          [-0.024, 0.05, 0.047],
          [0, 0.058, 0.054],
          [0.021, 0.052, 0.05],
          [0.027, 0.033, 0.034],
          [0.029, 0.001, 0.001],
        ],
        2.1,
      ),
      [0, 0, -0.005],
    );
    const upperLength = lm[`shoulder${side}`][1] - lm[`elbow${side}`][1];
    const upper = add(parts.arm, `upperArm_${side}`, engineeredShell(shellProfiles.upperArm), [
      sign * 0.009,
      -upperLength / 2,
      0,
    ]);
    upper.rotation.z = sign * Math.atan2(s.arm.elbowX - s.arm.shoulderX, upperLength);
    const lowerLength = lm[`elbow${side}`][1] - lm[`wrist${side}`][1];
    const lower = add(
      parts.arm,
      `forearm_${side}`,
      engineeredShell(shellProfiles.forearm),
      [sign * 0.01, -lowerLength / 2, 0.005],
      'secondary',
    );
    lower.rotation.z = sign * Math.atan2(s.arm.wristX - s.arm.elbowX, lowerLength);
    add(
      parts.hands,
      `hand_${side}`,
      engineeredShell({
        length: s.arm.palmLength,
        proximalWidth: s.arm.palmWidth * 0.89,
        midWidth: s.arm.palmWidth,
        distalWidth: s.arm.palmWidth * 0.96,
        depth: s.arm.palmDepth,
        edgeRadius: 0.003,
      }),
      [0, -s.arm.palmLength / 2, 0.002],
      'hand',
    );
    for (let finger = 0; finger < 4; finger++) {
      const length = s.arm.fingerLengths[finger],
        px = sign * (finger - 1.5) * s.arm.fingerSpacing;
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
        node.rotation.x = joint === 0 ? -0.08 : joint === 1 ? -0.12 : -0.09;
        parent.add(node);
        bones.set(name, node);
        add(
          parts.hands,
          name,
          engineeredShell({
            length: length * 0.326,
            proximalWidth: s.arm.fingerWidth * (1 - joint * 0.08),
            midWidth: s.arm.fingerWidth * (1 - joint * 0.08),
            distalWidth: s.arm.fingerWidth * (0.94 - joint * 0.08),
            depth: 0.011 * (1 - joint * 0.08),
            edgeRadius: 0.0014,
          }),
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
    add(parts.hands, thumb.name, taperedShell(0.03, 0.014, 0.015, 0.85), [0, -0.014, 0], 'hand');
    const thumbTip = new T.Group();
    thumbTip.name = `thumb_tip_${side}`;
    thumbTip.position.y = -U(0.03);
    thumbTip.rotation.z = sign * 0.22;
    thumb.add(thumbTip);
    bones.set(thumbTip.name, thumbTip);
    add(parts.hands, thumbTip.name, taperedShell(0.026, 0.012, 0.013, 0.8), [0, -0.012, 0], 'hand');
    add(parts.legs, `thigh_${side}`, engineeredShell(shellProfiles.thigh, 0.87), [
      0,
      -(s.leg.hipY - s.leg.kneeY) / 2,
      0,
    ]);
    const shinLength = shellProfiles.shin.length;
    add(parts.legs, `shin_${side}`, shinShell(shellProfiles.shin), [0, -shinLength / 2 - 0.008, 0]);
    add(
      parts.legs,
      `foot_${side}`,
      footShell(s.leg.footLength, s.leg.footWidth, s.leg.footHeight),
      [0, -s.leg.ankleY + s.leg.footHeight * 0.58, s.leg.footForward],
    );
  }
  createMechanicalAssembly(add, parts);
  createIndustrialDetails(add, parts, registry);
  for (const [side, sign] of [
    ['L', -1],
    ['R', 1],
  ] as const) {
    bones.get(`hand_${side}`)!.rotation.y = -sign * s.arm.palmInward;
    bones.get(`foot_${side}`)!.rotation.y = sign * 0.025;
  }
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
