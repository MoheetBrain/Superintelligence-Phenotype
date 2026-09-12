import * as T from 'three';
import { robotSpec as s, U } from '../robotSpec';
import { jointDisc, taperedShell, rounded } from './primitives';
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
  actuator(parts.core, 'waist', s.waist.width * 0.49, 0.016, [0, -0.019, 0], 'joint', 'y');
  actuator(parts.core, 'waist', s.waist.width * 0.38, 0.014, [0, 0.021, 0], 'flex', 'y');
  for (const [side, sign] of [
    ['L', -1],
    ['R', 1],
  ] as const) {
    actuator(
      parts.shoulders,
      `shoulder_${side}`,
      0.025,
      0.037,
      [-sign * 0.027, 0, 0],
      'joint',
      'x',
    );
    actuator(parts.shoulders, `shoulder_${side}`, 0.029, 0.016, [0, 0, 0.02], 'joint', 'z');
    actuator(parts.shoulders, `shoulder_${side}`, 0.025, 0.005, [0, 0, 0.03], 'visor', 'z');
    // The lateral torso structure has a curved outer boundary and an actual
    // opening around the shoulder drive shaft, rather than a painted circle.
    const shape = new T.Shape();
    shape.absellipse(0, 0, 0.049, 0.099, 0, Math.PI * 2, false, 0);
    const hole = new T.Path();
    hole.absellipse(0, 0.062, 0.026, 0.027, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
    const sidePlate = new T.ExtrudeGeometry(shape, {
      depth: 0.004,
      bevelEnabled: true,
      bevelSize: 0.0015,
      bevelThickness: 0.001,
      bevelSegments: 2,
      steps: 1,
      curveSegments: 40,
    });
    sidePlate.scale(U(1), U(1), U(1));
    sidePlate.rotateY(Math.PI / 2);
    add(parts.chest, 'torso', sidePlate, [sign * 0.079, 0.024, -0.004], 'joint', 2);
    const upperLength = s.arm.shoulderY - s.arm.elbowY;
    const inner = add(
      parts.arm,
      `upperArm_${side}`,
      taperedShell(upperLength - 0.018, 0.032, 0.038, 0.84),
      [sign * 0.01, -upperLength / 2, -0.008],
      'joint',
      2,
    );
    inner.rotation.z = sign * 0.115;
    actuator(parts.arm, `elbow_${side}`, 0.027, 0.046, [0, 0, 0], 'joint');
    for (const edge of [-1, 1])
      actuator(parts.arm, `elbow_${side}`, 0.022, 0.007, [edge * 0.024, 0, 0], 'secondary');
    const lowerLength = s.arm.elbowY - s.arm.wristY;
    const foreCore = add(
      parts.arm,
      `forearm_${side}`,
      taperedShell(lowerLength - 0.005, 0.026, 0.027, 0.8),
      [sign * 0.01, -lowerLength / 2, 0],
      'joint',
      2,
    );
    foreCore.rotation.z = sign * 0.115;
    actuator(parts.hands, `wrist_${side}`, 0.016, 0.032, [0, 0.001, 0], 'joint');
    add(
      parts.hands,
      `hand_${side}`,
      rounded(0.032, 0.039, 0.005, 0.005),
      [0, -0.023, 0.014],
      'hand',
      2,
    );
    for (let finger = 0; finger < 4; finger++)
      for (let j = 0; j < 3; j++) {
        const bone = `finger_${side}_${finger}_${j}`;
        actuator(parts.hands, bone, 0.0052, 0.0085, [0, -0.001, 0], 'joint');
      }
    actuator(parts.hands, `thumb_${side}`, 0.007, 0.014, [0, -0.002, 0], 'joint');
    actuator(parts.hands, `thumb_tip_${side}`, 0.006, 0.012, [0, -0.001, 0], 'joint');
    actuator(
      parts.hips,
      'pelvis',
      0.033,
      0.028,
      [sign * (s.pelvis.width / 2 - 0.02), -0.003, 0],
      'shell',
    );
    actuator(
      parts.hips,
      'pelvis',
      0.028,
      0.005,
      [sign * (s.pelvis.width / 2 - 0.004), -0.003, 0],
      'joint',
    );
    add(
      parts.hips,
      `hip_${side}`,
      taperedShell(0.045, 0.061, 0.064, 0.9),
      [0, -0.004, 0],
      'joint',
      2,
    );
    const knee = `knee_${side}`;
    actuator(parts.legs, knee, 0.024, 0.059, [0, 0, 0], 'joint');
    actuator(parts.legs, knee, 0.02, 0.007, [sign * 0.031, 0, 0], 'secondary');
    actuator(parts.legs, knee, 0.012, 0.0015, [sign * 0.035, 0, 0], 'joint');
    add(parts.legs, knee, taperedShell(0.049, 0.047, 0.028, 0.88, 3.2), [0, 0, 0.018], 'joint', 2);
    add(
      parts.legs,
      `thigh_${side}`,
      taperedShell(0.195, 0.038, 0.041, 0.78),
      [0, -0.103, -0.011],
      'joint',
      2,
    );
    actuator(parts.legs, `ankle_${side}`, 0.014, 0.033, [0, -0.001, 0], 'joint');
    add(
      parts.legs,
      `ankle_${side}`,
      rounded(0.023, 0.029, 0.021, 0.004),
      [0, -0.014, 0.009],
      'joint',
      2,
    );
  }
}
