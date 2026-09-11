import { Search, ArrowUpRight, X, Eye, EyeOff } from 'lucide-react';
import { searchCapabilities } from '../state/selectors';
import { domains, shortNames, domainIds } from '../data/domains';
import type { Action, ExplorerState } from '../state/explorerReducer';
import { evidenceLevels } from '../content/methodology';
import { Button } from './ui/Button';
export function CapabilityCatalogue({
  state,
  dispatch,
  mode,
}: {
  state: ExplorerState;
  dispatch: (a: Action) => void;
  mode: 'concepts' | 'layers';
}) {
  const results = searchCapabilities(state.query, state.evidence);
  return (
    <section
      className="catalogue"
      aria-label={mode === 'layers' ? 'Domain layers' : 'Capability catalogue'}
      id="catalogue"
    >
      {mode === 'concepts' ? (
        <>
          <div className="search-box">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Search concepts"
              placeholder="Find a concept…"
              value={state.query}
              onChange={(e) => dispatch({ type: 'query', value: e.target.value })}
            />
            {state.query && (
              <Button
                size="icon"
                variant="ghost"
                aria-label="Clear search"
                onClick={() => dispatch({ type: 'query', value: '' })}
              >
                <X size={16} />
              </Button>
            )}
          </div>
          <label className="filter-label" htmlFor="hypothesis-filter">
            Future-hypothesis evidence filter
          </label>
          <select
            id="hypothesis-filter"
            value={state.evidence}
            onChange={(e) =>
              dispatch({ type: 'evidence', value: e.target.value as ExplorerState['evidence'] })
            }
          >
            <option value="all">All evidence levels</option>
            {evidenceLevels.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
          <div className="section-caption">
            <span>CAPABILITY INDEX</span>
            <span aria-live="polite">{String(results.length).padStart(2, '0')} / 12</span>
          </div>
          <div className="concept-list">
            {results.map((c) => (
              <button
                key={c.id}
                id={`list-cap-${c.id}`}
                className={`concept-button ${state.selected === c.id ? 'selected' : ''}`}
                aria-pressed={state.selected === c.id}
                aria-label={`Explore ${c.name}`}
                onClick={() => dispatch({ type: 'select', id: c.id })}
              >
                <span className="concept-number">
                  {String(domainIds.indexOf(c.domain) + 1).padStart(2, '0')}
                </span>
                <span>{shortNames[domainIds.indexOf(c.domain)]}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
          {!results.length && (
            <div className="empty">
              <p>No matching concepts.</p>
              <Button
                onClick={() => {
                  dispatch({ type: 'query', value: '' });
                  dispatch({ type: 'evidence', value: 'all' });
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
          <p className="catalogue-note">
            All concepts stay searchable, even when their 3D layer is hidden.
          </p>
        </>
      ) : (
        <>
          <div className="layer-actions">
            <Button onClick={() => dispatch({ type: 'layers', visible: [...domainIds] })}>
              <Eye size={15} /> Show all
            </Button>
            <Button onClick={() => dispatch({ type: 'layers', visible: [] })}>
              <EyeOff size={15} /> Hide all
            </Button>
          </div>
          <p className="catalogue-note">
            Layers change the visual context. They do not filter the catalogue.
          </p>
          {domains.map((d, i) => (
            <label className="layer-row" key={d.id}>
              <span>{shortNames[i]}</span>
              <input
                type="checkbox"
                role="switch"
                aria-label={`Show ${d.name}`}
                checked={state.visible.includes(d.id)}
                onChange={() =>
                  dispatch({
                    type: 'layers',
                    visible: state.visible.includes(d.id)
                      ? state.visible.filter((id) => id !== d.id)
                      : [...state.visible, d.id],
                  })
                }
              />
            </label>
          ))}
          <p className="catalogue-note" aria-live="polite">
            {state.visible.length} of 12 layers enabled
            {state.isolate ? ' · isolation overrides layers' : ''}.
          </p>
        </>
      )}
    </section>
  );
}
