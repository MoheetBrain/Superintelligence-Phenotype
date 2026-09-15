import { ArrowRight, RotateCcw, Radio, Info } from 'lucide-react';
import {
  hostSnapshots,
  hostViews,
  isTransferring,
  mobilityAnnouncement,
  type HostView,
} from '../state/mobility';
import { mobilityExplanations } from '../content/mobility';
import type { Action, ExplorerState } from '../state/explorerReducer';
import { MobilityImplications } from './SubstrateMobility';
export function HostCameraControls({
  value,
  dispatch,
  annotationsHidden = false,
  onToggleAnnotations,
}: {
  value: HostView;
  dispatch: (a: Action) => void;
  annotationsHidden?: boolean;
  onToggleAnnotations?: () => void;
}) {
  return (
    <div className="host-camera-controls" role="group" aria-label="Host camera presets">
      {hostViews.map((v) => (
        <button
          key={v}
          aria-pressed={value === v}
          onClick={() => dispatch({ type: 'host-view', value: v })}
        >
          {v === 'dual'
            ? 'Dual host'
            : v === 'transfer'
              ? 'Transfer view'
              : v === 'host-a'
                ? 'Host A'
                : 'Host B'}
        </button>
      ))}
      <details className="part-inspection">
        <summary>Inspect parts</summary>
        <div>
          {(
            [
              ['Head', 'cognition'],
              ['Torso', 'agency'],
              ['Hands', 'embodiment'],
            ] as const
          ).map(([name, id]) => (
            <button
              key={id}
              onClick={(e) => {
                dispatch({ type: 'select', id });
                dispatch({ type: 'isolate' });
                e.currentTarget.closest('details')?.removeAttribute('open');
              }}
            >
              Inspect {name.toLowerCase()}
            </button>
          ))}
        </div>
      </details>
      {onToggleAnnotations && (
        <button aria-pressed={annotationsHidden} onClick={onToggleAnnotations}>
          {annotationsHidden ? 'Show annotations' : 'Hide annotations'}
        </button>
      )}
    </div>
  );
}
export function MobilityControls({
  state,
  dispatch,
  onStart,
}: {
  state: ExplorerState;
  dispatch: (a: Action) => void;
  onStart: (mode: 'migrate' | 'copy' | 'fork') => void;
}) {
  const s = state.mobility,
    busy = isTransferring(s),
    hosts = hostSnapshots(s);
  if (state.illustration === 'execution') return null;
  return (
    <section className="mobility-controls" aria-label="Substrate mobility demonstration">
      <div className="mobility-control-heading">
        <div>
          <span className="lab-caption">A LOCAL EXPLANATORY DEMONSTRATION</span>
          <h2>One architecture. Two possible hosts.</h2>
        </div>
        <span className="lab-evidence">Theoretically Plausible</span>
      </div>
      <div className="host-status-ledger" aria-label="Dual host status">
        {hosts.map((h) => (
          <div key={h.id} data-testid={`${h.id}-status`} data-active={h.status === 'active'}>
            <strong>{h.id === 'host-a' ? 'HOST A' : 'HOST B'}</strong>
            <span>{h.status.toUpperCase()}</span>
            <small>{h.detail}</small>
          </div>
        ))}
      </div>
      <div className="transfer-action-row">
        <div role="group" aria-label="Transfer actions" className="transfer-actions">
          {(['migrate', 'copy', 'fork'] as const).map((mode) => (
            <button
              key={mode}
              aria-label={`${mode[0].toUpperCase() + mode.slice(1)} A → B`}
              className={s.mode === mode && !s.remote ? 'primary-transfer' : ''}
              disabled={busy || s.remote}
              onClick={() => onStart(mode)}
            >
              {mode[0].toUpperCase() + mode.slice(1)} A <ArrowRight size={14} /> B
            </button>
          ))}
          <button onClick={() => dispatch({ type: 'mobility', action: { type: 'reset' } })}>
            <RotateCcw size={14} />
            <span>Reset demonstration</span>
          </button>
        </div>
        <label className="remote-toggle">
          <input
            type="checkbox"
            checked={s.remote}
            onChange={(e) =>
              dispatch({ type: 'mobility', action: { type: 'remote', enabled: e.target.checked } })
            }
          />
          <Radio size={15} />
          Compare with remote control
        </label>
      </div>
      {s.explored && (
        <fieldset className="transfer-mode">
          <legend>Transfer mode for dragging</legend>
          {(['migrate', 'copy', 'fork'] as const).map((mode) => (
            <label key={mode}>
              <input
                type="radio"
                name="transfer-mode"
                value={mode}
                checked={s.mode === mode && !s.remote}
                onChange={() => dispatch({ type: 'mobility', action: { type: 'mode', mode } })}
              />
              {mode[0].toUpperCase() + mode.slice(1)}
            </label>
          ))}
        </fieldset>
      )}
      <p className="transfer-live" role="status" aria-live="polite" aria-atomic="true">
        {mobilityAnnouncement(s)}
      </p>
      {s.remote ? (
        <div className="remote-distinction">
          <strong>Remote control ≠ migration</strong>
          <span>Computation remains on HOST A. HOST B acts as an interface/body.</span>
          <span>commands + observations</span>
        </div>
      ) : (
        <p className="mode-explanation">{mobilityExplanations[s.mode]}</p>
      )}
      {s.phase === 'diverged' && (
        <div className="fork-lineage" aria-label="Fork lineage">
          <span>COMMON STATE</span>
          <div>
            ↙ <span>shared ancestor</span> ↘
          </div>
          <div>
            Instance A · memory v2 <span>≠</span> Instance B · memory v3
          </div>
          <strong>Diverging histories</strong>
        </div>
      )}
      <div className="mobility-reading">
        <button
          onClick={() => dispatch({ type: 'select', id: 'substrate-mobility', group: 'beyond' })}
        >
          <Info size={15} />
          Inspect Substrate Mobility
          <ArrowRight size={14} />
        </button>
        <small>
          Each comparison begins from the same illustrative starting state. No software, credentials
          or data move between machines.
        </small>
      </div>
      {s.explored && <MobilityImplications />}
    </section>
  );
}
