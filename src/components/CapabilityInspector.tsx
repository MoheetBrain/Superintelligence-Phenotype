import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Focus, X, ArrowLeft, BookOpen, FlaskConical } from 'lucide-react';
import type { Capability } from '../data/schema';
import type { Action } from '../state/explorerReducer';
import { domainById, domainIds, shortNames } from '../data/domains';
import { Button } from './ui/Button';
import { EvidenceBadge } from './EvidenceBadge';
export function CapabilityInspector({
  capability: c,
  isolate,
  dispatch,
}: {
  capability: Capability;
  isolate: boolean;
  dispatch: (a: Action) => void;
}) {
  const [tab, setTab] = useState<'overview' | 'evidence' | 'measurement'>('overview');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    setTab('overview');
    heading.current?.focus({ preventScroll: !window.matchMedia?.('(max-width: 900px)').matches });
  }, [c.id]);
  return (
    <aside className="inspector" aria-label="Capability inspector" data-testid="inspector">
      <div className="inspector-top">
        <span className="section-caption">
          CONCEPT {String(domainIds.indexOf(c.domain) + 1).padStart(2, '0')} / 12
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
        {c.name}
      </h2>
      <EvidenceBadge level={c.evidenceLevel} future />
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
      <div className="inspector-content" key={`${c.id}-${tab}`}>
        {tab === 'overview' && (
          <>
            <p className="meaning">{c.meaning}</p>
            <div className="hypothesis">
              <span className="section-caption">A POSSIBLE FUTURE</span>
              <p>{c.hypotheticalExample}</p>
              <span className="muted">Hypothetical example · not an observed result</span>
            </div>
            <h3>What to distinguish</h3>
            {c.importantDistinctions.map((d) => (
              <p className="distinction" key={d}>
                {d}
              </p>
            ))}
            <h3>Within this capability</h3>
            <dl className="subtraits">
              {c.subtraits.map((t) => (
                <div key={t.id}>
                  <dt>{t.name}</dt>
                  <dd>{t.meaning}</dd>
                </div>
              ))}
            </dl>
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
