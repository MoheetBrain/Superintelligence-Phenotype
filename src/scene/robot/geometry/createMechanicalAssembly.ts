import * as T from 'three';
import { robotSpec as s, shellProfiles, U } from '../robotSpec';
import { jointDisc, rounded, engineeredShell, outlinePlate, shellGeometry } from './primitives';
import type { Surface } from '../materials/materialLibrary';
export type AddMesh = (
  part: string,
  bone: string,
  geometry: T.BufferGeometry,
  position: readonly number[],
  surface?: Surface,
  stage?: number,
) => T.Mesh;

export function createMechanicalAssembly(add: AddMesh, parts: Record<string, string>) {
  function actuator(
    part: string,
    bone: string,
    r: number,
    d: number,
    p: readonly number[],
    surface: Surface = 'joint',
    axis: 'x' | 'y' | 'z' = 'x',
  ) {
    const mesh = add(part, bone, jointDisc(r, d), p, surface, 2);
    if (axis === 'x') mesh.rotation.z = Math.PI / 2;
    if (axis === 'z') mesh.rotation.x = Math.PI / 2;
    return mesh;
  }
  actuator(parts.core, 'waist', 0.03, 0.009, [0, 0.019, 0], 'joint', 'y');
  actuator(parts.core, 'waist', 0.024, 0.01, [0, -0.018, 0], 'joint', 'y');
  // Narrow pedestal and side links leave open space around the waist drive.
  add(
    parts.core,
    'waist',
    outlinePlate(
      [
        [-0.024, -0.009],
        [-0.013, -0.024],
        [0.013, -0.024],
        [0.024, -0.009],
        [0.019, 0.005],
        [-0.019, 0.005],
      ],
      0.043,
      0.002,
    ),
    [0, -0.011, -0.004],
    'joint',
    2,
  );
  for (const sign of [-1, 1]) {
    const strut = add(
      parts.core,
      'waist',
      rounded(s.waist.strutWidth, 0.047, 0.004, 0.001),
      [sign * 0.039, 0.016, 0.008],
      'joint',
      2,
    );
    strut.rotation.z = -sign * 0.15;
  }
  for (const [side, sign] of [
    ['L', -1],
    ['R', 1],
  ] as const) {
    const shoulder = `shoulder_${side}`;
    actuator(parts.shoulders, shoulder, 0.024, 0.037, [-sign * 0.023, 0, -0.004], 'joint');
    const collar = actuator(
      parts.shoulders,
      shoulder,
      0.027,
      0.025,
      [sign * 0.003, 0, 0.008],
      'shell',
      'z',
    );
    collar.rotation.y = sign * 0.45;
    const face = actuator(
      parts.shoulders,
      shoulder,
      0.0215,
      0.0035,
      [sign * 0.011, 0, 0.021],
      'joint',
      'z',
    );
    face.rotation.y = sign * 0.45;
    // Side cavity is visible in the supplied three-quarter photographs.
    // Its hidden rear continuation is a minimal inferred structural surface.
    const shape = new T.Shape();
    shape.absellipse(0, 0, 0.044, 0.085, 0, Math.PI * 2, false, 0);
    const hole = new T.Path();
    hole.absellipse(0, 0.05, 0.027, 0.029, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
    const plate = new T.ExtrudeGeometry(shape, {
      depth: 0.004,
      bevelEnabled: true,
      bevelSize: 0.0015,
      bevelThickness: 0.001,
      bevelSegments: 2,
      steps: 1,
      curveSegments: 24,
    });
    plate.scale(U(1), U(1), U(1));
    plate.rotateY((sign * Math.PI) / 2);
    add(parts.chest, 'torso', plate, [sign * 0.067, 0.01, -0.01], 'flex', 2);
    const rim = new T.Shape();
    rim.absellipse(0, 0, 0.046, 0.088, 0, Math.PI * 2, false, 0);
    const opening = new T.Path();
    opening.absellipse(0, 0, 0.042, 0.082, 0, Math.PI * 2, true, 0);
    rim.holes.push(opening);
    const rimGeometry = new T.ExtrudeGeometry(rim, {
      depth: 0.002,
      bevelEnabled: true,
      bevelSize: 0.001,
      bevelThickness: 0.001,
      bevelSegments: 2,
      curveSegments: 24,
    });
    rimGeometry.scale(U(1), U(1), U(1));
    rimGeometry.rotateY((sign * Math.PI) / 2);
    add(parts.chest, 'torso', rimGeometry, [sign * 0.07, 0.01, -0.01], 'shell', 2);

    const upperLength = s.arm.shoulderY - s.arm.elbowY;
    const upperCore = add(
      parts.arm,
      `upperArm_${side}`,
      engineeredShell({
        ...shellProfiles.upperArm,
        length: upperLength - 0.009,
        proximalWidth: 0.031,
        midWidth: 0.029,
        distalWidth: 0.026,
        depth: 0.033,
        edgeRadius: 0.002,
      }),
      [sign * 0.009, -upperLength / 2, -0.013],
      'joint',
      2,
    );
    upperCore.rotation.z = sign * Math.atan2(s.arm.elbowX - s.arm.shoulderX, upperLength);
    const elbow = `elbow_${side}`;
    actuator(parts.arm, elbow, s.arm.elbowRadius, 0.044, [0, 0, 0], 'joint');
    for (const edge of [-1, 1]) {
      actuator(parts.arm, elbow, 0.021, 0.006, [edge * 0.024, 0, 0], 'secondary');
      actuator(parts.arm, elbow, 0.014, 0.0018, [edge * 0.0275, 0, 0], 'joint');
    }
    add(
      parts.arm,
      elbow,
      outlinePlate(
        [
          [-0.018, 0.008],
          [-0.011, 0.016],
          [0.011, 0.016],
          [0.018, 0.008],
          [0.015, -0.012],
          [-0.015, -0.012],
        ],
        0.011,
        0.002,
      ),
      [0, 0, -0.019],
      'joint',
      2,
    );
    actuator(parts.arm, elbow, 0.018, 0.012, [0, -0.016, 0.003], 'secondary', 'y');
    const lowerLength = s.arm.elbowY - s.arm.wristY;
    const lowerCore = add(
      parts.arm,
      `forearm_${side}`,
      engineeredShell({
        ...shellProfiles.forearm,
        length: lowerLength,
        proximalWidth: 0.026,
        midWidth: 0.024,
        distalWidth: 0.021,
        depth: 0.027,
        edgeRadius: 0.002,
      }),
      [sign * 0.011, -lowerLength / 2, -0.005],
      'joint',
      2,
    );
    lowerCore.rotation.z = sign * Math.atan2(s.arm.wristX - s.arm.elbowX, lowerLength);

    actuator(parts.hands, `wrist_${side}`, s.arm.wristRadius, 0.031, [0, 0, 0], 'joint');
    const hand = `hand_${side}`;
    add(
      parts.hands,
      hand,
      outlinePlate(
        [
          [-0.018, 0.003],
          [-0.019, -0.018],
          [0.019, -0.018],
          [0.018, 0.003],
        ],
        0.012,
        0.0012,
        [
          [-0.01, -0.002],
          [0.01, -0.002],
          [0.01, -0.011],
          [-0.01, -0.011],
        ],
      ),
      [0, -0.001, 0.008],
      'hand',
      2,
    );
    for (let finger = 0; finger < 4; finger++)
      for (let j = 0; j < 3; j++)
        actuator(
          parts.hands,
          `finger_${side}_${finger}_${j}`,
          0.0048,
          0.009,
          [0, -0.001, 0],
          'joint',
        );
    actuator(parts.hands, `thumb_${side}`, 0.006, 0.013, [0, 0, 0], 'joint');
    actuator(parts.hands, `thumb_tip_${side}`, 0.0055, 0.011, [0, 0, 0], 'joint');

    actuator(parts.hips, 'pelvis', 0.025, 0.003, [sign * 0.101, 0, 0], 'joint');
    actuator(parts.hips, `hip_${side}`, 0.027, 0.042, [0, 0.001, -0.001], 'joint', 'y');
    add(
      parts.hips,
      `hip_${side}`,
      outlinePlate(
        [
          [-0.024, 0.014],
          [-0.017, -0.025],
          [0.017, -0.025],
          [0.024, 0.014],
        ],
        0.043,
        0.002,
      ),
      [0, -0.001, -0.009],
      'joint',
      2,
    );
    add(
      parts.legs,
      `thigh_${side}`,
      shellGeometry(
        [
          [-0.02, 0.078, 0.081],
          [-0.018, 0.08, 0.083],
          [0.018, 0.08, 0.083],
          [0.02, 0.076, 0.08],
        ],
        4.2,
        false,
        false,
        0.87,
      ),
      [0, -0.042, 0],
      'secondary',
      2,
    );
    add(
      parts.legs,
      `thigh_${side}`,
      engineeredShell({
        length: 0.136,
        proximalWidth: 0.037,
        midWidth: 0.031,
        distalWidth: 0.027,
        depth: 0.034,
        edgeRadius: 0.002,
      }),
      [0, -0.091, -0.029],
      'joint',
      2,
    );
    const knee = `knee_${side}`;
    actuator(parts.legs, knee, 0.022, 0.057, [0, 0, -0.004], 'joint');
    actuator(parts.legs, knee, 0.026, 0.006, [sign * 0.032, 0, -0.004], 'secondary');
    actuator(parts.legs, knee, 0.02, 0.002, [sign * 0.036, 0, -0.004], 'joint');
    add(
      parts.legs,
      knee,
      outlinePlate(
        [
          [-0.021, 0.011],
          [0.021, 0.011],
          [0.019, -0.01],
          [-0.019, -0.01],
        ],
        0.012,
        0.0015,
      ),
      [0, 0, 0.014],
      'joint',
      2,
    );
    actuator(parts.legs, `ankle_${side}`, 0.018, s.leg.ankleWidth, [0, 0, 0], 'joint');
    // Minimal matte inner wall behind the open ankle hem. This closes the view
    // through the calf without inventing an unseen drive mechanism.
    add(
      parts.legs,
      `shin_${side}`,
      new T.PlaneGeometry(U(0.033), U(0.037)),
      [0, s.leg.ankleY - s.leg.kneeY + 0.02, -0.016],
      'flex',
      2,
    );
    for (const edge of [-1, 1]) {
      const link = add(
        parts.legs,
        `ankle_${side}`,
        rounded(0.006, 0.038, 0.013, 0.002),
        [edge * 0.014, -0.017, -0.001],
        'secondary',
        2,
      );
      link.rotation.x = -0.25;
    }
    // Heel cage around an open ankle pocket; unseen drive internals are omitted.
    const heel = outlinePlate(
      [
        [-0.024, -0.019],
        [0.024, -0.019],
        [0.024, 0.012],
        [0.018, 0.018],
        [-0.018, 0.018],
        [-0.024, 0.012],
      ],
      0.019,
      0.002,
      [
        [-0.015, -0.01],
        [-0.015, 0.01],
        [0.015, 0.01],
        [0.015, -0.01],
      ],
    );
    heel.rotateX(-Math.PI / 2);
    add(parts.legs, `foot_${side}`, heel, [0, -s.leg.ankleY + 0.028, -0.004], 'joint', 2);
  }
}
