/** Local explanatory state machine. These records never leave this browser. */
export type HostId = 'host-a' | 'host-b';
export const transferModes = ['migrate', 'copy', 'fork'] as const;
export type TransferMode = (typeof transferModes)[number];
export const hostViews = ['dual', 'host-a', 'host-b', 'transfer'] as const;
export type HostView = (typeof hostViews)[number];
export type TransferPhase =
  | 'ready'
  | 'receiving'
  | 'checking'
  | 'restoring'
  | 'complete'
  | 'diverged';
export interface OperationalState {
  id: string;
  lineageId: string;
  generation: number;
  taskContext: string;
  memoryVersion: number;
  planVersion: number;
}
export interface MobilityState {
  mode: TransferMode;
  phase: TransferPhase;
  remote: boolean;
  explored: boolean;
  revision: number;
  fromDrop: boolean;
}
export type MobilityAction =
  | { type: 'mode'; mode: TransferMode }
  | { type: 'start'; mode: TransferMode; immediate?: boolean; fromDrop?: boolean }
  | { type: 'advance'; revision: number }
  | { type: 'remote'; enabled: boolean }
  | { type: 'reset' };
export const initialMobility = (): MobilityState => ({
  mode: 'migrate',
  phase: 'ready',
  remote: false,
  explored: false,
  revision: 0,
  fromDrop: false,
});
export const isTransferring = (s: MobilityState) =>
  ['receiving', 'checking', 'restoring'].includes(s.phase);
export const isTransferred = (s: MobilityState) => s.phase === 'complete' || s.phase === 'diverged';
export function mobilityReducer(s: MobilityState, a: MobilityAction): MobilityState {
  switch (a.type) {
    case 'reset':
      return { ...initialMobility(), explored: s.explored, revision: s.revision + 1 };
    case 'mode':
      return { ...s, mode: a.mode, remote: false, phase: 'ready', revision: s.revision + 1 };
    case 'remote':
      return { ...s, remote: a.enabled, phase: 'ready', revision: s.revision + 1 };
    case 'start':
      if (isTransferring(s) || s.remote) return s;
      return {
        ...s,
        mode: a.mode,
        fromDrop: a.fromDrop ?? false,
        phase: a.immediate ? (a.mode === 'fork' ? 'diverged' : 'complete') : 'receiving',
        explored: true,
        revision: s.revision + 1,
      };
    case 'advance': {
      if (a.revision !== s.revision || s.remote) return s;
      const next: Partial<Record<TransferPhase, TransferPhase>> = {
        receiving: 'checking',
        checking: 'restoring',
        restoring: 'complete',
        complete: s.mode === 'fork' ? 'diverged' : undefined,
      };
      return next[s.phase] ? { ...s, phase: next[s.phase]! } : s;
    }
  }
}
const seed = (): OperationalState => ({
  id: 'instance-a',
  lineageId: 'common-state',
  generation: 0,
  taskContext: 'Inspect the sample',
  memoryVersion: 1,
  planVersion: 1,
});
export interface HostSnapshot {
  id: HostId;
  status: 'active' | 'available' | 'inactive' | 'receiving';
  detail: string;
  state: OperationalState | null;
  actuator: boolean;
}
export function hostSnapshots(s: MobilityState): [HostSnapshot, HostSnapshot] {
  const done = isTransferred(s),
    busy = isTransferring(s),
    moved = s.mode === 'migrate' && (done || busy);
  const a = seed();
  const b = done
    ? {
        ...a,
        id: s.mode === 'migrate' ? a.id : 'instance-b',
        generation: s.mode === 'migrate' ? 0 : 1,
      }
    : null;
  if (s.phase === 'diverged' && b) {
    a.memoryVersion = 2;
    a.taskContext = 'Inspect sample A';
    b.memoryVersion = 3;
    b.planVersion = 2;
    b.taskContext = 'Inspect sample B';
  }
  return [
    {
      id: 'host-a',
      status: moved ? 'inactive' : 'active',
      detail: moved
        ? done
          ? 'State: transferred'
          : 'Execution paused'
        : done
          ? 'Instance A · state loaded'
          : 'State: loaded',
      state: moved ? null : a,
      actuator: false,
    },
    {
      id: 'host-b',
      status: done ? 'active' : busy ? 'receiving' : 'available',
      detail: s.remote
        ? 'Actuator · no local agent'
        : done
          ? s.mode === 'migrate'
            ? 'State: restored'
            : 'Instance B · state loaded'
          : busy
            ? 'State: restoring'
            : 'State: empty',
      state: b,
      actuator: s.remote,
    },
  ];
}
export function mobilityAnnouncement(s: MobilityState) {
  if (s.remote)
    return 'Remote control: computation remains on Host A. Host B acts as an interface/body. Commands and observations cross the link; operational state does not move.';
  const phases = {
    ready: 'Drag Operational State from Host A to Host B, or use the action buttons.',
    receiving:
      'Host B receives state. Source execution is paused for migration; copying and forking keep it active.',
    checking: 'Compatibility check: runtime, compute, memory, permissions and I/O.',
    restoring: 'State restoration: task context, memory and plans are restored.',
    complete:
      s.mode === 'migrate'
        ? 'Operational state transferred from Host A to Host B. Host B is now active. Host A is inactive.'
        : 'Host A and Host B are active. Two separate instances begin from shared state.',
    diverged:
      'Host A and Host B share an ancestor. Their memories, plans and task contexts now diverge.',
  };
  return phases[s.phase];
}
