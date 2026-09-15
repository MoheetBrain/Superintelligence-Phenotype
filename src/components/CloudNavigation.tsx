import { Brain, Hand, Network, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import type { CSSProperties, MutableRefObject } from 'react';
import { discoveryNodes, type DiscoveryNode } from '../data/discovery';
import type { Action, ExplorerState } from '../state/explorerReducer';
export function nodeAction(node: DiscoveryNode): Action {
  return node.group
    ? { type: 'group', id: node.group }
    : {
        type: 'select',
        id: node.capability!,
        profile: node.profile,
        topic: node.topic,
        illustration: node.illustration,
      };
}
const icons = {
  mind: Brain,
  physical: Hand,
  beyond: Network,
  learning: Sparkles,
  resources: ShieldCheck,
};
export function CloudNavigation({
  state,
  dispatch,
  elements,
  hover,
}: {
  state: ExplorerState;
  dispatch: (a: Action) => void;
  elements: MutableRefObject<Map<string, HTMLButtonElement>>;
  hover: (key: string | null) => void;
}) {
  const nodes = discoveryNodes(state.group);
  return (
    <nav
      className="cloud-navigation"
      hidden={state.explode > 0 || state.isolate || state.illustration === 'execution'}
      aria-label={state.group ? 'Capability clouds' : 'Discovery groups'}
    >
      {nodes.map((node) => {
        const Icon = node.group ? icons[node.group] : ArrowUpRight;
        const selected = node.illustration
          ? state.illustration === node.illustration
          : node.profile
            ? state.profile === node.profile
            : !node.group && !state.profile && state.selected === node.capability;
        return (
          <button
            key={node.key}
            id={`cloud-${node.key}`}
            ref={(el) => {
              if (el) elements.current.set(node.key, el);
              else elements.current.delete(node.key);
            }}
            className={`cloud-node ${selected ? 'active' : ''}`}
            style={{ '--cloud-color': node.color } as CSSProperties}
            aria-label={node.group ? `Open ${node.label} group` : `Explore ${node.label}`}
            aria-pressed={selected}
            onMouseEnter={() => hover(node.key)}
            onMouseLeave={() => hover(null)}
            onFocus={() => hover(node.key)}
            onBlur={() => hover(null)}
            onClick={() => dispatch(nodeAction(node))}
          >
            <span className="cloud-icon">
              <Icon size={17} />
            </span>
            <span className="cloud-label">{node.label}</span>
            <span className="cloud-preview">{node.preview}</span>
          </button>
        );
      })}
    </nav>
  );
}
