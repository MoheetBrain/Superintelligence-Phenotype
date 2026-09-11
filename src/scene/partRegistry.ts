import type { Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import type { DomainId } from '../data/schema';
import { capabilities } from '../data/capabilities';
export interface RobotPart {
  id: string;
  domain: DomainId;
  label: string;
  group: Group;
  meshes: Mesh[];
  assembled: Vector3;
  color: string;
}
export type PartRegistry = Map<string, RobotPart>;
export function conceptsForPart(id: string) {
  return capabilities.filter((c) => c.viewCoordinates.body.partIds.includes(id));
}
export function highlightParts(
  registry: PartRegistry,
  selected: string | null,
  hovered: string | null,
) {
  const ids = capabilities.find((c) => c.id === selected)?.viewCoordinates.body.partIds ?? [];
  for (const part of registry.values())
    for (const mesh of part.meshes) {
      const material = mesh.material as MeshStandardMaterial;
      material.color.set(
        ids.includes(part.id)
          ? '#d9fc8c'
          : part.id === hovered
            ? '#eefbd5'
            : (mesh.userData.baseColor as string),
      );
      material.emissive.set(
        ids.includes(part.id) ? '#9dbb47' : part.id === hovered ? '#6b8862' : '#000000',
      );
      material.emissiveIntensity = ids.includes(part.id) ? 0.23 : 0.1;
    }
}
