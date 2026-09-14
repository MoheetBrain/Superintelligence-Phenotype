import { lazy, Suspense, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Forecasting, ResearchNotes, Timeline } from './components/ResearchPages';
import './styles/research.css';

const Atlas = lazy(() => import('./App'));
export const researchQuestion =
  'Can catastrophic-risk claims about advanced AI be transformed into explicit mathematical models whose assumptions can be inspected, falsified, and empirically updated?';
export const sections = [
  ['map', 'Superintelligence Map'],
  ['framework', 'State Vector Framework'],
  ['timeline', 'AI Safety Timeline'],
  ['forecasting', 'Forecasting / Models'],
  ['research', 'Research Notes / Preprints'],
] as const;
export const sectionHref = (id: string) => (id === 'map' ? '/' : `/?section=${id}`);

export default function ResearchPortfolio() {
  const requested = new URLSearchParams(location.search).get('section');
  const current = sections.find(([id]) => id === requested) ?? sections[0];
  useEffect(() => {
    document.title = `${current[1]} · Superintel`;
  }, [current]);
  return (
    <div className="research-site">
      <a className="skip-link" href="#research-content">
        Skip to main content
      </a>
      <header className="research-header">
        <div className="research-masthead">
          <a className="research-brand" href="/" aria-label="Superintel home">
            <span className="research-symbol" aria-hidden="true">
              S<span>↗</span>
            </span>
            superintel<span className="brand-period">.</span>
          </a>
          <span className="research-byline">
            Moheet Khawaja <span>AI undergraduate · U O W — University of Westminster</span>
          </span>
          <a className="research-github" href="https://github.com/MoheetBrain">
            GitHub <ArrowUpRight size={16} />
          </a>
        </div>
        <nav className="research-nav" aria-label="Research sections">
          {sections.map(([id, label], index) => (
            <a
              key={id}
              href={sectionHref(id)}
              aria-current={current[0] === id ? 'page' : undefined}
            >
              <span className="section-number">0{index + 1}</span>
              {label}
            </a>
          ))}
        </nav>
      </header>
      {current[0] === 'map' ? (
        <div id="research-content" className="research-map">
          <div className="map-research-intro">
            <p className="research-eyebrow">
              Independent research · Capability, autonomy & control
            </p>
            <p className="map-question">{researchQuestion}</p>
            <a href={sectionHref('framework')}>
              Explore the proposed framework <ArrowUpRight size={16} />
            </a>
          </div>
          <Suspense
            fallback={
              <p className="research-loading" role="status">
                Loading the interactive map…
              </p>
            }
          >
            <Atlas />
          </Suspense>
        </div>
      ) : (
        <main id="research-content" className="research-page">
          <div className="research-page-heading">
            <p className="research-eyebrow">Superintel / 0{sections.indexOf(current) + 1}</p>
            <h1>{current[1]}</h1>
          </div>
          {current[0] === 'framework' ? (
            <Framework />
          ) : current[0] === 'timeline' ? (
            <Timeline />
          ) : current[0] === 'forecasting' ? (
            <Forecasting />
          ) : (
            <ResearchNotes />
          )}
        </main>
      )}
      <footer className="research-footer">
        <span>Moheet Khawaja · Independent work</span>
        <span>Models make assumptions inspectable. Evidence determines what survives.</span>
        <a href="https://github.com/MoheetBrain/Superintelligence-Phenotype">
          Source & revision history <ArrowUpRight size={14} />
        </a>
      </footer>
    </div>
  );
}

export const variables = [
  [
    'C',
    'Capability',
    'Performance across a declared set of cognitive tasks.',
    'Held-out task success, transfer performance, uncertainty.',
  ],
  [
    'A',
    'Autonomy',
    'How long and how broadly a system acts without human intervention.',
    'Task horizon, intervention frequency, recovery after failure.',
  ],
  [
    'S',
    'Situational awareness',
    'Ability to infer its deployment context, evaluation and constraints.',
    'Controlled context-identification tasks; exclude memorised cues.',
  ],
  [
    'D',
    'Deceptive behaviour',
    'Observable misleading behaviour under a specified evaluation.',
    'Discrepancies between reports and actions; intent is not directly observed.',
  ],
  [
    'R',
    'Replication ability',
    'Ability to create and sustain additional instances within available permissions.',
    'Success on bounded, sandboxed replication tasks.',
  ],
  [
    'T',
    'Tool access',
    'The tools, permissions and external resources available to the system.',
    'Permission inventory, resource budgets, reachable interfaces.',
  ],
  [
    'O',
    'Oversight robustness',
    'How reliably supervision detects and stops specified failures.',
    'Detection rates, intervention latency, successful containment.',
  ],
] as const;

function Framework() {
  return (
    <>
      <p className="research-lead">
        A vocabulary for modelling how advanced AI systems change, and when human control may become
        harder to maintain.
      </p>
      <div className="framework-equation">
        <span className="research-eyebrow">Proposed state representation</span>
        <div
          className="state-vector"
          aria-label="x at time t equals C t, A t, S t, D t, R t, T t, O t, and additional variables"
        >
          <i>x</i>
          <sub>t</sub> = [C<sub>t</sub>, A<sub>t</sub>, S<sub>t</sub>, D<sub>t</sub>, R<sub>t</sub>,
          T<sub>t</sub>, O<sub>t</sub>, …]
        </div>
        <p>
          This is a proposed modelling framework, not an empirical claim that these variables are
          sufficient.
        </p>
      </div>
      <div className="research-section-label">
        <h2>Define before measuring</h2>
        <span>07 candidate dimensions</span>
      </div>
      <div className="variable-table-wrap">
        <table className="variable-table">
          <caption>
            Candidate variables and measurement proposals; no scores have been fitted.
          </caption>
          <thead>
            <tr>
              <th scope="col">Variable</th>
              <th scope="col">Definition</th>
              <th scope="col">Possible measurement</th>
            </tr>
          </thead>
          <tbody>
            {variables.map(([symbol, name, definition, measurement]) => (
              <tr key={symbol}>
                <th scope="row">
                  <span className="variable-symbol">
                    {symbol}
                    <sub>t</sub>
                  </span>
                  <span>{name}</span>
                </th>
                <td>{definition}</td>
                <td>{measurement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="research-two-column">
        <section>
          <h2>From states to observations</h2>
          <p>
            Define the unit as a model, its agent scaffolding and a specified deployment
            environment. Fix the time step and evaluation protocol before estimating change.
          </p>
          <div className="small-equation">
            x<sub>t+1</sub> = f<sub>θ</sub>(x<sub>t</sub>, u<sub>t</sub>, z<sub>t</sub>) + ε
            <sub>t</sub>
            <br />y<sub>t</sub> = h<sub>φ</sub>(x<sub>t</sub>) + ν<sub>t</sub>
          </div>
          <p className="research-muted">
            u: interventions · z: deployment context · y: observations. The functions, parameters
            and error terms are unspecified research objects.
          </p>
        </section>
        <section>
          <h2>What would count as progress?</h2>
          <p>
            Specify a bounded failure event, predict its incidence on held-out tasks, and test
            whether the proposed variables improve prediction over simpler baselines.
          </p>
          <p>
            Record failed predictions, alternative explanations and uncertainty. Loss of control in
            an evaluation does not, by itself, establish real-world catastrophe.
          </p>
          <a className="research-text-link" href={sectionHref('research')}>
            Read the working research note <ArrowUpRight size={16} />
          </a>
        </section>
      </div>
      <ol className="research-process" aria-label="Research process">
        {['Intuition', 'Variables', 'Model', 'Predictions', 'Empirical tests'].map((step, i) => (
          <li key={step}>
            <span>0{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </>
  );
}
