import { Box3, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { PartRegistry } from './partRegistry';
import type { ExplorerState, CameraState } from '../state/explorerReducer';
export function fitCamera(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  registry: PartRegistry,
  state: ExplorerState,
) {
  const box = new Box3();
  for (const p of registry.values())
    if (p.group.visible) box.union(new Box3().setFromObject(p.group));
  if (box.isEmpty()) box.set(new Vector3(-1.6, 0, -0.6), new Vector3(1.6, 6.2, 0.6));
  if (state.illustration === 'execution') {
    box.expandByPoint(new Vector3(-3.2, 0.1, -0.4));
    box.expandByPoint(new Vector3(3.2, 6.8, 0.6));
  }
  if (!state.isolate && state.explode === 0) {
    box.max.y += 0.55;
    if (state.hostView === 'transfer' && state.illustration !== 'execution')
      box.min.y = Math.max(box.min.y, 1.15);
  }
  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  if (state.selected && !state.isolate && state.explode === 0) {
    size.max(new Vector3(3, 3.5, 1.5));
  }
  const direction = new Vector3()
    .fromArray(state.camera.position)
    .sub(new Vector3().fromArray(state.camera.target))
    .normalize();
  const fov = MathUtils.degToRad(camera.fov / 2);
  const right = new Vector3().crossVectors(new Vector3(0, 1, 0), direction).normalize();
  if (right.lengthSq() < 0.001) right.set(1, 0, 0);
  const up = new Vector3().crossVectors(direction, right).normalize();
  // Fit the eight bounds corners in camera space. A sphere wastes substantial
  // screen space for a tall silhouette, especially on portrait displays.
  let distance = 0.5;
  for (const x of [-1, 1])
    for (const y of [-1, 1])
      for (const z of [-1, 1]) {
        const corner = new Vector3((x * size.x) / 2, (y * size.y) / 2, (z * size.z) / 2);
        const depth = corner.dot(direction);
        distance = Math.max(
          distance,
          Math.abs(corner.dot(right)) / (Math.tan(fov) * camera.aspect) + depth,
          Math.abs(corner.dot(up)) / Math.tan(fov) + depth,
        );
      }
  distance *= 1.18;
  controls.target.copy(center);
  camera.position.copy(center).addScaledVector(direction, distance);
  controls.update();
}
export const readCamera = (camera: PerspectiveCamera, controls: OrbitControls): CameraState => ({
  position: camera.position.toArray() as [number, number, number],
  target: controls.target.toArray() as [number, number, number],
});
