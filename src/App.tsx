import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Box,
  Network,
  GitBranch,
  Share2,
  Info,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useExplorer } from './state/useExplorer';
import { serializeState } from './state/shareState';
import { capabilityById } from './data/capabilities';
import { metaphor } from './content/methodology';
import { RobotScene } from './scene/RobotScene';
import { CapabilityCatalogue } from './components/CapabilityCatalogue';
import { CapabilityInspector } from './components/CapabilityInspector';
import { SceneToolbar } from './components/SceneToolbar';
import { Methodology } from './components/Methodology';
import { Modal } from './components/Modal';
import { RoadmapView } from './components/RoadmapView';
import { Button } from './components/ui/Button';
import type { Action } from './state/explorerReducer';
import { registerAtlasTools, type ModelContext } from './state/agentTools';
export default function App() {
  const { state, dispatch: send } = useExplorer();
  const [mode, setMode] = useState<'concepts' | 'layers'>('concepts');
  const [about, setAbout] = useState(false);
  const [share, setShare] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(
    () =>
      registerAtlasTools(
        (document as Document & { modelContext?: ModelContext }).modelContext,
        send,
      ),
    [send],
  );
  const dispatch = (a: Action) => {
    if (a.type === 'select')
      trigger.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    send(a);
    if (a.type === 'isolate' && window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() =>
        document.querySelector('.scene-panel')?.scrollIntoView({ block: 'start' }),
      );
    }
    if (a.type === 'clear' || a.type === 'reset') {
      requestAnimationFrame(() => trigger.current?.isConnected && trigger.current.focus());
    }
  };
  const selected = state.selected ? capabilityById[state.selected] : null;
  const shareView = async () => {
    const url = location.origin + location.pathname + serializeState(state);
    setShare(url);
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('View link copied.');
    } catch {
      setShareStatus('Copy the view link below. Clipboard access is unavailable.');
    }
  };
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#catalogue"
        onClick={(e) => {
          e.preventDefault();
          send({ type: 'view', view: 'body' });
          setMode('concepts');
          requestAnimationFrame(() => {
            const input = document.querySelector<HTMLInputElement>(
              '[aria-label="Search concepts"]',
            );
            input?.focus();
          });
        }}
      >
        Skip to capability catalogue
      </a>
      <header className="app-header">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: 'reset' });
          }}
          aria-label="ASI Atlas home"
        >
          <span className="brand-mark">
            A<span>·</span>
          </span>
          <span>
            SUPER INTELLIGENCE INC.<small>Research interfaces</small>
          </span>
        </a>
        <nav className="view-tabs" aria-label="Atlas views">
          {(
            [
              { id: 'body', label: 'Body', icon: Box },
              { id: 'network', label: 'Network', icon: Network },
              { id: 'evolution', label: 'Evolution', icon: GitBranch },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              aria-pressed={state.view === v.id}
              onClick={() => dispatch({ type: 'view', view: v.id })}
            >
              <v.icon size={16} />
              {v.label}
              {v.id !== 'body' && <span className="tab-planned">Planned</span>}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <Button size="icon" aria-label="Methodology and credits" onClick={() => setAbout(true)}>
            <Info size={18} />
          </Button>
          <Button aria-label="Share view" onClick={shareView}>
            <Share2 size={16} />
            <span>Share view</span>
          </Button>
        </div>
      </header>
      <div className="title-row">
        <div>
          <div className="eyebrow">AN EXPLORER OF POSSIBLE INTELLIGENCE</div>
          <h1>
            ASI Atlas
            <span className="edition">{state.view === 'body' ? 'BODY / 01' : 'ROADMAP'}</span>
          </h1>
        </div>
        <p>
          Explore the possible anatomy
          <br />
          of superintelligence.
        </p>
      </div>
      {state.view === 'body' ? (
        <main className="explorer-grid">
          <aside className="index-panel">
            <div className="index-tabs" role="group" aria-label="Catalogue controls">
              <button aria-pressed={mode === 'concepts'} onClick={() => setMode('concepts')}>
                <BookOpen size={16} /> Concepts
              </button>
              <button aria-pressed={mode === 'layers'} onClick={() => setMode('layers')}>
                <Layers size={16} /> Layers
              </button>
            </div>
            <CapabilityCatalogue state={state} dispatch={dispatch} mode={mode} />
          </aside>
          <section className="scene-panel" aria-label="Body explorer">
            <div className="scene-heading">
              <span>BODY EXPLORER</span>
              <span>
                {state.isolate
                  ? 'ISOLATED CONTEXT'
                  : state.explode > 0
                    ? 'CONCEPTUAL SEPARATION'
                    : 'PROCEDURAL MODEL'}
              </span>
            </div>
            <RobotScene
              state={state}
              dispatch={send}
              onChoose={(ids) => {
                if (ids.length === 1) dispatch({ type: 'select', id: ids[0] });
                else if (ids.length) setChoices(ids);
              }}
            />
            <div className="scene-bottom">
              <p>
                Drag to rotate <span>·</span> Scroll or pinch to zoom <span>·</span> Select to
                explore
              </p>
              <SceneToolbar state={state} dispatch={dispatch} />
            </div>
          </section>
          {selected ? (
            <CapabilityInspector
              capability={selected}
              isolate={state.isolate}
              dispatch={dispatch}
            />
          ) : (
            <aside className="welcome-panel">
              <span className="section-caption">TWELVE DIMENSIONS. OPEN QUESTIONS.</span>
              <h2>
                A map for <br />
                asking better <br />
                <em>questions.</em>
              </h2>
              <p>
                What might advanced machine intelligence be able to do—and what would count as
                evidence?
              </p>
              <p>
                Select a component or a concept to explore its meaning, limits and possible
                measurement.
              </p>
              <Button
                variant="default"
                onClick={() => dispatch({ type: 'select', id: 'metacognition' })}
              >
                Explore Metacognition <ArrowUpRight size={17} />
              </Button>
              <div className="welcome-note">
                <span className="bracket">[ &nbsp; ]</span>
                <p>
                  A conceptual map,
                  <br />
                  not a capability score.
                </p>
              </div>
            </aside>
          )}
        </main>
      ) : (
        <main>
          <RoadmapView
            view={state.view}
            onReturn={() => dispatch({ type: 'view', view: 'body' })}
          />
        </main>
      )}
      <footer className="app-footer">
        <p>{metaphor}</p>
        <button onClick={() => setAbout(true)}>
          Methodology & credits <ArrowUpRight size={14} />
        </button>
      </footer>
      {about && (
        <Modal label="Methodology and credits" onClose={() => setAbout(false)}>
          <Methodology />
        </Modal>
      )}
      {!!share && (
        <Modal label="Share view" onClose={() => setShare('')}>
          <h2>Share this exploration</h2>
          <p role="status">{shareStatus}</p>
          <label htmlFor="share-link">View link</label>
          <textarea id="share-link" readOnly value={share} onFocus={(e) => e.target.select()} />
          <p>
            Includes the selected concept, layers, separation, filters and camera. The link stores
            state locally in the URL; no account is needed.
          </p>
        </Modal>
      )}
      {!!choices.length && (
        <Modal label="Choose a concept" onClose={() => setChoices([])}>
          <h2>This component links to several concepts</h2>
          {choices.map((id) => (
            <Button
              key={id}
              onClick={() => {
                setChoices([]);
                dispatch({ type: 'select', id });
              }}
            >
              {capabilityById[id]?.name}
            </Button>
          ))}
        </Modal>
      )}
    </div>
  );
}
