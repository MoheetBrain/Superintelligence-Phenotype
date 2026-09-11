import { ArrowRight, RotateCcw } from 'lucide-react';
import type { ExplorerState, Action } from '../state/explorerReducer';
import {
  executionModes,
  executionSnapshot,
  strengthTasks,
  precisionSteps,
} from '../data/illustrations';
import { Button } from './ui/Button';
export function IllustrationPanel({
  state: s,
  dispatch,
}: {
  state: ExplorerState;
  dispatch: (a: Action) => void;
}) {
  const execution = executionSnapshot(s.execution, s.step, s.bodyAvailable, s.recoveryAvailable);
  return (
    <section className="illustration-panel" aria-label="Interactive explanation">
      <p className="illustration-label">LOCAL ILLUSTRATION · NOT A VALIDATED SIMULATION</p>
      {s.illustration === 'strength' && (
        <>
          <p>
            Choose a task. The highlighted arms, grasp and support areas show what the action would
            depend on.
          </p>
          <div className="demo-options" role="group" aria-label="Strength task">
            {strengthTasks.map((t) => (
              <button
                key={t.id}
                aria-pressed={s.example === t.id}
                onClick={() => dispatch({ type: 'example', value: t.id })}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="demo-response" aria-live="polite">
            <h3>{(strengthTasks.find((t) => t.id === s.example) ?? strengthTasks[0]).name}</h3>
            <p>{(strengthTasks.find((t) => t.id === s.example) ?? strengthTasks[0]).detail}</p>
            <h4>Variables that determine success</h4>
            <p>{(strengthTasks.find((t) => t.id === s.example) ?? strengthTasks[0]).variables}</p>
          </div>
          <p className="muted">
            The body highlights requirements; it does not calculate loads or demonstrate a
            successful lift. No payload or force has been measured.
          </p>
        </>
      )}
      {s.illustration === 'precision' && (
        <>
          <p>Follow one correction cycle. Each step highlights its visual context on the robot.</p>
          <ol className="precision-steps">
            {precisionSteps.map((p, i) => (
              <li key={p.name}>
                <button
                  aria-pressed={s.step === i}
                  onClick={() => dispatch({ type: 'step', value: i })}
                >
                  <span>{i + 1}</span>
                  {p.name}
                </button>
              </li>
            ))}
          </ol>
          <div className="demo-response" aria-live="polite">
            <h3>{precisionSteps[s.step].name}</h3>
            <p>{precisionSteps[s.step].text}</p>
          </div>
          <Button onClick={() => dispatch({ type: 'step', value: (s.step + 1) % 5 })}>
            {s.step === 4 ? 'Start another cycle' : 'Next stage'}
            <ArrowRight size={16} />
          </Button>
          <p className="muted">
            Accuracy concerns closeness to a target; repeatability concerns consistency across
            repeats. Total response includes sensing, communication, computation and mechanical
            movement.
          </p>
        </>
      )}
      {s.illustration === 'execution' && (
        <>
          <p>
            Compare where computation runs and what transfers. Hosts and paths in the scene follow
            the arrangement selected here.
          </p>
          <div className="demo-options" role="group" aria-label="Execution arrangement">
            {executionModes.map((m) => (
              <button
                key={m}
                aria-pressed={s.execution === m}
                onClick={() => dispatch({ type: 'execution', value: m })}
              >
                {m === 'remote' ? 'Remote control' : m === 'migration' ? 'Migration' : 'Copying'}
              </button>
            ))}
          </div>
          <div className="execution-ledger" aria-label="Host execution status">
            <span data-running={execution.source}>{execution.sourceLabel}</span>
            <span data-running={execution.destination}>{execution.destinationLabel}</span>
          </div>
          <div className="demo-response" aria-live="polite">
            <h3>{execution.phase}</h3>
            <p>{execution.detail}</p>
            <p>{execution.bodyStatus}</p>
          </div>
          {s.execution !== 'remote' && (
            <div className="demo-step-controls">
              <span>Step {s.step + 1} / 3</span>
              <Button onClick={() => dispatch({ type: 'step', value: (s.step + 1) % 3 })}>
                {s.step === 2 ? (
                  <>
                    <RotateCcw size={15} />
                    Restart handoff
                  </>
                ) : (
                  <>
                    Next step
                    <ArrowRight size={15} />
                  </>
                )}
              </Button>
            </div>
          )}
          <fieldset className="availability-controls">
            <legend>Test the conditions</legend>
            <label>
              <input
                type="checkbox"
                checked={s.bodyAvailable}
                onChange={(e) => dispatch({ type: 'availability', body: e.target.checked })}
              />
              Robot body available
            </label>
            <label>
              <input
                type="checkbox"
                checked={s.recoveryAvailable}
                onChange={(e) => dispatch({ type: 'availability', recovery: e.target.checked })}
              />
              Compute or recoverable state, compatible resources and access available
            </label>
          </fieldset>
          <p className="muted">
            All hosts and transfers are illustrative and local. Operational continuity does not
            establish continuous subjective identity.
          </p>
        </>
      )}
    </section>
  );
}
