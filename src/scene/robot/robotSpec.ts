import type { Vec3 } from '../../data/schema';

/** All dimensions and landmarks are fractions of standing height H = 1.
 * Deliberate reconstruction targets, not measured manufacturer specifications. */
export const robotSpec = {
  totalHeight: 1,
  displayHeight: 6.2,
  cameraFov: 29,
  head: { height: 0.124, width: 0.083, depth: 0.08, y: 0.938 },
  neck: { height: 0.043, width: 0.043, y: 0.864 },
  torso: {
    height: 0.254,
    top: 0.857,
    bottom: 0.603,
    chestWidth: 0.172,
    waistWidth: 0.143,
    depth: 0.112,
  },
  waist: { height: 0.057, width: 0.076, depth: 0.074, y: 0.574 },
  pelvis: { width: 0.208, height: 0.061, depth: 0.091, y: 0.528 },
  arm: {
    shoulderRadius: 0.031,
    shoulderX: 0.104,
    shoulderY: 0.816,
    elbowX: 0.124,
    elbowY: 0.645,
    wristX: 0.143,
    wristY: 0.478,
    upperWidth: 0.055,
    upperDepth: 0.058,
    proximalForearmWidth: 0.052,
    distalForearmWidth: 0.038,
    forearmDepth: 0.046,
    handLength: 0.101,
    palmLength: 0.047,
    palmWidth: 0.043,
    palmDepth: 0.022,
    fingerLengths: [0.046, 0.054, 0.05, 0.039] as const,
    fingerWidth: 0.0085,
  },
  leg: {
    hipX: 0.069,
    hipY: 0.491,
    kneeY: 0.281,
    ankleY: 0.052,
    thighWidth: 0.071,
    thighDepth: 0.081,
    proximalShinWidth: 0.059,
    distalShinWidth: 0.031,
    shinDepth: 0.067,
    footLength: 0.114,
    footWidth: 0.047,
    footHeight: 0.034,
    footForward: 0.026,
  },
  detail: { seam: 0.0012, fastenerRadius: 0.0018, panelLip: 0.0022 },
} as const;
export type RobotSpec = typeof robotSpec;
export const U = (n: number) => n * robotSpec.displayHeight;
export const vector = (x: number, y: number, z = 0): Vec3 => [U(x), U(y), U(z)];
export function robotLandmarks(s: RobotSpec = robotSpec) {
  return {
    headTop: [0, 1, 0],
    headCenter: [0, s.head.y, 0],
    neckCenter: [0, s.neck.y, 0],
    torsoCenter: [0, (s.torso.top + s.torso.bottom) / 2, 0],
    waistCenter: [0, s.waist.y, 0],
    pelvisCenter: [0, s.pelvis.y, 0],
    shoulderL: [-s.arm.shoulderX, s.arm.shoulderY, 0],
    shoulderR: [s.arm.shoulderX, s.arm.shoulderY, 0],
    elbowL: [-s.arm.elbowX, s.arm.elbowY, 0.004],
    elbowR: [s.arm.elbowX, s.arm.elbowY, 0.004],
    wristL: [-s.arm.wristX, s.arm.wristY, 0.012],
    wristR: [s.arm.wristX, s.arm.wristY, 0.012],
    hipL: [-s.leg.hipX, s.leg.hipY, 0],
    hipR: [s.leg.hipX, s.leg.hipY, 0],
    kneeL: [-s.leg.hipX, s.leg.kneeY, 0.002],
    kneeR: [s.leg.hipX, s.leg.kneeY, 0.002],
    ankleL: [-s.leg.hipX, s.leg.ankleY, 0],
    ankleR: [s.leg.hipX, s.leg.ankleY, 0],
  } satisfies Record<string, Vec3>;
}
export const proportionMetrics = () => ({
  'head height / H': robotSpec.head.height,
  'head width / H': robotSpec.head.width,
  'shoulder width / H': 2 * (robotSpec.arm.shoulderX + robotSpec.arm.shoulderRadius),
  'torso height / H': robotSpec.torso.height,
  'torso width / H': robotSpec.torso.chestWidth,
  'pelvis width / H': robotSpec.pelvis.width,
  'upper arm / H': Math.hypot(
    robotSpec.arm.elbowX - robotSpec.arm.shoulderX,
    robotSpec.arm.shoulderY - robotSpec.arm.elbowY,
  ),
  'forearm / H': Math.hypot(
    robotSpec.arm.wristX - robotSpec.arm.elbowX,
    robotSpec.arm.elbowY - robotSpec.arm.wristY,
  ),
  'hand length / H': robotSpec.arm.handLength,
  'thigh / H': robotSpec.leg.hipY - robotSpec.leg.kneeY,
  'shin / H': robotSpec.leg.kneeY - robotSpec.leg.ankleY,
  'foot length / H': robotSpec.leg.footLength,
});
