import { describe, expect, it } from 'vitest';
import { formatLongDate, slugify, toDisplayCase, uniqueSlugs } from '../../src/lib/format';
import { buildMailtoUrl, composeMailtoBody, encodeMailtoComponent } from '../../src/lib/mailto';

describe('buildMailtoUrl', () => {
  const input = {
    to: 'enquiries@example.co.uk',
    subject: 'Confidential Recovery Review enquiry',
    fields: [
      { label: 'Name', value: '  Jane Smith ' },
      { label: 'Company', value: 'Smith & Sons (Holdings) Ltd' },
      { label: 'Work email', value: 'jane+finance@example.com' },
    ],
    message: {
      label: 'Brief description',
      value: 'Unapplied credits: £12,500?\nTwo units #3 & #4 — 100% sure.',
    },
  };

  it('addresses the message and encodes the subject', () => {
    const url = buildMailtoUrl(input);
    expect(url.startsWith('mailto:enquiries@example.co.uk?subject=')).toBe(true);
    expect(url).toContain('subject=Confidential%20Recovery%20Review%20enquiry&body=');
  });

  it('round-trips every field through the body', () => {
    const url = new URL(buildMailtoUrl(input));
    const body = decodeURIComponent(url.search.split('&body=')[1]);
    expect(body).toBe(
      [
        'Name: Jane Smith',
        'Company: Smith & Sons (Holdings) Ltd',
        'Work email: jane+finance@example.com',
        '',
        'Brief description:',
        'Unapplied credits: £12,500?',
        'Two units #3 & #4 — 100% sure.',
      ].join('\r\n'),
    );
  });

  it('percent-encodes reserved characters so they cannot break the URL', () => {
    const url = buildMailtoUrl(input);
    const [, query] = url.split('?');
    const params = query.split('&');
    expect(params).toHaveLength(2);
    expect(query).not.toMatch(/[ #+()\n\r]/);
    expect(url).toContain('Smith%20%26%20Sons%20%28Holdings%29%20Ltd');
    expect(url).toContain('jane%2Bfinance%40example.com');
    expect(url).toContain('%C2%A312%2C500%3F');
    expect(url).toContain('%0D%0A');
    expect(url).toContain('%23');
    expect(url).toContain('100%25');
  });

  it('normalises any line-ending style to CRLF', () => {
    const body = composeMailtoBody({ fields: [], message: { label: 'M', value: 'a\r\nb\rc\nd' } });
    expect(body).toBe('\r\nM:\r\na\r\nb\r\nc\r\nd');
  });

  it('rejects an invalid recipient', () => {
    expect(() => buildMailtoUrl({ ...input, to: 'not an address' })).toThrow();
    expect(() => buildMailtoUrl({ ...input, to: 'a@b.com?cc=x@y.com' })).toThrow();
  });

  it('encodes the characters encodeURIComponent leaves alone', () => {
    expect(encodeMailtoComponent("!'()*")).toBe('%21%27%28%29%2A');
  });
});

describe('format helpers', () => {
  it('formats ISO dates in British long form', () => {
    expect(formatLongDate('2026-11-19')).toBe('19 November 2026');
    expect(formatLongDate('not-a-date')).toBe('not-a-date');
  });

  it('converts register names to display case', () => {
    expect(toDisplayCase('HAMILTONIAN LABS LTD')).toBe('Hamiltonian Labs Ltd');
    expect(toDisplayCase('EXAMPLE UK PLC')).toBe('Example UK PLC');
  });

  it('creates unique, URL-safe slugs', () => {
    expect(slugify('How we use your information & our lawful bases')).toBe(
      'how-we-use-your-information-and-our-lawful-bases',
    );
    expect(uniqueSlugs(['Contact', 'Contact', 'Your rights'], 's-')).toEqual([
      's-contact',
      's-contact-2',
      's-your-rights',
    ]);
  });
});
