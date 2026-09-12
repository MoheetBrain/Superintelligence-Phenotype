import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  List,
  SlidersHorizontal,
  Share2,
  RotateCcw,
  Info,
  X,
} from 'lucide-react';
import { useExplorer } from './state/useExplorer';
import { serializeState } from './state/shareState';
import { capabilityById } from './data/capabilities';
import { discoveryGroups } from './data/discovery';
import { profileTraits } from './data/profile';
import { arrivalScenario } from './content/arrival';
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
  const [list, setList] = useState(false),
    [settings, setSettings] = useState(false),
    [about, setAbout] = useState(false),
    [intro, setIntro] = useState(false),
    [timeline, setTimeline] = useState(false);
  const [share, setShare] = useState(''),
    [shareStatus, setShareStatus] = useState(''),
    [choices, setChoices] = useState<string[]>([]);
  const focusStack = useRef<{ id: string; list: boolean }[]>([]),
    selectionOrigin = useRef<{ id: string; list: boolean } | null>(null);
  const selected = state.selected ? capabilityById[state.selected] : null;
  const group = discoveryGroups.find((g) => g.id === state.group);
  const profile = profileTraits.find((p) => p.id === state.profile);
  const topic = selected?.subtraits.find((t) => t.id === state.topic);
  const restoreFocus = (origin: { id: string; list: boolean } | undefined | null) => {
    if (origin?.list) setList(true);
    requestAnimationFrame(() =>
      (
        document.getElementById(origin?.id || 'atlas-back') ??
        document.querySelector<HTMLElement>('.cloud-node:not([hidden])') ??
        document.getElementById('atlas-back')
      )?.focus(),
    );
  };
  const dispatch = (a: Action) => {
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (['group', 'select', 'topic', 'illustration'].includes(a.type)) {
      const origin = {
        id:
          active?.id ||
          (a.type === 'select'
            ? `cloud-${a.profile ? `profile-${a.profile}` : a.illustration ? `demo-${a.illustration}` : `cap-${a.id}`}`
            : state.selected
              ? `cloud-cap-${state.selected}`
              : `cloud-group-${state.group ?? 'mind'}`),
        list,
      };
      focusStack.current.push(origin);
      if (a.type === 'select') selectionOrigin.current = origin;
    }
    send(a);
    if (a.type === 'select') {
      setList(false);
      setSettings(false);
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>('.inspector h2')
          ?.focus({ preventScroll: innerWidth > 900 }),
      );
    }
    if (a.type === 'back') restoreFocus(focusStack.current.pop());
    if (a.type === 'clear') restoreFocus(selectionOrigin.current);
    if (a.type === 'reset' || a.type === 'home') {
      focusStack.current = [];
      requestAnimationFrame(() =>
        document.getElementById('cloud-group-mind')?.focus({ preventScroll: true }),
      );
    }
    if (a.type === 'isolate' && innerWidth <= 900)
      requestAnimationFrame(() =>
        document.querySelector('.scene-panel')?.scrollIntoView({ block: 'start' }),
      );
  };
  useEffect(
    () =>
      registerAtlasTools(
        (document as Document & { modelContext?: ModelContext }).modelContext,
        send,
      ),
    [send],
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) {
        e.preventDefault();
        dispatch({ type: 'back' });
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  const openList = () => {
    setList(true);
    requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>('[aria-label="Search concepts"]')?.focus(),
    );
  };
  const shareView = async () => {
    setShare(location.origin + location.pathname + serializeState(state));
    try {
      await navigator.clipboard.writeText(
        location.origin + location.pathname + serializeState(state),
      );
      setShareStatus('View link copied.');
    } catch {
      setShareStatus('Copy the view link below. Clipboard access is unavailable.');
    }
  };
  return (
    <div className="app-shell immersive-app">
      <a
        href="#catalogue"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          openList();
        }}
      >
        Skip to capability catalogue
      </a>
      <header className="app-header">
        <a
          className="brand"
          href="#"
          aria-label="ASI Atlas home"
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: 'reset' });
          }}
        >
          <span className="brand-mark">
            A<span>·</span>
          </span>
          <span>SUPER INTELLIGENCE INC.</span>
        </a>
        <div className="atlas-actions">
          <Button
            id="atlas-back"
            aria-label="Back one level"
            disabled={!state.group && !state.selected}
            onClick={() => dispatch({ type: 'back' })}
          >
            <ArrowLeft size={17} />
            <span>Back</span>
          </Button>
          <Button id="atlas-search" aria-label="Search atlas" onClick={openList}>
            <Search size={17} />
            <span>Search</span>
          </Button>
          <Button id="atlas-list" aria-label="List view" onClick={openList}>
            <List size={17} />
            <span>List view</span>
          </Button>
          <Button id="atlas-settings" aria-label="Scene settings" onClick={() => setSettings(true)}>
            <SlidersHorizontal size={17} />
            <span>Controls</span>
          </Button>
          <Button aria-label="Reset explorer" onClick={() => dispatch({ type: 'reset' })}>
            <RotateCcw size={17} />
          </Button>
          <Button aria-label="Share view" onClick={shareView}>
            <Share2 size={17} />
            <span>Share</span>
          </Button>
        </div>
      </header>
      <div className="title-row immersive-title">
        <div>
          <h1>ARTIFICIAL SUPERINTELLIGENCE</h1>
          <p>
            <strong>ASI Atlas</strong>
            <span>Explore its possible capabilities, limits, and forms.</span>
          </p>
        </div>
        <button className="arrival-badge" onClick={() => setTimeline(true)}>
          <strong>{arrivalScenario.headline}</strong>
          <span>
            {arrivalScenario.status}
            <ArrowUpRight size={14} />
          </span>
        </button>
      </div>
      {state.view === 'body' ? (
        <main className="atlas-main">
          <nav className="atlas-breadcrumb" aria-label="Exploration breadcrumb">
            <button onClick={() => dispatch({ type: 'home' })}>Atlas</button>
            {group && (
              <>
                <span>→</span>
                <button onClick={() => dispatch({ type: 'group', id: group.id })}>
                  {group.name}
                </button>
              </>
            )}
            {selected && (
              <>
                <span>→</span>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'select',
                      id: selected.id,
                      profile: state.profile ?? undefined,
                    })
                  }
                >
                  {profile?.name ?? selected.name}
                </button>
              </>
            )}
            {topic && (
              <>
                <span>→</span>
                <span aria-current="page">{topic.name}</span>
              </>
            )}
            {state.illustration && (
              <>
                <span>→</span>
                <span aria-current="page">
                  {state.illustration === 'execution'
                    ? 'Execution arrangements'
                    : state.illustration === 'strength'
                      ? 'Strength in context'
                      : 'Feedback loop'}
                </span>
              </>
            )}
          </nav>
          <div className={`explorer-grid atlas-stage ${selected ? 'has-inspector' : ''}`}>
            <section className="scene-panel" aria-label="Body explorer">
              <div className="scene-heading">
                <span>
                  {group ? `${group.name} / CHOOSE A CONCEPT` : 'CHOOSE A CLOUD. FOLLOW AN IDEA.'}
                </span>
                <button className="what-is-asi" onClick={() => setIntro(true)}>
                  <Info size={14} /> What is ASI?
                </button>
              </div>
              <RobotScene
                state={state}
                dispatch={send}
                onNavigate={dispatch}
                onChoose={(ids) => {
                  if (ids.length === 1) dispatch({ type: 'select', id: ids[0] });
                  else if (ids.length) setChoices(ids);
                }}
              />
              <div className="atlas-stage-footer">
                <span>Drag to orbit · Pinch or scroll to zoom</span>
                <span>Connections are navigation links, not measured dependencies.</span>
              </div>
            </section>
            {selected && (
              <CapabilityInspector
                capability={selected}
                isolate={state.isolate}
                dispatch={dispatch}
                state={state}
              />
            )}
          </div>
        </main>
      ) : (
        <main>
          <RoadmapView
            view={state.view}
            onReturn={() => dispatch({ type: 'view', view: 'body' })}
          />
        </main>
      )}
      <footer className="compact-footer">
        <span>An original concept body. Capabilities do not occupy physical organs.</span>
        <button onClick={() => setAbout(true)}>
          Evidence & methodology <ArrowUpRight size={13} />
        </button>
      </footer>
      {list && (
        <Modal label="List view" onClose={() => setList(false)}>
          <h2>Explore the atlas</h2>
          <p>Every concept is available here, with or without 3D.</p>
          <CapabilityCatalogue state={state} dispatch={dispatch} mode="concepts" />
          <h3>Physical and future profiles</h3>
          <div className="list-profiles">
            {profileTraits
              .filter(
                (p) =>
                  !state.query ||
                  `${p.name} ${p.meaning} ${p.domain}`
                    .toLowerCase()
                    .includes(state.query.toLowerCase()),
              )
              .map((p) => (
                <button
                  key={p.id}
                  id={`list-profile-${p.id}`}
                  onClick={() =>
                    dispatch({
                      type: 'select',
                      id: p.domain,
                      profile: p.id,
                      group:
                        p.group === 'Physical'
                          ? 'physical'
                          : p.group === 'Distributed'
                            ? 'beyond'
                            : 'mind',
                    })
                  }
                >
                  {p.name}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            <button
              id="list-execution"
              onClick={() =>
                dispatch({
                  type: 'select',
                  id: 'substrate-mobility',
                  group: 'beyond',
                  illustration: 'execution',
                })
              }
            >
              Execution arrangements
              <ArrowUpRight size={14} />
            </button>
          </div>
        </Modal>
      )}
      {settings && (
        <Modal label="Scene settings" onClose={() => setSettings(false)}>
          <h2>Scene controls</h2>
          <SceneToolbar state={state} dispatch={dispatch} />
          <h3>Finish</h3>
          <div className="finish-selector" role="group" aria-label="Robot finish">
            {(['Coral', 'Cobalt', 'Pearl'] as const).map((f) => (
              <button
                key={f}
                aria-pressed={state.finish === f}
                onClick={() => dispatch({ type: 'finish', value: f })}
              >
                <span className={`finish-dot finish-${f.toLowerCase()}`} />
                {f}
              </button>
            ))}
          </div>
          <h3>Layers</h3>
          <CapabilityCatalogue state={state} dispatch={dispatch} mode="layers" />
          <h3>Future views</h3>
          <div className="view-tabs">
            {(['body', 'network', 'evolution'] as const).map((v) => (
              <button
                key={v}
                onClick={() => {
                  dispatch({ type: 'view', view: v });
                  setSettings(false);
                }}
              >
                {v === 'body'
                  ? 'Body'
                  : v === 'network'
                    ? 'Network · Planned'
                    : 'Evolution · Planned'}
              </button>
            ))}
          </div>
        </Modal>
      )}
      {intro && (
        <Modal label="What is ASI?" onClose={() => setIntro(false)}>
          <h2>What could a more capable intelligence become?</h2>
          <p>
            Artificial superintelligence is a hypothetical system that could surpass human
            capabilities across a wide range of intellectual tasks. It need not be human-shaped,
            conscious, all-knowing, or independent of infrastructure.
          </p>
          <p>
            Choose a cloud to explore its possible powers and limits. Each dossier separates a
            conceptual explanation, a hypothetical example, scoped evidence and proposed
            measurement.
          </p>
          <p>
            One intelligence might use different bodies and interfaces. Remote control, migration
            and copying are different arrangements—not proof of one continuous subjective self.
          </p>
          <Button
            onClick={() => {
              setIntro(false);
              dispatch({ type: 'group', id: 'mind' });
            }}
          >
            Start with Mind
            <ArrowUpRight size={16} />
          </Button>
        </Modal>
      )}
      {timeline && (
        <Modal label="Creator’s prediction" onClose={() => setTimeline(false)}>
          <h2>{arrivalScenario.headline}</h2>
          <p className="scenario-tag">{arrivalScenario.status}</p>
          <blockquote className="creator-prediction">
            <p>“{arrivalScenario.quote}”</p>
            <cite>— {arrivalScenario.attribution}</cite>
          </blockquote>
          <p>{arrivalScenario.explanation}</p>
          <p className="muted">Provenance: {arrivalScenario.provenance}</p>
        </Modal>
      )}
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
            Includes the discovery group, capability, subtopic, illustration, layers and camera.
            Earlier atlas links still work.
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
