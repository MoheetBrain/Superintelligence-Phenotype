// Run explicitly after rendering. This checks reachability, not citation accuracy.
import { readFile, writeFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const routes = JSON.parse(await readFile('public/research/sources/routes.json', 'utf8'));
const sources = new Map();
for (const { route } of routes) {
  const dom = new JSDOM(await readFile(`public${route}/index.html`, 'utf8'));
  for (const link of dom.window.document.querySelectorAll('.manuscript a[href]')) {
    const url = link.getAttribute('href');
    if (!/^https?:/.test(url) || url.startsWith('https://superintel.site')) continue;
    if (!sources.has(url)) sources.set(url, new Set());
    sources.get(url).add(route);
  }
  dom.window.close();
}
const queue = [...sources.entries()];
const results = [];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const [url, pages] = queue.shift();
      const record = { url, pages: [...pages] };
      if (new URL(url).hostname === 'chatgpt.com') {
        record.result =
          'Conversation export URL; may require the original account. Not a public citation.';
      } else {
        try {
          const response = await fetch(url, {
            signal: AbortSignal.timeout(12000),
            redirect: 'follow',
          });
          record.status = response.status;
          record.finalUrl = response.url;
          record.result = response.ok ? 'Reachable' : 'Not verified by automated request';
          await response.body?.cancel();
        } catch (error) {
          record.result = 'Not verified by automated request';
          record.error = error.name;
        }
      }
      results.push(record);
    }
  }),
);
results.sort((a, b) => a.url.localeCompare(b.url));
const report = {
  checkedAt: new Date().toISOString(),
  scope:
    'HTTP reachability of linked manuscript and historical references. Does not verify authors, titles, dates, relevance, peer review, or claim accuracy. Access restrictions and timeouts are not proof of a broken reference.',
  results,
};
await writeFile(
  'content/research/reference-link-check.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    {
      checked: results.length,
      reachable: results.filter((r) => r.result === 'Reachable').length,
      unresolved: results
        .filter((r) => r.result !== 'Reachable')
        .map(({ url, status, result, error }) => ({ url, status, result, error })),
    },
    null,
    2,
  ),
);
