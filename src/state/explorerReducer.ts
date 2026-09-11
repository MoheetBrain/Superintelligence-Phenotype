import { primaryGroup, groupIds, type DiscoveryGroupId } from '../data/discovery';
import { profileTraits } from '../data/profile';
import {
  illustrationIds,
  executionModes,
  type IllustrationId,
  type ExecutionMode,
} from '../data/illustrations';
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
  group: DiscoveryGroupId | null;
  topic: string | null;
  profile: string | null;
  illustration: IllustrationId | null;
  example: string;
  step: number;
  execution: ExecutionMode;
  bodyAvailable: boolean;
  recoveryAvailable: boolean;
  finish: 'Coral' | 'Cobalt' | 'Pearl';
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
  group: null,
  topic: null,
  profile: null,
  illustration: null,
  example: 'shelf',
  step: 0,
  execution: 'remote',
  bodyAvailable: true,
  recoveryAvailable: true,
  finish: 'Coral',
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
  | {
      type: 'select';
      id: string;
      group?: DiscoveryGroupId;
      profile?: string;
      topic?: string;
      illustration?: IllustrationId;
    }
  | { type: 'group'; id: DiscoveryGroupId }
  | { type: 'topic'; id: string }
  | { type: 'illustration'; id: IllustrationId }
  | { type: 'example'; value: string }
  | { type: 'step'; value: number }
  | { type: 'execution'; value: ExecutionMode }
  | { type: 'availability'; body?: boolean; recovery?: boolean }
  | { type: 'finish'; value: ExplorerState['finish'] }
  | { type: 'back' }
  | { type: 'home' }
  | { type: 'zoom'; factor: number }
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
        group: a.group ?? s.group ?? primaryGroup[c.domain],
        topic: c.subtraits.some((t) => t.id === a.topic) ? a.topic! : null,
        profile: profileTraits.some((p) => p.id === a.profile && p.domain === c.domain)
          ? a.profile!
          : null,
        illustration:
          a.illustration && illustrationIds.includes(a.illustration) ? a.illustration : null,
        step: 0,
        visible: s.visible.includes(c.domain) ? s.visible : [...s.visible, c.domain],
        isolate: false,
        previousCamera: null,
      });
    }
    case 'clear':
      return fit({
        ...s,
        selected: null,
        topic: null,
        profile: null,
        illustration: null,
        isolate: false,
        previousCamera: null,
      });
    case 'group':
      return groupIds.includes(a.id)
        ? fit({
            ...s,
            view: 'body',
            group: a.id,
            selected: null,
            topic: null,
            profile: null,
            illustration: null,
            isolate: false,
            explode: 0,
            previousCamera: null,
          })
        : s;
    case 'topic':
      return s.selected && capabilityById[s.selected]?.subtraits.some((t) => t.id === a.id)
        ? { ...s, topic: a.id, illustration: null }
        : s;
    case 'illustration':
      return s.selected && illustrationIds.includes(a.id)
        ? fit({ ...s, illustration: a.id, topic: null, step: 0, explode: 0, isolate: false })
        : s;
    case 'example':
      return ['shelf', 'carry', 'basketball'].includes(a.value) ? { ...s, example: a.value } : s;
    case 'step':
      return Number.isFinite(a.value)
        ? {
            ...s,
            step: Math.max(
              0,
              Math.min(s.illustration === 'precision' ? 4 : 2, Math.round(a.value)),
            ),
          }
        : s;
    case 'execution':
      return executionModes.includes(a.value) ? { ...s, execution: a.value, step: 0 } : s;
    case 'availability':
      return {
        ...s,
        bodyAvailable: a.body ?? s.bodyAvailable,
        recoveryAvailable: a.recovery ?? s.recoveryAvailable,
      };
    case 'finish':
      return ['Coral', 'Cobalt', 'Pearl'].includes(a.value) ? { ...s, finish: a.value } : s;
    case 'home':
      return fit({
        ...s,
        view: 'body',
        group: null,
        selected: null,
        topic: null,
        profile: null,
        illustration: null,
        isolate: false,
        explode: 0,
        previousCamera: null,
      });
    case 'back':
      if (s.illustration) return fit({ ...s, illustration: null, step: 0 });
      if (s.topic) return { ...s, topic: null };
      if (s.selected)
        return fit({
          ...s,
          selected: null,
          topic: null,
          profile: null,
          isolate: false,
          previousCamera: null,
        });
      return fit({ ...s, group: null });
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
        topic: c && visible.includes(c.domain) ? s.topic : null,
        profile: c && visible.includes(c.domain) ? s.profile : null,
        illustration: c && visible.includes(c.domain) ? s.illustration : null,
        isolate: false,
        previousCamera: null,
      });
    }
    case 'reset':
      return { ...initialState(), cameraRevision: s.cameraRevision + 1 };
    case 'refit':
      return fit(s);
    case 'zoom': {
      if (!Number.isFinite(a.factor) || a.factor <= 0) return s;
      const distance = Math.hypot(...s.camera.position.map((v, i) => v - s.camera.target[i]));
      const scale = Math.max(0.3, Math.min(150, distance * a.factor)) / Math.max(0.001, distance);
      return {
        ...s,
        camera: {
          ...s.camera,
          position: s.camera.position.map(
            (v, i) => s.camera.target[i] + (v - s.camera.target[i]) * scale,
          ) as unknown as Vec3,
        },
        cameraIntent: 'restore',
        cameraRevision: s.cameraRevision + 1,
      };
    }
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
