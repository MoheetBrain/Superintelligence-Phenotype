import type { EvidenceLevel } from '../data/schema';
export function EvidenceBadge({
  level,
  future = false,
}: {
  level: EvidenceLevel;
  future?: boolean;
}) {
  return (
    <span className={`evidence-badge evidence-${level.toLowerCase().replaceAll(' ', '-')}`}>
      {future ? 'Future hypothesis: ' : ''}
      {level}
    </span>
  );
}
