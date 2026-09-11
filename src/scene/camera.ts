import { Box3, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { PartRegistry } from './partRegistry';
import type { ExplorerState, CameraState } from '../state/explorerReducer';
import { capabilityById } from '../data/capabilities';
export function fitCamera(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  registry: PartRegistry,
  state: ExplorerState,
) {
  const box = new Box3();
  const selected = state.selected
    ? capabilityById[state.selected]?.viewCoordinates.body.partIds
    : [];
  for (const p of registry.values())
    if (p.group.visible && (!state.selected || state.explode > 0 || selected?.includes(p.id)))
      box.union(new Box3().setFromObject(p.group));
  if (box.isEmpty()) box.set(new Vector3(-1.6, 0, -0.6), new Vector3(1.6, 6.2, 0.6));
  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  if (state.selected && !state.isolate && state.explode === 0) {
    size.max(new Vector3(3, 3.5, 1.5));
  }
  const direction = new Vector3()
    .fromArray(state.camera.position)
    .sub(new Vector3().fromArray(state.camera.target))
    .normalize();
  const radius = Math.max(0.25, size.length() / 2);
  const fov = MathUtils.degToRad(camera.fov / 2);
  const limitingFov = Math.min(fov, Math.atan(Math.tan(fov) * camera.aspect));
  const distance = (radius / Math.sin(limitingFov)) * 1.15;
  controls.target.copy(center);
  camera.position.copy(center).addScaledVector(direction, distance);
  controls.update();
}
export const readCamera = (camera: PerspectiveCamera, controls: OrbitControls): CameraState => ({
  position: camera.position.toArray() as [number, number, number],
  target: controls.target.toArray() as [number, number, number],
});
