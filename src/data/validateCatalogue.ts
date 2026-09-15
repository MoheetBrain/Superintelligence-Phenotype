import type { Capability, Domain } from './schema';
import { evidenceLevels } from '../content/methodology';
export function validateCatalogue(
  cards: readonly Capability[],
  domains: readonly Domain[],
  partIds: readonly string[],
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const knownDomains = new Set(domains.map((d) => d.id));
  for (const c of cards) {
    if (ids.has(c.id)) errors.push(`Duplicate capability: ${c.id}`);
    ids.add(c.id);
    if (!knownDomains.has(c.domain)) errors.push(`Unknown domain: ${c.domain}`);
    if (!evidenceLevels.includes(c.evidenceLevel)) errors.push(`Invalid evidence: ${c.id}`);
    for (const field of ['name', 'meaning', 'hypotheticalExample', 'currentResult'] as const)
      if (!c[field].trim()) errors.push(`Missing ${field}: ${c.id}`);
    const sources = new Map(c.sources.map((s) => [s.id, s]));
    if (sources.size !== c.sources.length) errors.push(`Duplicate source: ${c.id}`);
    if (!c.viewCoordinates.body.partIds.length) errors.push(`No parts: ${c.id}`);
    for (const p of c.viewCoordinates.body.partIds)
      if (!partIds.includes(p)) errors.push(`Unknown part: ${p}`);
    for (const v of [
      c.viewCoordinates.body.target,
      c.viewCoordinates.body.camera,
      c.viewCoordinates.network,
      c.viewCoordinates.evolution,
    ])
      if (v && (v.length !== 3 || !v.every(Number.isFinite)))
        errors.push(`Invalid coordinates: ${c.id}`);
    for (const ref of c.relatedConcepts)
      if (!cards.some((other) => other.id === ref)) errors.push(`Unknown related concept: ${ref}`);
    for (const claim of c.claims) {
      if (!evidenceLevels.includes(claim.evidenceLevel))
        errors.push(`Invalid claim evidence: ${claim.id}`);
      for (const id of claim.sourceIds)
        if (!sources.has(id)) errors.push(`Unknown claim source: ${id}`);
      if (
        claim.evidenceLevel === 'Observed' &&
        (!claim.scope.trim() ||
          claim.verification !== 'verified' ||
          !claim.sourceIds.length ||
          claim.sourceIds.some(
            (id) => sources.get(id)?.verification !== 'verified' || !sources.get(id)?.verifiedAt,
          ))
      )
        errors.push(`Unreviewed observation: ${claim.id}`);
    }
    for (const id of c.measurement.sourceIds)
      if (!sources.has(id)) errors.push(`Unknown measurement source: ${id}`);
    if (typeof c.measurement.value === 'number' && !Number.isFinite(c.measurement.value))
      errors.push(`Invalid measurement: ${c.id}`);
    for (const source of c.sources)
      if (source.url && !/^https?:\/\//.test(source.url))
        errors.push(`Unsafe source URL: ${source.id}`);
  }
  for (const d of domains)
    if (cards.filter((c) => c.domain === d.id).length !== 1)
      errors.push(`Expected one card for ${d.id}`);
  if (new Set(domains.map((d) => d.id)).size !== 12 || domains.length !== 12)
    errors.push('Expected twelve unique domains');
  return errors;
}
