import type { View } from '../state/explorerReducer';
import { Button } from './ui/Button';
export function RoadmapView({ view, onReturn }: { view: View; onReturn: () => void }) {
  return (
    <section className="roadmap">
      <span className="eyebrow">ATLAS / {view.toUpperCase()}</span>
      <h2>{view === 'network' ? 'Intelligence beyond one body.' : 'Many possible branches.'}</h2>
      <span className="planned">Planned—not implemented.</span>
      <p>
        {view === 'network'
          ? 'A future network view will map computers, memory, agents, sensors, robots, laboratories and resources. Execution, observation, control, migration and copying will be distinct relationships.'
          : 'A future evolution view will explore branching hypotheses about persistence, cooperation, specialisation, inheritance and higher-order organisation. There is no single inevitable ascent.'}
      </p>
      <Button variant="default" onClick={onReturn}>
        Return to Body
      </Button>
    </section>
  );
}
