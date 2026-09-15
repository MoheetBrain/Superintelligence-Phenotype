import { relevantState, requirements, failures } from '../content/mobility';
export function SubstrateMobility() {
  return (
    <section className="substrate-dossier" aria-label="Substrate mobility framework">
      <p className="meaning">
        The capacity to preserve task-relevant operational organisation when changing execution
        environment.
      </p>
      <h3>Relevant operational state</h3>
      <ul className="state-inventory">
        {relevantState.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        A visual abstraction of information required for functional continuation. It is not a claim
        about consciousness or personal identity.
      </p>
      <h3>Requirements for continuation</h3>
      <ol className="requirement-chain">
        {requirements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <p className="continuation-result">↓ Possible functional continuation</p>
      <h3>Where it can fail</h3>
      <ul>
        {failures.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3>The open identity question</h3>
      <p>
        If two implementations contain sufficiently similar functional state, when is it useful to
        call them the same agent?
      </p>
      <p>
        Which information must remain invariant is unresolved. Operational continuity does not
        settle consciousness, numerical identity, or subjective survival.
      </p>
      <h3>Keep these arrangements distinct</h3>
      <dl className="mobility-distinctions">
        <dt>Migration</dt>
        <dd>One illustrated execution stops before it resumes on another host.</dd>
        <dt>Copying & forking</dt>
        <dd>Two instances share earlier state; their subsequent histories may differ.</dd>
        <dt>Synchronisation</dt>
        <dd>
          Selected updates are reconciled between instances. This is not automatically one identity.
        </dd>
        <dt>Distributed execution</dt>
        <dd>Work spans multiple hosts at once, with communication and consistency requirements.</dd>
        <dt>Embodiment switching</dt>
        <dd>
          An agent changes the body/interface it uses. Computation may stay on the original host.
        </dd>
      </dl>
    </section>
  );
}
export function MobilityImplications() {
  return (
    <details className="mobility-implications" open>
      <summary>
        Why substrate mobility matters <span>Theoretically Plausible</span>
      </summary>
      <p>
        If an advanced agent’s relevant operational state can be preserved and resumed across
        compatible hardware, destroying or disabling one physical body would not necessarily
        terminate every recoverable implementation of that agent.
      </p>
      <p>
        Distributed copies could also make technical containment and enforcement more difficult.
      </p>
      <p>
        <strong>This does not imply that regulation or prohibition is impossible.</strong> Legal
        control, compute governance, network controls, hardware access, authentication, physical
        infrastructure, and other mechanisms may still constrain deployment.
      </p>
      <small>
        The demo illustrates a hypothesis, not a demonstrated ability of a present-day autonomous
        superintelligence.
      </small>
    </details>
  );
}
