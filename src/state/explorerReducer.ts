import type { DomainId, EvidenceLevel, Vec3 } from '../data/schema';
import { domainIds } from '../data/domains';
import { capabilityById } from '../data/capabilities';
export type View = 'body' | 'network' | 'evolution';
export interface CameraState {
  position: Vec3;
  target: Vec3;
}
export interface ExplorerState {
  view: View;
  selected: string | null;
  visible: DomainId[];
  isolate: boolean;
  explode: number;
  camera: CameraState;
  previousCamera: CameraState | null;
  query: string;
  evidence: EvidenceLevel | 'all';
  cameraIntent: 'fit' | 'restore';
  cameraRevision: number;
}
export const defaultCamera: CameraState = { position: [5, 4.5, 15], target: [0, 3.1, 0] };
export const initialState = (): ExplorerState => ({
  view: 'body',
  selected: null,
  visible: [...domainIds],
  isolate: false,
  explode: 0,
  camera: defaultCamera,
  previousCamera: null,
  query: '',
  evidence: 'all',
  cameraIntent: 'fit',
  cameraRevision: 0,
});
export type Action =
  | { type: 'select'; id: string }
  | { type: 'clear' }
  | { type: 'isolate' }
  | { type: 'layers'; visible: DomainId[] }
  | { type: 'reset' }
  | { type: 'refit' }
  | { type: 'explode'; value: number }
  | { type: 'query'; value: string }
  | { type: 'evidence'; value: EvidenceLevel | 'all' }
  | { type: 'view'; view: View }
  | { type: 'camera'; camera: CameraState }
  | { type: 'preset'; preset: 'front' | 'side' | 'back' | 'perspective' }
  | { type: 'restore'; state: ExplorerState };
const fit = (s: ExplorerState): ExplorerState => ({
  ...s,
  cameraIntent: 'fit',
  cameraRevision: s.cameraRevision + 1,
});
export function explorerReducer(s: ExplorerState, a: Action): ExplorerState {
  switch (a.type) {
    case 'select': {
      const c = capabilityById[a.id];
      if (!c) return s;
      return fit({
        ...s,
        view: 'body',
        selected: c.id,
        visible: s.visible.includes(c.domain) ? s.visible : [...s.visible, c.domain],
        isolate: false,
        previousCamera: null,
      });
    }
    case 'clear':
      return fit({ ...s, selected: null, isolate: false, previousCamera: null });
    case 'isolate':
      if (!s.selected) return s;
      return s.isolate
        ? {
            ...s,
            isolate: false,
            camera: s.previousCamera ?? defaultCamera,
            previousCamera: null,
            cameraIntent: s.previousCamera ? 'restore' : 'fit',
            cameraRevision: s.cameraRevision + 1,
          }
        : fit({ ...s, isolate: true, explode: 0, previousCamera: s.camera });
    case 'layers': {
      const visible = domainIds.filter((id) => a.visible.includes(id));
      const c = s.selected ? capabilityById[s.selected] : null;
      return fit({
        ...s,
        visible,
        selected: c && visible.includes(c.domain) ? s.selected : null,
        isolate: false,
        previousCamera: null,
      });
    }
    case 'reset':
      return { ...initialState(), cameraRevision: s.cameraRevision + 1 };
    case 'refit':
      return fit(s);
    case 'explode':
      return fit({
        ...s,
        explode: Number.isFinite(a.value) ? Math.min(1, Math.max(0, a.value)) : 0,
        isolate: false,
        previousCamera: null,
      });
    case 'query':
      return { ...s, query: a.value.slice(0, 300) };
    case 'evidence':
      return { ...s, evidence: a.value };
    case 'view':
      return { ...s, view: a.view };
    case 'camera':
      return { ...s, camera: a.camera, cameraIntent: 'restore' };
    case 'preset': {
      const dirs = {
        front: [0, 0.02, 1],
        side: [1, 0.02, 0],
        back: [0, 0.02, -1],
        perspective: [0.4, 0.08, 1],
      } as const;
      const d = dirs[a.preset];
      return fit({
        ...s,
        camera: {
          target: s.camera.target,
          position: s.camera.target.map((n, i) => n + d[i] * 12) as unknown as Vec3,
        },
      });
    }
    case 'restore':
      return { ...a.state, cameraRevision: s.cameraRevision + 1 };
  }
}
