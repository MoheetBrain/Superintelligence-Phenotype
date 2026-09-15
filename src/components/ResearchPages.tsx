import { useState } from 'react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import results from '../content/forecast-results.json';

const source = 'https://github.com/MoheetBrain/ASI-Arrival-Calculator';
const revision = `${source}/blob/${results.sourceCommit}`;
const atlasSource = 'https://github.com/MoheetBrain/Superintelligence-Phenotype';
const noteSource = `${atlasSource}/blob/codex/asi-atlas/public/research/state-space-framework-v0.1.md`;
const month = (value: string) =>
  new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${value}-01T00:00:00Z`),
  );

export function Timeline() {
  const entries = [
    {
      date: '2026-06-29',
      label: '29 June 2026',
      type: 'Forecasting prototype',
      title: 'ASI Arrival Calculator',
      body: 'First source revision of the public forecasting project. The repository develops a conditional model of AGI and the subsequent transition to ASI.',
      href: `${source}/commit/789af6f4bc02b47fc9dc2351714be7feda844a86`,
      evidence: 'Original source commit · recorded 20:30:42 UTC',
    },
    {
      date: '2026-07-01',
      label: '1 July 2026',
      type: 'Model revision',
      title: 'Assumptions and regime made explicit',
      body: 'The forecasting revision documents its fast-takeoff regime and parameter sources. This is the exact revision used for the sensitivity analysis on this site.',
      href: `${source}/commit/${results.sourceCommit}`,
      evidence: 'Original merge commit · recorded 15:19:38 UTC',
    },
    {
      date: '2026-09-11',
      label: '11 September 2026',
      type: 'Interactive research map',
      title: 'Superintelligence Map / ASI Atlas',
      body: 'The first interactive Body explorer source revision: a map of candidate capabilities, their proposed measurements and the limits of the evidence.',
      href: `${atlasSource}/commit/48fff46137eea1871aabc4b6aede57b56cacac22`,
      evidence: 'Original implementation commit · recorded 11:17:48 UTC',
    },
    {
      date: '2026-09-15',
      label: '15 September 2026',
      type: 'Proposed framework',
      title: 'State-space framework, working note v0.1',
      body: 'A first working note defines candidate state variables and a proposed evaluation protocol. No empirical results or proof of catastrophe are claimed.',
      href: '/research/state-space-framework-v0.1.pdf',
      evidence: 'Authored 14 September · published 15 September 2026',
    },
  ];
  return (
    <>
      <p className="research-lead">
        A record of the work as it developed, with the original artifacts attached.
      </p>
      <div className="timeline-principle">
        <span>Archival principle</span>
        <p>
          Contemporaneous evidence <span aria-label="is stronger than">&gt;</span> retrospective
          claim
        </p>
      </div>
      <ol className="research-timeline">
        {entries.map((entry) => (
          <li key={entry.date}>
            <div className="timeline-date">
              <time dateTime={entry.date}>{entry.label}</time>
              <span>{entry.type}</span>
            </div>
            <article>
              <h2>
                <a href={entry.href}>
                  {entry.title}
                  <ArrowUpRight size={19} />
                </a>
              </h2>
              <p>{entry.body}</p>
              <a className="artifact-permalink" href={entry.href}>
                Original artifact <ArrowUpRight size={14} />
              </a>
              <p className="timeline-evidence">{entry.evidence}</p>
            </article>
          </li>
        ))}
      </ol>
      <aside className="archive-note">
        <h2>Earlier writing: archive incomplete</h2>
        <p>
          The reported June 2025 alignment / value-drift post and subsequent autonomy, monitoring
          and interpretability posts are awaiting recoverable original sources and exact dates. The
          available June-post permalink currently reports “Post not found.” These items are not
          included as verified timeline entries.
        </p>
        <p className="research-muted">
          Git commit dates describe recorded source history, not independent proof of when an idea
          was first conceived. Checked 14 September 2026.
        </p>
      </aside>
    </>
  );
}

const driverLabels: Record<string, string> = {
  agent_time_horizon_doubling_months: 'Agent-horizon doubling time',
  infrastructure_friction_months: 'Infrastructure delay',
  effective_compute_growth_x_per_year: 'Compute growth',
  algorithmic_efficiency_x_per_year: 'Algorithmic efficiency',
  current_agent_task_horizon_hours: 'Starting task horizon',
};

export function Forecasting() {
  const [target, setTarget] = useState('internal_asi');
  const targets = [
    ['agi', 'AGI'],
    ['internal_asi', 'Internal ASI'],
    ['public_asi', 'Public ASI'],
  ];
  return (
    <>
      <p className="research-lead">
        Explore how explicit assumptions produce different timelines. Inspect the model before
        interpreting its dates.
      </p>
      <article className="forecast-project">
        <div>
          <p className="research-eyebrow">Experimental structural forecast</p>
          <h2>ASI Arrival Calculator</h2>
          <p>
            A public Python Monte Carlo model that separates an AGI capability threshold, the
            transition to internal ASI, and subsequent public availability.
          </p>
          <a className="research-text-link" href={source}>
            Open the calculator & code <ArrowUpRight size={17} />
          </a>
        </div>
        <aside>
          <strong>Fast-takeoff regime</strong>
          <p>
            The source labels key cognitive lags as aggressive / stress-test assumptions. These
            outputs are conditional scenarios, not a consensus forecast or a claim that ASI has
            arrived.
          </p>
          <a href={`${revision}/README.md`}>Read the model’s stated limitations</a>
        </aside>
      </article>
      <section className="research-method">
        <div className="research-section-label">
          <h2>Monte Carlo methodology</h2>
          <a href={`${revision}/src/asi_forecast/monte_carlo.py`}>
            Simulation source <ArrowUpRight size={14} />
          </a>
        </div>
        <ol className="method-steps">
          <li>
            <span>01</span>
            <div>
              <h3>Sample uncertain inputs</h3>
              <p>
                Draw from the configured distributions for compute, algorithmic progress, task
                horizons and transition lags. The macro drivers are coupled using an Iman–Conover
                rank-correlation procedure.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Evaluate stage gates</h3>
              <p>
                Model AGI prerequisites, then cognitive research / takeoff lags. Phase overlap
                compresses cognitive lags; infrastructure friction is added separately. Deployment
                and visibility delays lead to public ASI.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Summarise the simulated futures</h3>
              <p>
                Report medians and percentile intervals for each target, then examine driver
                correlations and sensitivity to changed assumptions. More samples reduce numerical
                noise; they do not validate the premises.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="sensitivity-section">
        <div className="research-section-label">
          <h2>How much do the assumptions matter?</h2>
          <span>Executed 14 September 2026</span>
        </div>
        <p>
          100,000 simulations per scenario · seed 42 · same source revision and random seed. Select
          a target to compare the outputs.
        </p>
        <div className="forecast-targets" role="group" aria-label="Forecast target">
          {targets.map(([id, label]) => (
            <button key={id} aria-pressed={target === id} onClick={() => setTarget(id)}>
              {label}
            </button>
          ))}
        </div>
        <table className="sensitivity-table">
          <caption>
            Conditional {targets.find(([id]) => id === target)?.[1]} outputs. Intervals describe
            simulated outcomes, not validated real-world coverage.
          </caption>
          <thead>
            <tr>
              <th scope="col">Assumption set</th>
              <th scope="col">Median</th>
              <th scope="col">5th–95th percentile</th>
            </tr>
          </thead>
          <tbody>
            {results.scenarios.map((s) => {
              const t = s.targets.find((t) => t.target === target)!;
              return (
                <tr key={s.id}>
                  <th scope="row">{s.label}</th>
                  <td>{month(t.median_month)}</td>
                  <td>
                    {month(t.p05_month)} – {month(t.p95_month)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <details className="research-details">
          <summary>Exactly what changed between scenarios?</summary>
          {results.scenarios.map((s) => (
            <p key={s.id}>
              <strong>{s.label}.</strong> {s.description}
            </p>
          ))}
          <p>
            These are one-factor scenario comparisons. The changes are analyst-chosen stress tests,
            not new empirical estimates.
          </p>
        </details>
        <p className="numerical-note">
          <strong>Numerical precision:</strong> baseline internal-ASI medians span{' '}
          {results.convergence.batch_median_range_months} months across 10 batches. The source’s
          under-one-month convergence criterion was not met; treat displayed months as approximate.
        </p>
        <div className="research-downloads">
          <a href="/research/forecast-sensitivity-2026-09-14.json" download>
            Download results <ArrowDownToLine size={16} />
          </a>
          <a href={`${atlasSource}/blob/codex/asi-atlas/scripts/research-sensitivity.py`}>
            Reproduce this analysis <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <div className="research-two-column">
        <section>
          <h2>Leading simulated drivers</h2>
          <p>
            Spearman rank correlation with the baseline internal-ASI date. Positive values are
            associated with later arrival within this model; negative values with earlier arrival.
          </p>
          <dl className="driver-list">
            {results.drivers.map((d) => (
              <div key={d.input_variable}>
                <dt>{driverLabels[d.input_variable] ?? d.input_variable}</dt>
                <dd>
                  {d.spearman_correlation > 0 ? '+' : ''}
                  {d.spearman_correlation.toFixed(3)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="research-muted">
            Correlated inputs complicate attribution. These are associations, not causal effects.
            Sobol indices are not computed by this implementation.
          </p>
          <a
            className="research-text-link"
            href="/research/forecast-drivers-2026-09-14.csv"
            download
          >
            All driver results (CSV) <ArrowDownToLine size={16} />
          </a>
        </section>
        <section>
          <h2>Assumptions to challenge</h2>
          <ul className="research-list">
            <li>Whether task-horizon trends generalise to broad capability.</li>
            <li>The length and overlap of post-AGI cognitive stages.</li>
            <li>Infrastructure delays and the imposed late-arrival tail.</li>
            <li>Dependence between compute, efficiency and benchmark progress.</li>
            <li>The operational definitions of AGI, internal ASI and public ASI.</li>
          </ul>
          <p>
            The separate July 2029 author-prior scenario has zero weight in the input set used here.
          </p>
          <div className="research-source-links">
            <a href={`${revision}/forecast_inputs/base_forecast_inputs.yaml`}>
              Input distributions <ArrowUpRight size={14} />
            </a>
            <a href={`${revision}/evidence_tables/v0_5_parameter_sources.csv`}>
              Parameter provenance <ArrowUpRight size={14} />
            </a>
            <a href={`${revision}/src/asi_forecast/drivers.py`}>
              Sensitivity method <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export function ResearchNotes() {
  return (
    <>
      <p className="research-lead">
        Working ideas become research through definitions, explicit assumptions and tests that could
        show them wrong.
      </p>
      <article className="research-paper">
        <div className="paper-index" aria-hidden="true">
          01<span>Working note</span>
        </div>
        <div>
          <p className="research-eyebrow">Proposed framework · v0.1 · 14 September 2026</p>
          <h2>A State-Space Framework for Loss-of-Control Risk in Advanced AI Systems</h2>
          <p className="paper-author">Moheet Khawaja</p>
          <p>
            This working note defines candidate dimensions of capability, autonomy, situational
            awareness, deceptive behaviour, replication, tool access and oversight. It sets out a
            bounded evaluation protocol for testing whether the representation improves prediction
            of control failures.
          </p>
          <p>
            The transition and observation functions remain unspecified. No empirical study has been
            run for this framework, and no proof of catastrophe or claim of novelty is presented.
          </p>
          <div className="research-downloads">
            <a className="primary-download" href="/research/state-space-framework-v0.1.pdf">
              Read working note (PDF) <ArrowUpRight size={16} />
            </a>
            <a href={noteSource}>
              Source on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
          <dl className="paper-status">
            <div>
              <dt>Status</dt>
              <dd>Working research note; not peer reviewed</dd>
            </div>
            <div>
              <dt>DOI</dt>
              <dd>Not assigned</dd>
            </div>
            <div>
              <dt>Provenance</dt>
              <dd>Prepared with AI assistance; independent work</dd>
            </div>
          </dl>
        </div>
      </article>
      <div className="research-two-column">
        <section>
          <h2>Before a full preprint</h2>
          <ul className="research-list">
            <li>Complete a systematic related-work and novelty review.</li>
            <li>Specify an identifiable model and measurement protocol.</li>
            <li>Run held-out evaluations against simpler baselines.</li>
            <li>Publish reproducible results, uncertainty and failures.</li>
          </ul>
        </section>
        <section>
          <h2>A question open to revision</h2>
          <p>
            Can catastrophic-risk claims about advanced AI be transformed into explicit mathematical
            models whose assumptions can be inspected, falsified, and empirically updated?
          </p>
          <p className="research-muted">
            A formal implication depends on its premises. Establishing whether those premises
            describe deployed systems is an empirical task.
          </p>
          <a className="research-text-link" href="/?section=framework">
            Inspect the state variables <ArrowUpRight size={16} />
          </a>
        </section>
      </div>
    </>
  );
}
