import { Raycaster, Vector2, type PerspectiveCamera } from 'three';
import type { PartRegistry } from './partRegistry';
const raycaster = new Raycaster();
const pointer = new Vector2();
export function pickPart(
  x: number,
  y: number,
  rect: DOMRect,
  camera: PerspectiveCamera,
  registry: PartRegistry,
): string | null {
  pointer.set(((x - rect.left) / rect.width) * 2 - 1, (-(y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const meshes = [...registry.values()].filter((p) => p.group.visible).flatMap((p) => p.meshes);
  return raycaster.intersectObjects(meshes, false)[0]?.object.userData.partId ?? null;
}
