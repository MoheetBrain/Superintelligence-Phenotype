import * as T from 'three';
import type { DiscoveryNode } from '../data/discovery';
import { cloudAnchor } from './discoveryLayout';
export function createDiscovery(nodes: DiscoveryNode[], root: boolean) {
  const group = new T.Group();
  group.name = 'Discovery constellation';
  const anchors = new Map<string, T.Vector3>();
  const meshes: T.Mesh[] = [];
  for (const [i, node] of nodes.entries()) {
    const anchor = cloudAnchor(i, nodes.length, root);
    anchors.set(node.key, anchor);
    const orb = new T.Mesh(
      new T.SphereGeometry(0.095, 16, 12),
      new T.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.65,
        metalness: 0.3,
        roughness: 0.22,
      }),
    );
    orb.position.copy(anchor);
    orb.userData.cloudKey = node.key;
    group.add(orb);
    meshes.push(orb);
    const ring = new T.Mesh(
      new T.TorusGeometry(0.19, 0.012, 6, 32),
      new T.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.55 }),
    );
    ring.position.copy(anchor);
    ring.userData.cloudKey = node.key;
    group.add(ring);
    meshes.push(ring);
  }
  return { group, anchors, meshes };
}
export function disposeGroup(group: T.Group) {
  group.traverse((o) => {
    if (o instanceof T.Mesh || o instanceof T.Line) {
      o.geometry.dispose();
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose();
    }
  });
  group.removeFromParent();
}
