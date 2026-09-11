import { it, expect } from 'vitest';
import { capabilities } from '../../src/data/capabilities';
import { domains } from '../../src/data/domains';
import { visualMappings } from '../../src/data/visualMappings';
import { validateCatalogue } from '../../src/data/validateCatalogue';
const parts = visualMappings.map((v) => v.partId);
it('validates all twelve substantive cards', () => {
  expect(validateCatalogue(capabilities, domains, parts)).toEqual([]);
  expect(capabilities).toHaveLength(12);
  for (const c of capabilities) {
    expect(c.subtraits.length).toBeGreaterThanOrEqual(3);
    expect(c.meaning.length).toBeGreaterThan(120);
    expect(c.measurement.value).toBeNull();
    expect(c.currentResult).toBe('Not measured for this project.');
    expect(c.viewCoordinates.network).toBeNull();
  }
});
it('detects invalid IDs, coordinates, references and parts', () => {
  const c = structuredClone([...capabilities]);
  c[0] = {
    ...c[0],
    relatedConcepts: ['missing'],
    viewCoordinates: {
      ...c[0].viewCoordinates,
      body: { partIds: ['bad'], camera: [Infinity, 0, 0], target: [0, 0, 0] },
    },
  };
  expect(validateCatalogue(c, domains, parts)).toEqual(
    expect.arrayContaining([
      'Unknown related concept: missing',
      'Unknown part: bad',
      'Invalid coordinates: cognition',
    ]),
  );
});
it('requires source review and scope for observations', () => {
  const c = structuredClone([...capabilities]);
  c[1] = { ...c[1], claims: [{ ...c[1].claims[0], scope: '', verification: 'needs-review' }] };
  expect(validateCatalogue(c, domains, parts)).toContain(
    'Unreviewed observation: metacognition-observation',
  );
});
it('labels only the two specified provisional groupings', () =>
  expect(domains.filter((d) => d.provisional).map((d) => d.id)).toEqual([
    'memory',
    'control-governance',
  ]));
