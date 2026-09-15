import { capabilities } from '../data/capabilities';
import { domainById } from '../data/domains';
import type { ExplorerState } from './explorerReducer';
export function searchCapabilities(query: string, evidence: ExplorerState['evidence'] = 'all') {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return capabilities.filter((c) => {
    const d = domainById[c.domain];
    const text = [
      c.name,
      c.id,
      c.meaning,
      d.name,
      ...d.aliases,
      ...c.aliases,
      ...c.subtraits.map((t) => t.name),
    ]
      .join(' ')
      .toLocaleLowerCase();
    return (
      (evidence === 'all' || c.evidenceLevel === evidence) && terms.every((t) => text.includes(t))
    );
  });
}
