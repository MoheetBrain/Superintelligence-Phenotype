import { describe, it, expect } from 'vitest';
import { hostSnapshots, initialMobility, mobilityReducer } from '../../src/state/mobility';
import { initialState, explorerReducer } from '../../src/state/explorerReducer';
import { parseState, serializeState } from '../../src/state/shareState';
import { createRobotPair } from '../../src/scene/createRobot';
describe('local substrate mobility', () => {
  it('stops the source before restoration and preserves operational lineage on migration', () => {
    const initial = initialMobility();
    const original = hostSnapshots(initial)[0].state;
    let s = mobilityReducer(initial, { type: 'start', mode: 'migrate' });
    expect(hostSnapshots(s).map((h) => h.status)).toEqual(['inactive', 'receiving']);
    for (let i = 0; i < 3; i++) s = mobilityReducer(s, { type: 'advance', revision: s.revision });
    expect(hostSnapshots(s).map((h) => h.status)).toEqual(['inactive', 'active']);
    expect(hostSnapshots(s)[1].state).toEqual(original);
  });
  it('copies into a separate instance while the source continues', () => {
    const s = mobilityReducer(initialMobility(), { type: 'start', mode: 'copy', immediate: true });
    const [a, b] = hostSnapshots(s);
    expect(a.status).toBe('active');
    expect(b.status).toBe('active');
    expect(a.state?.id).not.toBe(b.state?.id);
    expect(a.state?.lineageId).toBe(b.state?.lineageId);
    expect(a.state?.memoryVersion).toBe(b.state?.memoryVersion);
  });
  it('forked instances acquire distinct memory and plans after a shared starting state', () => {
    let s = mobilityReducer(initialMobility(), { type: 'start', mode: 'fork' });
    for (let i = 0; i < 3; i++) s = mobilityReducer(s, { type: 'advance', revision: s.revision });
    expect(hostSnapshots(s)[0].state?.memoryVersion).toBe(hostSnapshots(s)[1].state?.memoryVersion);
    s = mobilityReducer(s, { type: 'advance', revision: s.revision });
    const [a, b] = hostSnapshots(s);
    expect(a.state?.lineageId).toBe(b.state?.lineageId);
    expect(a.state?.memoryVersion).not.toBe(b.state?.memoryVersion);
  });
  it('remote control cancels an in-flight transfer and stale callbacks cannot restore state', () => {
    const pending = mobilityReducer(initialMobility(), { type: 'start', mode: 'migrate' });
    const remote = mobilityReducer(pending, { type: 'remote', enabled: true });
    expect(mobilityReducer(remote, { type: 'advance', revision: pending.revision })).toEqual(
      remote,
    );
    const [a, b] = hostSnapshots(remote);
    expect(a.state).not.toBeNull();
    expect(b.state).toBeNull();
    expect(b.actuator).toBe(true);
  });
  it('reset prevents stale completion and double starts cannot duplicate a transfer', () => {
    const pending = mobilityReducer(initialMobility(), { type: 'start', mode: 'copy' });
    expect(mobilityReducer(pending, { type: 'start', mode: 'fork' })).toEqual(pending);
    const reset = mobilityReducer(pending, { type: 'reset' });
    expect(mobilityReducer(reset, { type: 'advance', revision: pending.revision })).toEqual(reset);
  });
  it('shared views restore settled host arrangements without resuming partial transactions', () => {
    let s = explorerReducer(initialState(), {
      type: 'mobility',
      action: { type: 'start', mode: 'fork', immediate: true },
    });
    const restored = parseState(serializeState(s));
    expect(restored.mobility.phase).toBe('diverged');
    expect(restored.hostView).toBe('transfer');
    s = { ...s, mobility: { ...s.mobility, phase: 'checking' } };
    expect(parseState(serializeState(s)).mobility.phase).toBe('ready');
    expect(parseState('#v=2&cap=metacognition').selected).toBe('metacognition');
  });
  it('shares geometry across hosts with independent materials and stable capability identifiers', () => {
    const { a, b } = createRobotPair();
    for (const [id, part] of a.registry) {
      const other = b.registry.get(id)!;
      expect(other.meshes.length).toBe(part.meshes.length);
      part.meshes.forEach((m, i) => {
        expect(m.geometry).toBe(other.meshes[i].geometry);
        expect(m.material).not.toBe(other.meshes[i].material);
        expect(m.userData.partId).toBe(other.meshes[i].userData.partId);
      });
    }
  });
});
