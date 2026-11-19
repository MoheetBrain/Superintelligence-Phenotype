/** Formats an ISO date (YYYY-MM-DD) as a British long date, e.g. "19 November 2026". */
export function formatLongDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

const UPPERCASE_TOKENS = new Set(['UK', 'LLP', 'PLC', 'CIC']);

/** Converts a register-style name ("HAMILTONIAN LABS LTD") to display case ("Hamiltonian Labs Ltd"). */
export function toDisplayCase(name: string): string {
  return name
    .toLowerCase()
    .split(/(\s+)/)
    .map((token) => {
      const upper = token.toUpperCase();
      if (UPPERCASE_TOKENS.has(upper)) return upper;
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join('');
}

/** Stable, URL-safe anchor id from a heading. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Slugifies a list of headings, de-duplicating repeated slugs with a numeric suffix. */
export function uniqueSlugs(headings: string[], prefix = ''): string[] {
  const seen = new Map<string, number>();
  return headings.map((heading) => {
    const base = `${prefix}${slugify(heading) || 'section'}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
