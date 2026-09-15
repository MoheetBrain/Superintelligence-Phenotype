import { Group, Vector3 } from 'three';
import { robotLandmarks, U } from '../robotSpec';
export function createRobotRig() {
  const rig = new Group();
  rig.name = 'robot-rig';
  const bones = new Map<string, Group>(),
    points = robotLandmarks();
  function bone(name: string, parent: Group, position: readonly number[]) {
    const g = new Group();
    g.name = name;
    const p = new Vector3(...(position.map(U) as [number, number, number]));
    parent.updateWorldMatrix(true, false);
    g.position.copy(parent.worldToLocal(p));
    parent.add(g);
    bones.set(name, g);
    return g;
  }
  const pelvis = bone('pelvis', rig, points.pelvisCenter);
  const waist = bone('waist', pelvis, points.waistCenter);
  const torso = bone('torso', waist, points.torsoCenter);
  const neck = bone('neck', torso, points.neckCenter);
  bone('head', neck, points.headCenter);
  for (const side of ['L', 'R'] as const) {
    const shoulder = bone(`shoulder_${side}`, torso, points[`shoulder${side}`]);
    const upper = bone(`upperArm_${side}`, shoulder, points[`shoulder${side}`]);
    const elbow = bone(`elbow_${side}`, upper, points[`elbow${side}`]);
    const forearm = bone(`forearm_${side}`, elbow, points[`elbow${side}`]);
    const wrist = bone(`wrist_${side}`, forearm, points[`wrist${side}`]);
    bone(`hand_${side}`, wrist, points[`wrist${side}`]);
    const hip = bone(`hip_${side}`, pelvis, points[`hip${side}`]);
    const thigh = bone(`thigh_${side}`, hip, points[`hip${side}`]);
    const knee = bone(`knee_${side}`, thigh, points[`knee${side}`]);
    const shin = bone(`shin_${side}`, knee, points[`knee${side}`]);
    const ankle = bone(`ankle_${side}`, shin, points[`ankle${side}`]);
    bone(`foot_${side}`, ankle, points[`ankle${side}`]);
  }
  return { rig, bones };
}
