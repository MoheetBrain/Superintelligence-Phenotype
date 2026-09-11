import { ArrowDown, ArrowUpRight, Cpu, Fingerprint, Network, MoveUpRight } from 'lucide-react';
import { profileFrames, profileTraits } from '../data/profile';
import { domainById } from '../data/domains';
import type { Action } from '../state/explorerReducer';
import { Button } from './ui/Button';

export function jumpTo(id: string) {
  const element = document.getElementById(id);
  element?.scrollIntoView({ block: 'start' });
  element?.focus({ preventScroll: true });
}

export function PhenotypeOverview({ dispatch }: { dispatch: (a: Action) => void }) {
  return (
    <aside className="phenotype-overview" aria-label="Phenotype overview">
      <span className="section-caption">
        <span className="status-dot" /> A FUTURE PROFILE
      </span>
      <h2>
        More than <br />a brilliant <br />
        <em>machine.</em>
      </h2>
      <p>
        Artificial superintelligence: a hypothetical system that could surpass human capabilities
        across a wide range of intellectual tasks.
      </p>
      <div className="overview-dimensions">
        <button onClick={() => dispatch({ type: 'select', id: 'cognition' })}>
          <Cpu size={18} />
          <span>
            <strong>Think beyond us</strong>
            <small>Reasoning · knowledge · self-checking</small>
          </span>
          <ArrowUpRight size={16} />
        </button>
        <button onClick={() => dispatch({ type: 'select', id: 'agency' })}>
          <Fingerprint size={18} />
          <span>
            <strong>Act in the world</strong>
            <small>Agency · embodiment · control</small>
          </span>
          <ArrowUpRight size={16} />
        </button>
        <button onClick={() => dispatch({ type: 'select', id: 'substrate-mobility' })}>
          <Network size={18} />
          <span>
            <strong>Exist across forms</strong>
            <small>Coordination · memory · migration</small>
          </span>
          <ArrowUpRight size={16} />
        </button>
      </div>
      <p className="overview-caveat">
        Possible powers. Physical limits. Open questions. This is a map of hypotheses, not a
        measured ASI system.
      </p>
    </aside>
  );
}

export function ProfilePreview({ dispatch }: { dispatch: (a: Action) => void }) {
  return (
    <aside className="profile-preview" aria-label="Capability profile preview">
      <div className="profile-preview-title">
        <span className="section-caption">CAPABILITY SNAPSHOT</span>
        <MoveUpRight size={20} />
      </div>
      <h2>
        What might{' '}
        <br />
        it be capable of?
      </h2>
      <p className="preview-caption">Qualitative future hypotheses</p>
      <dl>
        {['strength', 'strategy', 'parallel', 'mobility', 'persistence'].map((id) => {
          const trait = profileTraits.find((t) => t.id === id)!;
          return (
            <div key={id}>
              <dt>{id === 'parallel' ? 'Parallel reach' : trait.name}</dt>
              <dd>{trait.value}</dd>
            </div>
          );
        })}
      </dl>
      <Button onClick={() => jumpTo('capability-profile')}>
        Read the capability profile <ArrowDown size={16} />
      </Button>
      <button
        id="preview-metacognition"
        className="text-link"
        onClick={() => dispatch({ type: 'select', id: 'metacognition' })}
      >
        Explore Metacognition <ArrowUpRight size={15} />
      </button>
      <p className="preview-footnote">
        Every power has a dependency. Every hypothesis needs evidence.
      </p>
    </aside>
  );
}

export function CapabilityProfile({
  dispatch,
  onMethodology,
}: {
  dispatch: (a: Action) => void;
  onMethodology: () => void;
}) {
  return (
    <section className="profile-section publication-section" aria-labelledby="capability-profile">
      <div className="section-intro">
        <div>
          <span className="section-caption">02 / POSSIBLE CAPABILITIES</span>
          <h2 id="capability-profile" tabIndex={-1}>
            A spec sheet for <em>the possible.</em>
          </h2>
        </div>
        <p>
          What could it do? What would hold it back?
          <br />
          Open a trait to inspect the conditions behind the power.
        </p>
      </div>
      <div className="profile-framing">
        <span>READING THE PROFILE</span>
        <p>
          All entries below are qualitative scenarios. No lift capacities, speed records or ASI
          scores have been measured for this project.
        </p>
        <button className="text-link" onClick={onMethodology}>
          What counts as evidence? <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="frame-legend" aria-label="Profile framing modes">
        {profileFrames.map((frame, i) => (
          <span key={frame}>
            <b>{String(i + 1).padStart(2, '0')}</b>
            {frame}
          </span>
        ))}
      </div>
      <p className="frame-note">
        These labels describe the kind of scenario, not its probability or arrival date. “Observed
        today” is reserved for scoped, sourced results; none of these future profiles uses it.
      </p>
      <div className="profile-card-grid">
        {profileTraits.map((trait, i) => (
          <details className="profile-card" key={trait.id}>
            <summary>
              <span className="profile-card-top">
                <span>{trait.group}</span>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </span>
              <h3>{trait.name}</h3>
              <span className="trait-value">{trait.value}</span>
              <span className="profile-card-bottom">
                <span
                  className={`scenario-tag ${trait.frame.startsWith('Speculative') ? 'scenario-speculative' : ''}`}
                >
                  {trait.frame}
                </span>
                <span className="expand-symbol" aria-hidden="true">
                  +
                </span>
              </span>
            </summary>
            <div className="profile-detail">
              <p>{trait.meaning}</p>
              <h4>What it could enable</h4>
              <p>{trait.enables}</p>
              <h4>What it does not imply</h4>
              <p>{trait.limit}</p>
              <h4>How it might scale</h4>
              <p>{trait.scaling}</p>
              <p className="profile-evidence-note">
                Scenario, not an empirical result. Sources in the linked phenotype dossier address
                their stated tasks; they do not validate this future capability.
              </p>
              <Button onClick={() => dispatch({ type: 'select', id: trait.domain })}>
                Open {domainById[trait.domain].name} dossier <ArrowUpRight size={16} />
              </Button>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FutureForms({ dispatch }: { dispatch: (a: Action) => void }) {
  return (
    <section className="future-forms publication-section" aria-labelledby="future-forms">
      <span className="section-caption">03 / FUTURE FORMS</span>
      <div className="future-statement">
        <h2 id="future-forms" tabIndex={-1}>
          The body is an interface.
          <br />
          <em>The boundary is a question.</em>
        </h2>
        <p>
          Losing one body need not end an intelligence’s operation—if its computation or recoverable
          state exists elsewhere. A humanoid could be one presence among many.
        </p>
      </div>
      <div className="forms-grid">
        <article>
          <span className="form-number">I</span>
          <h3>One system. Many interfaces.</h3>
          <p>
            A system might control a robot, remote tools or authorized infrastructure while its
            computation stays on the same host.
          </p>
          <button
            className="text-link"
            onClick={() => dispatch({ type: 'select', id: 'embodiment' })}
          >
            Remote control <ArrowUpRight size={15} />
          </button>
        </article>
        <article>
          <span className="form-number">II</span>
          <h3>A different place to run.</h3>
          <p>
            Migration would move computation and relevant state to a compatible host. Access,
            transfer and recovery must actually work.
          </p>
          <button
            className="text-link"
            onClick={() => dispatch({ type: 'select', id: 'substrate-mobility' })}
          >
            Substrate migration <ArrowUpRight size={15} />
          </button>
        </article>
        <article>
          <span className="form-number">III</span>
          <h3>Copies, then different lives?</h3>
          <p>
            Replication could create separate instances. They may diverge; copying does not
            establish one shared mind or continuous subjective identity.
          </p>
          <button
            className="text-link"
            onClick={() => dispatch({ type: 'select', id: 'replication' })}
          >
            Independent instances <ArrowUpRight size={15} />
          </button>
        </article>
      </div>
      <p className="forms-caveat">
        Long-term ASI hypotheses · No guarantee of migration, personal continuity or immortality.
        Every form would still depend on energy, hardware, access and governance.
      </p>
    </section>
  );
}
