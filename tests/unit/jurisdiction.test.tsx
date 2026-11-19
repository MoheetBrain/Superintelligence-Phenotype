import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/content/site', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../src/content/site')>();
  return { ...original, company: { ...original.company, jurisdiction: null } };
});

const { Footer } = await import('../../src/components/Footer');

describe('footer without a confirmed jurisdiction', () => {
  it('omits the "Registered in" statement but keeps the company details', () => {
    const html = renderToStaticMarkup(<Footer year={2026} />);
    expect(html).not.toContain('Registered in');
    expect(html).toContain('17347944');
    expect(html).toContain('Registered office:');
  });
});
