import { describe, it, expect } from 'vitest';
import {
  explorerReducer as reduce,
  initialState,
  type ExplorerState,
} from '../../src/state/explorerReducer';
import { serializeState, parseState } from '../../src/state/shareState';
import { searchCapabilities } from '../../src/state/selectors';
import { domainIds } from '../../src/data/domains';
const selected = () => reduce(initialState(), { type: 'select', id: 'metacognition' });
describe('deterministic explorer transitions', () => {
  it('selection enables a hidden domain and exits isolation', () => {
    const s = reduce(
      { ...selected(), isolate: true, visible: [] },
      { type: 'select', id: 'memory' },
    );
    expect(s.selected).toBe('memory');
    expect(s.visible).toContain('memory');
    expect(s.isolate).toBe(false);
    expect(s.cameraIntent).toBe('fit');
  });
  it('clear preserves filters and layers', () => {
    const s = reduce(
      { ...selected(), query: 'error', evidence: 'Extrapolated', isolate: true },
      { type: 'clear' },
    );
    expect(s.selected).toBeNull();
    expect(s.isolate).toBe(false);
    expect(s.query).toBe('error');
    expect(s.evidence).toBe('Extrapolated');
    expect(s.visible).toEqual(domainIds);
  });
  it('isolate assembles and preserves the previous camera', () => {
    const before = { ...selected(), explode: 0.7 };
    const isolated = reduce(before, { type: 'isolate' });
    expect(isolated.explode).toBe(0);
    expect(isolated.previousCamera).toEqual(before.camera);
    const after = reduce(isolated, { type: 'isolate' });
    expect(after.camera).toEqual(before.camera);
    expect(after.cameraIntent).toBe('restore');
  });
  it('hiding selected domain clears its inspector', () => {
    const s = reduce(selected(), { type: 'layers', visible: ['memory'] });
    expect(s.selected).toBeNull();
    expect(s.isolate).toBe(false);
  });
  it('layer changes exit isolation and retain only valid selection', () => {
    const s = reduce(
      { ...selected(), isolate: true },
      { type: 'layers', visible: ['metacognition', 'memory'] },
    );
    expect(s.isolate).toBe(false);
    expect(s.selected).toBe('metacognition');
  });
  it('reset restores all documented defaults', () => {
    const s = reduce(
      {
        ...selected(),
        view: 'network',
        explode: 0.5,
        isolate: true,
        query: 'abc',
        evidence: 'Observed',
        visible: [],
      },
      { type: 'reset' },
    );
    expect({ ...s, cameraRevision: 0 }).toEqual(initialState());
  });
  it('rejects unknown selection and clamps explode', () => {
    const s = initialState();
    expect(reduce(s, { type: 'select', id: 'not-real' })).toBe(s);
    expect(reduce(s, { type: 'explode', value: 8 }).explode).toBe(1);
    expect(reduce(s, { type: 'explode', value: NaN }).explode).toBe(0);
  });
  it('does not isolate without a selection', () =>
    expect(reduce(initialState(), { type: 'isolate' }).isolate).toBe(false));
});
describe('shared views', () => {
  it('round trips all meaningful state including filters and camera', () => {
    const s: ExplorerState = {
      ...selected(),
      visible: ['metacognition', 'memory'],
      explode: 0.7,
      query: 'Error detection',
      evidence: 'Extrapolated',
      camera: { position: [3, 4, 8], target: [0, 3, 0] },
      cameraIntent: 'restore',
    };
    const back = parseState(serializeState(s));
    expect({ ...back, cameraRevision: s.cameraRevision }).toEqual(s);
  });
  it('round trips an isolated view and previous camera', () => {
    const s = reduce(selected(), { type: 'isolate' });
    const back = parseState(serializeState(s));
    expect(back.isolate).toBe(true);
    expect(back.previousCamera).toEqual(s.previousCamera);
  });
  it('rejects unknown versions, IDs and invalid vectors', () => {
    expect(parseState('#v=99&cap=memory')).toEqual(initialState());
    const s = parseState(
      '#v=1&view=hack&cap=bad&layers=hack&isolate=1&explode=Infinity&pos=NaN,2,4',
    );
    expect(s.view).toBe('body');
    expect(s.selected).toBeNull();
    expect(s.visible).toEqual([]);
    expect(s.isolate).toBe(false);
    expect(s.cameraIntent).toBe('fit');
  });
  it('rejects coincident and out-of-range cameras', () => {
    for (const pos of ['0,0,0', '1000,1,1', ',,', 'NaN,2,3'])
      expect(parseState(`#v=1&pos=${pos}&target=0,0,0`).cameraIntent).toBe('fit');
  });
  it('does not treat prototype names as catalogue IDs', () => {
    for (const id of ['toString', 'constructor', '__proto__'])
      expect(parseState(`#v=1&cap=${id}&isolate=1`).selected).toBeNull();
  });
  it('enables a shared selected layer and sanitises isolation', () => {
    const s = parseState('#v=1&cap=memory&layers=none&isolate=1&explode=.8');
    expect(s.visible).toEqual(['memory']);
    expect(s.explode).toBe(0);
  });
});
describe('search parity', () => {
  it('finds aliases, IDs, meanings and subtraits without layer dependency', () => {
    expect(searchCapabilities('RESOURCE layers')[0].id).toBe('ecology');
    expect(searchCapabilities('error detection')[0].id).toBe('metacognition');
    expect(searchCapabilities('substrate-mobility')[0].id).toBe('substrate-mobility');
  });
  it('combines query and future evidence predictably', () => {
    expect(searchCapabilities('improvement', 'Speculative').map((c) => c.id)).toEqual([
      'self-improvement',
    ]);
    expect(searchCapabilities('metacognition', 'Observed')).toEqual([]);
    expect(searchCapabilities('nonsense')).toEqual([]);
  });
});

it('keeps toolbar zoom within the shared camera range', () => {
  const far = reduce(initialState(), { type: 'zoom', factor: 100 });
  expect(Math.hypot(...far.camera.position.map((v, i) => v - far.camera.target[i]))).toBeCloseTo(
    150,
  );
  const restored = parseState(serializeState(far));
  expect(restored.cameraIntent).toBe('restore');
  expect(restored.camera.position[2]).toBeCloseTo(far.camera.position[2], 4);
  expect(reduce(far, { type: 'zoom', factor: Infinity })).toBe(far);
});
