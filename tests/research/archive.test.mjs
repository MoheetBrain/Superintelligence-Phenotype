import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { parse } from 'csv-parse/sync';
import { documents, papers, author, origin } from '../../scripts/research/catalogue.mjs';
import { renderer } from '../../scripts/research/render.mjs';

const read = (file) => readFileSync(file, 'utf8');
const manifest = JSON.parse(read('content/research/source-manifest.json'));
const routes = JSON.parse(read('public/research/sources/routes.json'));
const originalAtlas = parse(
  read('content/research/documents/SUPERINTELLIGENCE_RESEARCH_ATLAS.csv'),
  {
    columns: true,
  },
);
const extensions = JSON.parse(read('content/research/documents/ATLAS_EXTENSIONS.json'));
const atlas = [...originalAtlas, ...extensions];
const pages = new Map(
  routes.map((r) => [r.route, new JSDOM(read(`public${r.route}/index.html`)).window.document]),
);
const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

test('audited originals and dated extensions preserve their separate source hashes', () => {
  assert.equal(manifest.files.length, 17);
  assert.equal(manifest.files.filter((f) => f.mode === 'complete, byte-identical').length, 10);
  for (const f of manifest.files) {
    assert.equal(hash(`content/research/documents/${f.published_source}`), f.published_sha256);
    assert.equal(hash(`public/research/sources/${f.published_source}`), f.published_sha256);
    if (f.original_version_source) {
      assert.equal(hash(`content/research/${f.original_version_source}`), f.sha256);
      assert.equal(hash(`public/research/sources/${f.original_version_source}`), f.sha256);
    }
    if (f.mode === 'complete, byte-identical') assert.equal(f.published_sha256, f.sha256);
  }
});

test('every route has indexable HTML, exact author attribution, and honest canonical metadata', () => {
  assert.equal(routes.length, 21);
  assert.equal(new Set(routes.map((r) => r.route)).size, 21);
  for (const { route, title } of routes) {
    const doc = pages.get(route);
    assert.equal(doc.querySelectorAll('h1').length, 1, route);
    assert.equal(doc.querySelector('h1').textContent.toLowerCase(), title.toLowerCase(), route);
    assert.equal(doc.querySelector('link[rel=canonical]').href, origin + route);
    assert.equal(doc.querySelector('meta[name=author]').content, author);
    assert.equal(doc.querySelector('.archive-author').textContent, author);
    assert.equal(doc.querySelector('.document-authorship strong').textContent, `Author: ${author}`);
    assert.ok(
      doc
        .querySelector('.document-authorship')
        .textContent.includes(`© ${author}. All rights reserved.`),
    );
    assert.equal(doc.querySelectorAll('.research-nav a').length, 6);
    assert.equal(doc.querySelectorAll('.katex-error').length, 0);
    const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(schema.author.name, author);
    assert.equal(schema.url, origin + route);
    assert.equal(schema.datePublished, '2026-09-15');
    assert.equal(schema.doi, undefined);
    assert.equal(schema.isPartOf, undefined);
  }
  for (const paper of papers) {
    const doc = pages.get(paper.route);
    const sourceTitle = read(`content/research/documents/${paper.file}`).match(/^# (.+)$/m)[1];
    assert.equal(doc.querySelector('h1').textContent, sourceTitle);
    assert.equal(doc.querySelector('meta[name=citation_title]').content, sourceTitle);
    assert.equal(doc.querySelector('meta[name=citation_author]').content, author);
    assert.equal(doc.querySelector('meta[name=citation_publication_date]').content, '2026/09/15');
    assert.equal(doc.querySelector('meta[name=citation_pdf_url]'), null);
    assert.equal(doc.querySelector('meta[name=citation_doi]'), null);
    assert.equal(doc.querySelector('meta[name=citation_journal_title]'), null);
    assert.ok(doc.querySelector('.publication-note').textContent.includes(paper.readiness));
  }
});

test('all internal links, section anchors, images, scripts and styles resolve', () => {
  const failures = [];
  for (const { route } of routes) {
    const doc = pages.get(route);
    const ids = [...doc.querySelectorAll('[id]')].map((n) => n.id);
    assert.equal(ids.length, new Set(ids).size, `Duplicate IDs on ${route}`);
    for (const el of doc.querySelectorAll('a[href],link[href],img[src],script[src]')) {
      const raw = el.getAttribute('href') ?? el.getAttribute('src');
      const url = new URL(raw, origin + route);
      if (url.origin !== origin) continue;
      let target = 'public' + decodeURIComponent(url.pathname);
      if (url.pathname === '/') target = 'index.html';
      else if (existsSync(target) && statSync(target).isDirectory()) target += '/index.html';
      if (!existsSync(target)) failures.push(`${route}: missing ${raw}`);
      if (url.hash && pages.has(url.pathname)) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!pages.get(url.pathname).getElementById(id))
          failures.push(`${route}: missing anchor ${raw}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test('every Atlas field and all primary/secondary mappings survive in static HTML', () => {
  const doc = pages.get('/research/atlas');
  const rows = [...doc.querySelectorAll('[data-thesis]')];
  assert.deepEqual(
    rows.map((r) => r.id),
    Array.from({ length: 72 }, (_, i) => `T${i + 1}`),
  );
  for (const record of atlas) {
    const row = doc.getElementById('T' + record.id);
    assert.equal(row.querySelector('h2').textContent, record.title);
    assert.equal(row.dataset.provenance, record.provenance);
    assert.equal(row.dataset.epistemic_status, record.epistemic_status);
    assert.equal(row.dataset.primary_destination, record.primary_destination);
    for (const key of ['assumptions', 'falsifiers', 'prior_art', 'current_version'])
      assert.ok(row.textContent.includes(record[key]), `T${record.id} ${key}`);
    const refs = [
      ...new Set(
        (record.primary_destination + ' ' + record.secondary_links).match(/\bP[1-8]\b/g) ?? [],
      ),
    ];
    for (const id of refs)
      assert.ok(
        row.querySelector(`a[href="${papers.find((p) => p.id === id).route}"]`),
        `T${record.id} → ${id}`,
      );
  }
  assert.equal(doc.getElementById('T14').dataset.epistemic_status, 'CONJECTURE');
  assert.ok(
    doc.getElementById('T15').textContent.includes('Historical conjecture · Not established'),
  );
  for (const p of papers) {
    const related = atlas.filter(
      (r) =>
        r.primary_destination.startsWith(p.id + ' ') ||
        new RegExp(`\\b${p.id}\\b`).test(r.secondary_links),
    );
    for (const row of related)
      assert.ok(
        pages.get(p.route).querySelector(`.paper-theses a[href="/research/atlas#T${row.id}"]`),
      );
  }
});

test('the complete manuscripts are rendered with their equations and only the documented P2 display repair', () => {
  const render = renderer(documents);
  for (const paper of papers) {
    const source = read(`content/research/documents/${paper.file}`);
    const fixed = paper.id === 'P2' ? source.replaceAll('\x08eta_', '\\beta_') : source;
    const expected = render(fixed.replace(/^# .+\r?\n/, '').replace(/^# /gm, '## '), {
      file: paper.file,
    });
    const rendered = read(`public${paper.route}/index.html`);
    assert.ok(
      rendered.includes(expected.html),
      `${paper.id} must contain the entire source rendering`,
    );
    assert.ok(expected.env.mathCount > 10);
    assert.equal(pages.get(paper.route).querySelectorAll('.katex').length, expected.env.mathCount);
    assert.equal(
      pages.get(paper.route).querySelectorAll('.katex-mathml math').length,
      expected.env.mathCount,
    );
  }
  const p2 = read('content/research/documents/P2_hazardous_inference_frontier.md');
  assert.equal((p2.match(/\x08eta_/g) ?? []).length, 2);
  assert.equal(
    pages.get(papers[1].route).querySelector('.manuscript').textContent.includes('\x08'),
    false,
  );
});

test('renderer supports required delimiters, complex math, footnotes, nested lists and safe code', () => {
  const input =
    String.raw`## A section
Inline \(x_t\), $\alpha^2$.

\[
\begin{aligned}S(t)&=\exp(-\int_0^t h(u)\,du)\\M&=\begin{pmatrix}a&b\\c&d\end{pmatrix}\end{aligned}
\]

$$
f(x)=\begin{cases}\frac{\sum_i x_i}{\prod_j y_j},&x>0\\\mathbb{E}[X],&x\le0\end{cases}
$$

> Quoted [text](https://example.org) with a note[^1].

- First
  - Nested

| A | B |
|---|---|
| 1 | 2 |

[^1]: Footnote.

` + '```tex\n$not_math$\n```';
  const result = renderer([])(input, { file: 'fixture' });
  const doc = new JSDOM(result.html).window.document;
  assert.equal(result.env.mathCount, 4);
  assert.equal(doc.querySelectorAll('.katex-error').length, 0);
  assert.equal(doc.querySelector('pre code').textContent, '$not_math$\n');
  assert.ok(doc.querySelector('blockquote'));
  assert.ok(doc.querySelector('ul ul'));
  assert.ok(doc.querySelector('.footnotes'));
  assert.ok(doc.querySelector('.table-scroll table'));
  assert.equal(result.toc[0].id, 'a-section');
});

test('sitemap covers every route and missing package files are not fake downloads', () => {
  const sitemap = new JSDOM(read('public/sitemap.xml'), { contentType: 'text/xml' }).window
    .document;
  const locations = [...sitemap.querySelectorAll('loc')].map((n) => n.textContent);
  for (const r of routes) assert.ok(locations.includes(origin + r.route));
  assert.ok(read('public/robots.txt').includes(origin + '/sitemap.xml'));
  assert.ok(pages.get('/research/source-index').querySelectorAll('.source-unavailable').length > 0);
  assert.ok(
    pages.get('/research/sources').body.textContent.includes('No BibTeX library was included'),
  );
  assert.equal(
    pages.get('/research/history/evolution-and-strategy').querySelectorAll('img').length,
    1,
  );
  assert.equal(
    pages.get('/research/history/generalization-risks').querySelectorAll('img').length,
    1,
  );
});

test('display equations interrupt prose without blank lines, including standalone equals signs', () => {
  const result = renderer([])(
    String.raw`Text before math:
\[
P(T)
=
\mathbb{E}_Z\left[\prod_i(1-p_i(T\mid Z))\right]
\]
Text after math.
$$
x=2
$$`,
    { file: 'adjacent-math' },
  );
  const doc = new JSDOM(result.html).window.document;
  assert.equal(result.env.mathCount, 2);
  assert.equal(doc.querySelectorAll('h1').length, 0);
  assert.ok(doc.body.textContent.includes('Text after math.'));
});

test('P8 extends rather than rewrites the original corpus and includes a conditional theorem with proof', () => {
  assert.equal(originalAtlas.length, 68);
  assert.equal(
    hash('content/research/documents/SUPERINTELLIGENCE_RESEARCH_ATLAS.csv'),
    '4ece832f232e831c89139684d3c2402c249ef45c69c07009f4ae5234aefb49e7',
  );
  const originalPaperHashes = [
    'c2f8b5a78e85bda889678a597bf29509e7a80aa3c1998774fe8f86ce858d79c6',
    'd1df649a8d5b4696616299f47eb926e0bcfe1a73f0708fbac9164125a4c5a36d',
    '2c4c5f92e040d93e2d0ac297407f304ef824f2bb9ad77a89955ba5face424d92',
    'aa131ab0d91a34196c5e5e31baf3632d7fa2ba80f33020790c176617bddc424c',
    '6cfc1f8e23bbaf69a6a043a8aa5d3603620a10235c8c7b54aa9096a75265432c',
    '1e159612d64c5d8cb07a1ef80c8a77722a76764b5ab8ad97fb865f280af42ba9',
    '9be5d33b453d79c8975148dcc78da0c53d0b32c3354ea0cae2d5251ab036d8a4',
  ];
  papers
    .slice(0, 7)
    .forEach((p, i) =>
      assert.equal(hash(`content/research/documents/${p.file}`), originalPaperHashes[i]),
    );
  assert.deepEqual(
    extensions.map((r) => r.id),
    ['69', '70', '71', '72'],
  );
  assert.deepEqual(
    extensions.map((r) => r.epistemic_status),
    ['MODEL', 'MODEL', 'HYPOTHESIS', 'THEOREM'],
  );
  const atlasPage = pages.get('/research/atlas');
  for (const row of atlas)
    assert.equal(
      atlasPage.getElementById('T' + row.id).dataset.corpus,
      Number(row.id) <= 68 ? 'Original conversation corpus' : 'Later research extension',
    );
  for (const row of extensions) assert.equal(row.provenance, 'O→F');
  assert.ok(atlasPage.body.textContent.includes('68 theses/proposals (T1–T68)'));
  assert.ok(atlasPage.body.textContent.includes('T69–T72'));
  const combined = parse(read('public/research/sources/ATLAS_CURRENT.csv'), { columns: true });
  assert.equal(combined.length, 72);
  originalAtlas.forEach((r, i) =>
    Object.entries(r).forEach(([k, v]) => assert.equal(combined[i][k], v)),
  );
  const p8 = pages.get('/research/papers/embodiment-threshold');
  const text = p8.querySelector('.manuscript').textContent;
  assert.ok(text.includes('Proof by cases'));
  assert.ok(text.includes('Case 1:'));
  assert.ok(text.includes('Case 2:'));
  assert.ok(text.includes('finite, nonnegative times'));
  assert.ok(text.includes('NO EXPERIMENTS RUN'));
  assert.ok(text.includes('not inherently safety-negative'));
  assert.equal(p8.querySelectorAll('.manuscript h3[id^="proposed-experiment-"]').length, 5);
  assert.ok(p8.querySelector('a[href="/research/papers/control-frontier"]'));
  assert.ok(p8.querySelector('a[href="/research/papers/correlated-lineage-resilience"]'));
  for (const route of ['/research', '/research/papers'])
    assert.equal(pages.get(route).querySelectorAll('.paper-card').length, 8);
  assert.ok(read('public/llms.txt').includes(origin + '/research/papers/embodiment-threshold'));
});
