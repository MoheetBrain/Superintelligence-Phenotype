import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Focus, X, ArrowLeft, BookOpen, FlaskConical } from 'lucide-react';
import type { Capability } from '../data/schema';
import type { Action, ExplorerState } from '../state/explorerReducer';
import { domainById, domainIds, shortNames } from '../data/domains';
import { Button } from './ui/Button';
import { EvidenceBadge } from './EvidenceBadge';
import { phenotypeContext, profileTraits } from '../data/profile';
import { dossiers } from '../data/dossiers';
import { IllustrationPanel } from './IllustrationPanel';
export function CapabilityInspector({
  capability: c,
  isolate,
  dispatch,
  state,
}: {
  capability: Capability;
  isolate: boolean;
  dispatch: (a: Action) => void;
  state?: ExplorerState;
}) {
  const dossier = dossiers[c.domain];
  const profile = profileTraits.find((p) => p.id === state?.profile);
  const topic = c.subtraits.find((t) => t.id === state?.topic);
  const topicDetail = topic ? dossier.topics[c.subtraits.indexOf(topic)] : null;
  const illustration = state?.illustration;
  const content = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'overview' | 'evidence' | 'measurement'>('overview');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    setTab('overview');
    heading.current?.focus({ preventScroll: !window.matchMedia?.('(max-width: 900px)').matches });
  }, [c.id, profile?.id]);
  useEffect(() => {
    if (content.current) content.current.scrollTop = 0;
  }, [c.id, profile?.id, tab, topic?.id, illustration]);
  useEffect(() => {
    if (topic || illustration) {
      setTab('overview');
      heading.current?.focus({ preventScroll: true });
    }
  }, [topic?.id, illustration]);
  return (
    <aside className="inspector" aria-label="Capability inspector" data-testid="inspector">
      <div className="inspector-top">
        <span className="section-caption">
          PHENOTYPE {String(domainIds.indexOf(c.domain) + 1).padStart(2, '0')} / 12
        </span>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Close inspector"
          onClick={() => dispatch({ type: 'clear' })}
        >
          <X size={19} />
        </Button>
      </div>
      <h2 ref={heading} tabIndex={-1}>
        {illustration === 'execution'
          ? 'One intelligence, different arrangements'
          : illustration === 'strength'
            ? 'Strength depends on the body'
            : illustration === 'precision'
              ? 'Precision is a feedback loop'
              : (topic?.name ?? profile?.name ?? c.name)}
      </h2>
      {profile && !illustration ? (
        <span className="scenario-tag">{profile.frame} · qualitative scenario</span>
      ) : (
        <EvidenceBadge level={c.evidenceLevel} future />
      )}
      {domainById[c.domain].provisional && (
        <p className="provisional">{domainById[c.domain].provisionalNote}</p>
      )}
      <div className="inspector-tabs" role="group" aria-label="Card sections">
        {(['overview', 'evidence', 'measurement'] as const).map((t) => (
          <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t === 'overview' ? 'Overview' : t === 'evidence' ? 'Evidence' : 'Measure'}
          </button>
        ))}
      </div>
      <div
        className="inspector-content"
        ref={content}
        key={`${c.id}-${profile?.id}-${tab}-${topic?.id}-${illustration}`}
      >
        {tab === 'overview' && (
          <>
            {(topic || illustration) && (
              <button className="text-link" onClick={() => dispatch({ type: 'back' })}>
                <ArrowLeft size={15} />
                Back to {profile?.name ?? c.name}
              </button>
            )}
            {illustration && state ? (
              <IllustrationPanel state={state} dispatch={dispatch} />
            ) : topic ? (
              <>
                <p className="meaning">{topic.meaning}</p>
                <h3>A connection to explore</h3>
                {topicDetail?.related.map((id) => (
                  <Button key={id} variant="ghost" onClick={() => dispatch({ type: 'select', id })}>
                    {domainById[id].name}
                    <ArrowUpRight size={15} />
                  </Button>
                ))}
                <h3>In the larger picture</h3>
                <p>{dossier.scenario}</p>
                <p className="muted">Hypothetical worked scenario · no project measurement</p>
              </>
            ) : profile ? (
              <>
                <p className="profile-value">{profile.value}</p>
                <p className="meaning">{profile.meaning}</p>
                {profile.group === 'Physical' && (
                  <p className="context-equation">
                    Intelligence capability + body hardware + task conditions
                  </p>
                )}
                <h3>What it could enable</h3>
                <p>{profile.enables}</p>
                {profile.id === 'strength' && (
                  <Button
                    id="demo-strength"
                    onClick={() => dispatch({ type: 'illustration', id: 'strength' })}
                  >
                    Try a strength task
                    <ArrowUpRight size={16} />
                  </Button>
                )}
                {['precision', 'reaction', 'dexterity'].includes(profile.id) && (
                  <Button
                    id="demo-precision"
                    onClick={() => dispatch({ type: 'illustration', id: 'precision' })}
                  >
                    Step through the feedback loop
                    <ArrowUpRight size={16} />
                  </Button>
                )}
                {profile.group === 'Distributed' && (
                  <Button
                    id="profile-execution"
                    onClick={() =>
                      dispatch({
                        type: 'select',
                        id: 'substrate-mobility',
                        group: 'beyond',
                        illustration: 'execution',
                      })
                    }
                  >
                    Compare execution arrangements
                    <ArrowUpRight size={16} />
                  </Button>
                )}
                <h3>What determines success</h3>
                <p>{profile.limit}</p>
                {profile.id === 'strength' && (
                  <p>
                    Payload mass describes a load; force and torque describe mechanical demands.
                    Leverage, grip and stance change those demands. This atlas supplies no universal
                    lifting rating.
                  </p>
                )}
                {profile.id === 'precision' && (
                  <p>
                    Accuracy is closeness to a target. Repeatability is consistency across
                    repetitions; repeated actions may consistently miss the target. Both need a
                    stated task and measurement procedure.
                  </p>
                )}
                {profile.id === 'reaction' && (
                  <p>
                    Complete response includes sensor sampling, transmission, inference, command
                    delivery and actuator movement. A model's inference latency is not an end-to-end
                    response rating.
                  </p>
                )}
                <h3>How it might scale</h3>
                <p>{profile.scaling}</p>
                <p className="muted">
                  Scenario, not an empirical result. The parent dossier's sources concern their
                  stated tasks and do not validate this future profile.
                </p>
                <Button onClick={() => dispatch({ type: 'select', id: c.id })}>
                  Read the {c.name} dossier
                  <ArrowUpRight size={16} />
                </Button>
              </>
            ) : (
              <>
                <p className="meaning">{c.meaning}</p>
                <div className="hypothesis">
                  <span className="section-caption">IMAGINE THIS</span>
                  <p>{c.hypotheticalExample}</p>
                  <span className="muted">Hypothetical example · not an observed result</span>
                </div>
                <h3>Explore this capability</h3>
                <div className="topic-buttons">
                  {c.subtraits.map((t, i) => (
                    <button
                      key={t.id}
                      id={`topic-${t.id}`}
                      onClick={() => dispatch({ type: 'topic', id: t.id })}
                    >
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      {t.name}
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
                {c.id === 'embodiment' && (
                  <div className="dossier-demos">
                    <Button
                      id="demo-strength"
                      onClick={() => dispatch({ type: 'illustration', id: 'strength' })}
                    >
                      Try a strength task
                      <ArrowUpRight size={16} />
                    </Button>
                    <Button
                      id="demo-precision"
                      onClick={() => dispatch({ type: 'illustration', id: 'precision' })}
                    >
                      Step through precision
                      <ArrowUpRight size={16} />
                    </Button>
                  </div>
                )}
                {['substrate-mobility', 'replication', 'memory'].includes(c.id) && (
                  <Button
                    id="demo-execution"
                    onClick={() => dispatch({ type: 'illustration', id: 'execution' })}
                  >
                    Compare execution arrangements
                    <ArrowUpRight size={16} />
                  </Button>
                )}
                <h3>What it could enable</h3>
                <p>{phenotypeContext[c.domain].enables}</p>
                <details className="dossier-section" open>
                  <summary>How it might work</summary>
                  <p>{dossier.mechanism}</p>
                  <h4>What it would require</h4>
                  <p>{dossier.prerequisites}</p>
                </details>
                <details className="dossier-section">
                  <summary>Limits & important distinctions</summary>
                  <p>{dossier.limits}</p>
                  {c.importantDistinctions.map((d) => (
                    <p className="distinction" key={d}>
                      {d}
                    </p>
                  ))}
                </details>
                <details className="dossier-section">
                  <summary>A worked scenario</summary>
                  <p>{dossier.scenario}</p>
                  <p className="muted">Hypothetical example, not an observed result.</p>
                </details>
                <h3>An open question</h3>
                <p>{dossier.question}</p>
              </>
            )}
          </>
        )}
        {tab === 'evidence' && (
          <>
            <h3>
              <BookOpen size={17} /> Evidence & source review
            </h3>
            <p>
              The badge above classifies the future hypothesis. Individual observations and
              editorial source checks are separate.
            </p>
            {c.claims.length ? (
              c.claims.map((claim) => (
                <article className="claim" key={claim.id}>
                  <EvidenceBadge level={claim.evidenceLevel} />
                  <p>{claim.text}</p>
                  <h4>Evaluated scope</h4>
                  <p>{claim.scope}</p>
                  <h4>Limitations</h4>
                  <ul>
                    {claim.limitations.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                  <span className="verification">Source review: {claim.verification}</span>
                </article>
              ))
            ) : (
              <div className="hypothesis">
                <strong>No empirical claim published for this card.</strong>
                <p>
                  Editorial evidence synthesis: needs review. The definition, distinctions and
                  proposed evaluation are a research framework, not measured capability findings.
                </p>
              </div>
            )}
            <p className="muted">
              Conceptual explanations and worked scenarios are editorial hypotheses. Source scope
              does not validate the illustrated robot or the arrival scenario.
            </p>
            <h3>Sources</h3>
            {c.sources.length ? (
              c.sources.map((s) => (
                <article className="source" key={s.id}>
                  <a href={s.url ?? undefined} target="_blank" rel="noreferrer">
                    {s.title} <ArrowUpRight size={14} />
                  </a>
                  <p>
                    {s.publisher}
                    {s.publishedAt ? ` · ${s.publishedAt}` : ''}
                  </p>
                  <p>{s.locator}</p>
                  <span className="verification">
                    {s.verification === 'verified'
                      ? `Source checked ${s.verifiedAt}`
                      : 'Needs source review'}
                  </span>
                </article>
              ))
            ) : (
              <p>No reviewed sources attached yet. Unsupported empirical claims are omitted.</p>
            )}
          </>
        )}
        {tab === 'measurement' && (
          <>
            <h3>
              <FlaskConical size={17} /> How we would evaluate it
            </h3>
            <div className="measurement-result">
              <span className="section-caption">PROJECT RESULT</span>
              <strong>
                {c.measurement.value === null
                  ? 'Not measured for this project.'
                  : c.measurement.value}
              </strong>
            </div>
            <h3>Proposed protocol</h3>
            <p>{c.measurement.protocol}</p>
            <p>
              Before collecting results, record the system version, task suite, resource context,
              date and uncertainty. No result is inferred from this visual model.
            </p>
          </>
        )}
        <div className="related">
          <h3>Continue exploring</h3>
          {c.relatedConcepts.map((id) => (
            <Button key={id} variant="ghost" onClick={() => dispatch({ type: 'select', id })}>
              {shortNames[domainIds.indexOf(id as (typeof domainIds)[number])]}
              <ArrowUpRight size={15} />
            </Button>
          ))}
        </div>
      </div>
      <div className="inspector-footer">
        <Button variant="default" onClick={() => dispatch({ type: 'isolate' })}>
          {isolate ? <ArrowLeft size={17} /> : <Focus size={17} />}{' '}
          {isolate ? 'Exit isolation' : 'Isolate context'}
        </Button>
        <span>Visual context only</span>
      </div>
    </aside>
  );
}
