import { describe, it, expect } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { initialState, explorerReducer as reduce } from '../../src/state/explorerReducer';
import { parseState, serializeState } from '../../src/state/shareState';
import { capabilities } from '../../src/data/capabilities';
import { dossiers } from '../../src/data/dossiers';
import { phenotypeContext } from '../../src/data/profile';
import { executionSnapshot } from '../../src/data/illustrations';
import { placeCallouts, projected } from '../../src/scene/discoveryLayout';
describe('progressive exploration', () => {
  it('preserves legacy capability links and restores a shared subtopic', () => {
    const old = parseState('#v=1&cap=cognition');
    expect(old.selected).toBe('cognition');
    expect(old.group).toBe('mind');
    const s = reduce(old, { type: 'topic', id: 'cognition-4' });
    const shared = parseState(serializeState(s));
    expect(shared.topic).toBe('cognition-4');
    expect(reduce(shared, { type: 'back' }).topic).toBeNull();
  });
  it('restores the full execution illustration and rejects unrelated topic/profile IDs', () => {
    let s = reduce(initialState(), {
      type: 'select',
      id: 'substrate-mobility',
      group: 'beyond',
      illustration: 'execution',
    });
    s = reduce(s, { type: 'execution', value: 'copy' });
    s = reduce(s, { type: 'step', value: 2 });
    s = reduce(s, { type: 'availability', body: false, recovery: false });
    const p = parseState(serializeState(s));
    expect([
      p.group,
      p.illustration,
      p.execution,
      p.step,
      p.bodyAvailable,
      p.recoveryAvailable,
    ]).toEqual(['beyond', 'execution', 'copy', 2, false, false]);
    const malformed = parseState(
      '#v=2&cap=cognition&topic=memory-1&profile=strength&demo=bad&step=NaN',
    );
    expect([malformed.topic, malformed.profile, malformed.illustration, malformed.step]).toEqual([
      null,
      null,
      null,
      0,
    ]);
  });
  it('backs out one hierarchy level and clears stale content on a new selection', () => {
    let s = reduce(initialState(), { type: 'select', id: 'embodiment', profile: 'strength' });
    s = reduce(s, { type: 'illustration', id: 'strength' });
    s = reduce(s, { type: 'back' });
    expect(s.profile).toBe('strength');
    expect(s.illustration).toBeNull();
    s = reduce(s, { type: 'back' });
    expect(s.selected).toBeNull();
    expect(s.group).toBe('physical');
    s = reduce(s, { type: 'back' });
    expect(s.group).toBeNull();
    s = reduce(reduce(initialState(), { type: 'select', id: 'cognition', topic: 'cognition-2' }), {
      type: 'select',
      id: 'memory',
    });
    expect(s.topic).toBeNull();
  });
  it('keeps a substantive main dossier and five connected subtopics for all twelve IDs', () => {
    for (const c of capabilities) {
      const d = dossiers[c.domain];
      const words = [
        c.meaning,
        c.hypotheticalExample,
        phenotypeContext[c.domain].enables,
        ...c.importantDistinctions,
        d.mechanism,
        d.prerequisites,
        d.limits,
        d.scenario,
        d.question,
      ]
        .join(' ')
        .split(/\s+/).length;
      expect(words, `${c.id}: ${words} main words`).toBeGreaterThanOrEqual(250);
      expect(words, `${c.id}: ${words} main words`).toBeLessThanOrEqual(450);
      expect(c.subtraits).toHaveLength(5);
      for (const [i, t] of c.subtraits.entries()) {
        expect(t.id).toBe(`${c.id}-${i + 1}`);
        expect(t.meaning.split(/\s+/).length).toBeGreaterThan(30);
        expect(d.topics[i].related.every((id) => capabilities.some((c) => c.id === id))).toBe(true);
      }
    }
  });
});
describe('execution conditions', () => {
  it('shows computation staying at the host for remote control even when the body fails', () => {
    const s = executionSnapshot('remote', 0, false, true);
    expect(s.source).toBe(true);
    expect(s.destination).toBe(false);
    expect(s.bodyStatus).toContain('Body unavailable');
  });
  it('stops source execution before resuming the migration destination', () => {
    expect(executionSnapshot('migration', 0, true, true).source).toBe(true);
    const pause = executionSnapshot('migration', 1, true, true);
    expect([pause.source, pause.destination]).toEqual([false, false]);
    const resumed = executionSnapshot('migration', 2, true, true);
    expect([resumed.source, resumed.destination]).toEqual([false, true]);
  });
  it('makes copies diverge and does not invent survival without usable resources', () => {
    const copies = executionSnapshot('copy', 2, true, true);
    expect([copies.source, copies.destination]).toEqual([true, true]);
    expect(copies.detail).toContain('diverging');
    for (const m of ['remote', 'migration', 'copy'] as const) {
      const failed = executionSnapshot(m, 2, false, false);
      expect([failed.source, failed.destination]).toEqual([false, false]);
      expect(failed.phase).toBe('Required resources unavailable');
    }
  });
});
describe('projected callouts', () => {
  it('clamps and separates callouts on each rail', () => {
    const labels = placeCallouts(
      Array.from({ length: 8 }, (_, i) => ({
        key: String(i),
        x: i % 2 ? 980 : 20,
        y: 100 + i,
        visible: true,
      })),
      1000,
      500,
    );
    const rects = [...labels.values()];
    for (const r of rects) {
      expect(r.x).toBeGreaterThanOrEqual(12);
      expect(r.x + 205).toBeLessThanOrEqual(988);
      expect(r.y + 58).toBeLessThanOrEqual(480);
    }
    for (const a of rects)
      for (const b of rects)
        if (a !== b && a.x === b.x) expect(Math.abs(a.y - b.y)).toBeGreaterThanOrEqual(58);
  });
  it('hides points behind the camera', () => {
    const camera = new PerspectiveCamera(34, 2, 0.05, 250);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    expect(projected(new Vector3(0, 0, 11), camera, 1000, 500).visible).toBe(false);
    expect(projected(new Vector3(0, 0, 0), camera, 1000, 500).visible).toBe(true);
  });
});
