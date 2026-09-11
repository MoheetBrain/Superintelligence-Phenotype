import { initialState, type ExplorerState, type CameraState } from './explorerReducer';
import { domainIds } from '../data/domains';
import { capabilityById } from '../data/capabilities';
import { evidenceLevels } from '../content/methodology';
import type { Vec3 } from '../data/schema';
export function serializeState(s: ExplorerState): string {
  const p = new URLSearchParams({
    v: '1',
    view: s.view,
    layers: s.visible.length === 12 ? 'all' : s.visible.length ? s.visible.join(',') : 'none',
    isolate: s.isolate ? '1' : '0',
    explode: String(s.explode),
    pos: s.camera.position.map((n) => n.toFixed(5)).join(','),
    target: s.camera.target.map((n) => n.toFixed(5)).join(','),
  });
  if (s.selected) p.set('cap', s.selected);
  if (s.query) p.set('q', s.query);
  if (s.evidence !== 'all') p.set('evidence', s.evidence);
  if (s.previousCamera) {
    p.set('prevPos', s.previousCamera.position.join(','));
    p.set('prevTarget', s.previousCamera.target.join(','));
  }
  return '#' + p.toString();
}
function vector(raw: string | null): Vec3 | null {
  if (!raw) return null;
  const chunks = raw.split(',');
  if (chunks.length !== 3 || chunks.some((x) => !x.trim())) return null;
  const a = chunks.map(Number);
  return a.every((n) => Number.isFinite(n) && Math.abs(n) <= 100) ? (a as unknown as Vec3) : null;
}
function camera(pos: string | null, target: string | null): CameraState | null {
  const p = vector(pos),
    t = vector(target);
  if (!p || !t) return null;
  const distance = Math.hypot(...p.map((v, i) => v - t[i]));
  return distance >= 0.2 && distance <= 150 ? { position: p, target: t } : null;
}
export function parseState(hash: string): ExplorerState {
  const s = initialState();
  if (hash.length > 5000) return s;
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  if (p.get('v') !== '1') return s;
  const view = p.get('view');
  if (view === 'network' || view === 'evolution') s.view = view;
  const layers = p.get('layers');
  if (layers !== null && layers !== 'all')
    s.visible = domainIds.filter((id) => layers.split(',').includes(id));
  const cap = p.get('cap');
  if (cap && capabilityById[cap]) {
    s.selected = cap;
    const domain = capabilityById[cap]!.domain;
    if (!s.visible.includes(domain)) s.visible.push(domain);
  }
  s.isolate = p.get('isolate') === '1' && !!s.selected;
  const n = Number(p.get('explode'));
  s.explode = s.isolate ? 0 : Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0;
  s.query = (p.get('q') ?? '').slice(0, 300);
  const evidence = p.get('evidence');
  s.evidence = evidenceLevels.find((e) => e === evidence) ?? 'all';
  const shared = camera(p.get('pos'), p.get('target'));
  if (shared) {
    s.camera = shared;
    s.cameraIntent = 'restore';
  }
  s.previousCamera = s.isolate ? camera(p.get('prevPos'), p.get('prevTarget')) : null;
  return s;
}
