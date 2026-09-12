import { describe, it, expect } from 'vitest';
import { Box3, Vector3 } from 'three';
import { createRobot, createRobotPair, syncRobotPresentation } from '../../src/scene/createRobot';
import { applyExplosion } from '../../src/scene/explosionLayout';
import { robotSpec } from '../../src/scene/robot/robotSpec';
describe('Atlas humanoid reconstruction', () => {
  it('moves the entire distal arm from a physically centred elbow while preserving the other branches', () => {
    const item = createRobot(),
      wrist = item.bones.get('wrist_L')!,
      head = item.bones.get('head')!;
    const before = wrist.getWorldPosition(new Vector3()),
      beforeHead = head.getWorldPosition(new Vector3());
    item.bones.get('elbow_L')!.rotation.z = 0.3;
    expect(wrist.getWorldPosition(new Vector3()).distanceTo(before)).toBeGreaterThan(0.25);
    expect(head.getWorldPosition(new Vector3()).distanceTo(beforeHead)).toBeLessThan(1e-8);
    expect(wrist.parent?.name).toBe('forearm_L');
    expect(item.bones.get('head')!.parent?.name).toBe('neck');
    expect(item.bones.get('foot_R')!.parent?.name).toBe('ankle_R');
  });
  it('separates visual meshes and restores their exact hierarchy, pose and independent visibility', () => {
    const item = createRobot();
    item.robot.updateMatrixWorld(true);
    const mesh = item.registry.get('interface-hands')!.meshes[0],
      before = mesh.getWorldPosition(new Vector3()),
      parent = mesh.parent;
    applyExplosion(item.registry, 1, 1.5);
    syncRobotPresentation(item, true);
    expect(mesh.parent).toBe(item.registry.get('interface-hands')!.group);
    expect(mesh.getWorldPosition(new Vector3()).distanceTo(before)).toBeGreaterThan(1);
    applyExplosion(item.registry, 0, 1.5);
    syncRobotPresentation(item, false);
    expect(mesh.parent).toBe(parent);
    expect(mesh.getWorldPosition(new Vector3()).distanceTo(before)).toBeLessThan(1e-7);
    item.registry.get('interface-hands')!.group.visible = false;
    syncRobotPresentation(item, false);
    expect(mesh.visible).toBe(false);
    expect(item.registry.get('revision-arms')!.meshes[0].visible).toBe(true);
  });
  it('keeps hosts geometrically identical, near normalized height and inside the triangle budget', () => {
    const { a, b } = createRobotPair();
    const aSize = new Box3().setFromObject(a.robot).getSize(new Vector3());
    const bSize = new Box3().setFromObject(b.robot).getSize(new Vector3());
    expect(aSize.distanceTo(bSize)).toBeLessThan(1e-8);
    expect(Math.abs(aSize.y / robotSpec.displayHeight - 1)).toBeLessThan(0.005);
    let triangles = 0;
    for (const p of a.registry.values())
      for (const mesh of p.meshes)
        triangles +=
          (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3;
    expect(triangles).toBeGreaterThan(50000);
    expect(triangles).toBeLessThanOrEqual(150000);
    for (const [name, bone] of a.bones) {
      expect(b.bones.get(name)?.position.toArray()).toEqual(bone.position.toArray());
    }
  });
});
