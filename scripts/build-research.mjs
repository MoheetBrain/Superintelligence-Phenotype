import { readFile, writeFile, mkdir, cp, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import {
  author,
  origin,
  siteDate,
  repo,
  papers,
  supporting,
  history,
  note,
  documents,
  provenance,
} from './research/catalogue.mjs';
import { renderer, escape as e, plain } from './research/render.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = path.join(root, 'content/research');
const output = path.join(root, 'public/research');
const render = renderer(documents);
const navigation = JSON.parse(
  await readFile(path.join(root, 'src/content/research-navigation.json'), 'utf8'),
);
const manifest = JSON.parse(await readFile(path.join(content, 'source-manifest.json'), 'utf8'));
const atlas = parse(
  await readFile(path.join(content, 'documents/SUPERINTELLIGENCE_RESEARCH_ATLAS.csv')),
  { columns: true, bom: true },
);
if (
  atlas.length !== 68 ||
  new Set(atlas.map((r) => r.id)).size !== 68 ||
  atlas.some((r, i) => Number(r.id) !== i + 1)
)
  throw new Error('Atlas must contain IDs 1–68 exactly once.');
for (const d of documents) {
  d.source = await readFile(
    d.type === 'note' ? path.join(output, d.file) : path.join(content, 'documents', d.file),
    'utf8',
  );
  d.title ??= d.source.match(/^# (.+)$/m)?.[1];
  if (!d.title) throw new Error(`Missing title: ${d.file}`);
  d.description = plain(
    d.source.match(/### Publications-page description\s+([\s\S]+?)(?=\n## |$)/)?.[1] ??
      (d.type === 'history'
        ? 'Historical research discussions, with speaker provenance, original timestamps and explicit omissions of unrelated personal-account material.'
        : `${d.status} from the Superintelligence Research Atlas programme, by ${author}.`),
  );
  const sentences = [
    ...new Intl.Segmenter('en', { granularity: 'sentence' }).segment(d.description),
  ].map((s) => s.segment.trim());
  d.cardDescription =
    sentences.length > 3 ? [...sentences.slice(0, 2), sentences.at(-1)].join(' ') : d.description;
  d.sourceUrl = d.type === 'note' ? `/research/${d.file}` : `/research/sources/${d.file}`;
}
const linkCheck = JSON.parse(
  await readFile(path.join(content, 'reference-link-check.json'), 'utf8'),
);
const reached = linkCheck.results.filter((r) => r.result === 'Reachable').length;
const routes = [];
const authorship = `<footer class="document-authorship"><strong>Author: ${author}</strong><p>© ${author}. All rights reserved.</p><p class="fine">Underlying ideas, assistant contributions and third-party quotations retain the provenance stated in the source and Atlas.</p></footer>`;
const header = `<a class="skip-link" href="#content">Skip to main content</a><header class="research-header"><div class="research-masthead"><a class="research-brand" href="/" aria-label="Superintel home"><span class="research-symbol" aria-hidden="true">S<span>↗</span></span>superintel<span class="brand-period">.</span></a><span class="research-byline">${author}<span>AI undergraduate · U O W — University of Westminster</span></span><a class="research-github" href="https://github.com/MoheetBrain">GitHub ↗</a></div><nav class="research-nav" aria-label="Research sections">${navigation.map(([id, label, href], i) => `<a href="${e(href)}" ${id === 'publications' ? 'aria-current="page"' : ''}><span class="section-number">0${i + 1}</span>${e(label)}</a>`).join('')}</nav></header>`;
const subnav = `<nav class="archive-nav" aria-label="Publications navigation"><a href="/research">Overview</a><a href="/research/papers">Papers</a><a href="/research/atlas">68-thesis Atlas</a><a href="/research/programme">Programme</a><a href="/research/novelty">Novelty audit</a><a href="/research/history">History</a><a href="/research/sources">Sources & versions</a></nav>`;
const pageFooter = `<footer class="research-footer"><span>${author} · Independent research</span><span>Mathematics proves implications; evidence establishes premises.</span><a href="${repo}">Source & revision history ↗</a></footer>`;
async function page(route, title, description, body, meta = {}) {
  const canonical = origin + route;
  const schema = {
    '@context': 'https://schema.org',
    '@type': meta.type === 'paper' ? 'ScholarlyArticle' : 'CreativeWork',
    headline: title,
    description,
    author: { '@type': 'Person', name: author },
    url: canonical,
    datePublished: siteDate,
    dateModified: siteDate,
    ...(meta.date ? { dateCreated: meta.date } : {}),
    ...(meta.version ? { version: meta.version } : {}),
  };
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(title)} · Superintel</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="author" content="${author}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="${meta.type === 'paper' ? 'article' : 'website'}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary">${meta.type === 'paper' ? `<meta name="citation_title" content="${e(title)}"><meta name="citation_author" content="${author}"><meta name="citation_publication_date" content="${siteDate.replaceAll('-', '/')}">` : ''}<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script><link rel="stylesheet" href="/research/assets/base.css"><link rel="stylesheet" href="/research/assets/archive.css"><link rel="stylesheet" href="/research/assets/katex.min.css"><script defer src="/research/assets/archive.js"></script></head><body class="research-site">${header}${subnav}<main id="content" class="archive-main">${body}</main>${pageFooter}</body></html>`;
  const dir = path.join(root, 'public', route.slice(1));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html);
  routes.push({ route, title, type: meta.type ?? 'index' });
}
function titleBlock(title, eyebrow, lead = '') {
  return `<div class="archive-heading"><p class="research-eyebrow">${e(eyebrow)}</p><h1>${e(title)}</h1><p class="archive-author">${author}</p>${lead ? `<p class="archive-lead">${e(lead)}</p>` : ''}</div>`;
}
function cards() {
  return `<div class="paper-cards">${papers.map((d) => `<article class="paper-card"><div class="paper-marker">${d.id}<span>v0.1</span></div><div><p class="status-badge">${e(d.status)}</p><h2><a href="${d.route}">${e(d.title)}</a></h2><p class="card-meta">${author} · Manuscript <time datetime="${d.date}">14 September 2026</time></p><p>${e(d.cardDescription)}</p><div class="card-links"><a class="read-paper" href="${d.route}">Read paper <span aria-hidden="true">↗</span></a><a href="${d.sourceUrl}">View source</a></div></div></article>`).join('')}</div>`;
}
const collectionIntro =
  'Research on frontier-AI assurance, model control, hazardous inference, recursive AI R&D, epistemic dependence and quantitative AI-risk modelling.';
await page(
  '/research',
  'Formal Publications & Research',
  collectionIntro,
  `${titleBlock('Formal Publications & Research', 'Superintel / Research', collectionIntro)}<div class="archive-principle"><p>Mathematics proves implications;<br><em>evidence establishes premises.</em></p><div><span>07 <small>working papers & protocols</small></span><span>68 <small>thesis records</small></span></div></div><p class="collection-note">Working papers, formal models and research protocols. Proposed experiments are not presented as completed results. <a href="/research/release-order">Read the publication-readiness assessment.</a></p><div class="collection-heading"><h2>Core technical papers</h2><span>Programme v0.1 · 14 September 2026</span></div>${cards()}<section class="archive-collections"><div><p class="research-eyebrow">Atlas & programme</p><h2>From thesis to research object</h2><p>Provenance, assumptions, falsifiers and the seven papers into which stronger ideas were consolidated.</p><a href="/research/atlas">Explore all 68 theses ↗</a><a href="/research/programme">Programme overview</a><a href="/research/clustering">Clustering matrix</a></div><div><p class="research-eyebrow">Research methodology</p><h2>What survives scrutiny?</h2><p>Candidate contributions are assessed against prior art. Originality and publication readiness remain separate questions.</p><a href="/research/novelty">Adversarial novelty audit ↗</a><a href="/research/release-order">Release order & readiness</a><a href="/research/sources">Bibliography, sources & version record</a></div><div><p class="research-eyebrow">Notes & historical formulations</p><h2>An auditable development history</h2><p>Early conjectures and assistant formulations retain their context and attribution, alongside later qualified treatments.</p><a href="/research/history">Read historical research extracts ↗</a><a href="${note.route}">State-space working note</a><a href="/research/source-index">Original package index</a></div></section>${authorship}`,
);
await page(
  '/research/papers',
  'Core Technical Papers',
  'Seven working manuscripts and protocols by Moheet Khawaja.',
  `${titleBlock('Core technical papers', 'Research / P1–P7', 'Seven distinct research objects. All manuscripts are v0.1 proposals; none reports a new executed empirical study.')}<p><a href="/research/release-order">Publication readiness and evidence still required ↗</a></p>${cards()}${authorship}`,
);
for (const d of documents) {
  const displaySource = d.id === 'P2' ? d.source.replaceAll('\x08eta_', '\\beta_') : d.source;
  const bodySource = displaySource.replace(/^# .+\r?\n/, '').replace(/^# /gm, '## ');
  const result = render(bodySource, { file: d.file });
  const primary = atlas.filter((r) => r.primary_destination.startsWith(d.id + ' '));
  const secondary = d.id
    ? atlas.filter((r) => new RegExp(`\\b${d.id}\\b`).test(r.secondary_links))
    : [];
  const thesisLinks = (rows) =>
    rows.map((r) => `<a href="/research/atlas#T${r.id}">T${r.id} · ${e(r.title)}</a>`).join('');
  const related = d.id
    ? `<section class="paper-theses"><h2>Research provenance</h2><p>Mappings from the Atlas CSV. Authorship of a paper does not imply originality of every underlying idea.</p><h3>Primary thesis records</h3><div>${thesisLinks(primary)}</div>${secondary.length ? `<h3>Secondary connections</h3><div>${thesisLinks(secondary)}</div>` : ''}</section>`
    : '';
  const index = papers.indexOf(d);
  const previous = papers[index - 1],
    next = papers[index + 1];
  const nav = d.id
    ? `<nav class="paper-pagination" aria-label="Previous and next paper">${previous ? `<a href="${previous.route}">← ${previous.id}: ${e(previous.title.split(':')[0])}</a>` : '<a href="/research/papers">← All papers</a>'}${next ? `<a href="${next.route}">${next.id}: ${e(next.title.split(':')[0])} →</a>` : '<a href="/research/atlas">Explore the Atlas →</a>'}</nav>`
    : '';
  const warning =
    d.type === 'history'
      ? `<aside class="publication-note"><strong>Historical formulations · Not established</strong><p>This is a selection from an exploratory conversation, not a formal manuscript or a record of verified findings. Speaker labels distinguish Moheet’s messages from assistant responses; quoted third-party material retains Q provenance. Strong claims are preserved for audit, not endorsed.</p><p>For the later treatment, read <a href="${papers[1].route}">P2: hazardous inference</a>, <a href="${papers[3].route}">P4: conditional control and counterexamples</a>, and the <a href="/research/novelty">novelty audit</a>. <a href="/research/sources">See extraction boundaries and omissions.</a></p></aside>`
      : d.type === 'paper'
        ? `<aside class="publication-note"><strong>${e(d.status)}</strong><p>${e(d.readiness)} <a href="/research/release-order">Read the full release criteria.</a></p><p>Suggested PDF URLs, code repositories and HTML metadata printed inside the manuscript are planning examples, not available downloads or actual publication metadata. References retain the supplied bibliographic wording.</p></aside>`
        : '';
  const missing = result.env.missing?.length
    ? `<aside class="publication-note"><strong>Source-package gaps</strong><p>Grey references in this original index name files that were not supplied. They remain visible but are not presented as working downloads. <a href="/research/sources">See the source inventory.</a></p></aside>`
    : '';
  const sourceRecord = manifest.files.find((f) => f.published_source === d.file);
  const metadata = `<dl class="document-metadata"><div><dt>Author</dt><dd>${author}</dd></div><div><dt>Version</dt><dd>${e(d.version)}</dd></div><div><dt>${d.type === 'history' ? 'Conversation date' : 'Original manuscript date'}</dt><dd><time datetime="${d.date}">${d.date}</time></dd></div><div><dt>First HTML publication / site update</dt><dd><time datetime="${siteDate}">${siteDate}</time></dd></div><div class="metadata-source"><dt>Source filename</dt><dd>${e(d.file)}</dd></div></dl>`;
  await page(
    d.route,
    d.title,
    d.description,
    `<a class="back-link" href="/research">← Back to Research</a>${titleBlock(d.title, `Research / ${d.id ?? d.status}`)}${metadata}<div class="document-actions"><a href="${d.sourceUrl}">View Markdown source</a><a href="${repo}/tree/codex/asi-atlas/${d.type === 'note' ? 'public/research' : 'content/research/documents'}/${d.file}">GitHub source</a><a href="/research/sources">Version & source record</a>${d.type === 'note' ? '<a href="/research/state-space-framework-v0.1.pdf">Existing v0.1 PDF</a>' : ''}</div>${warning}${missing}${d.id === 'P2' ? '<aside class="publication-note"><strong>Documented display repair</strong><p>Equation (8) contains two backspace characters in the supplied file where the surrounding notation identifies beta_1 and beta_2. HTML rendering restores these as \u03b2₁ and \u03b2₂. The downloadable original remains unchanged.</p></aside>' : ''}<div class="reading-layout"><aside class="document-toc"><nav aria-label="On this page"><strong>On this page</strong>${result.toc.map((h) => `<a class="${h.level}" href="#${e(h.id)}">${e(h.text)}</a>`).join('')}</nav></aside><article class="manuscript">${result.html}${related}${sourceRecord ? `<p class="source-fingerprint">Published source SHA-256: <code>${sourceRecord.published_sha256}</code></p>` : ''}${authorship}</article></div>${nav}`,
    d,
  );
  d.toc = result.toc;
  d.mathCount = result.env.mathCount ?? 0;
  d.missing = result.env.missing ?? [];
}
await page(
  '/research/history',
  'Historical Research Formulations',
  'Research extracts from two conversations dated 13 September 2026, retaining speaker provenance.',
  `${titleBlock('Historical research formulations', 'Research / Development history', 'Earlier conjectures are preserved alongside their counterarguments. These conversations are neither peer-reviewed papers nor evidence that their claims are true.')}<div class="history-list">${history.map((d) => `<article><span class="status-badge">Historical formulation · Not established</span><h2><a href="${d.route}">${e(d.title)}</a></h2><p>${author} with AI-assistant responses · 13 September 2026</p><p>Research extracts; source timezone unspecified. <a href="${d.route}">Read the conversation extracts ↗</a></p></article>`).join('')}</div><p><a href="/research/sources">Extraction record and omitted non-research material</a></p>${authorship}`,
);

// The Atlas is server-rendered in full; client-side filters only refine what is visible.
const keys = [
  ['id', 'ID'],
  ['provenance', 'Provenance'],
  ['epistemic_status', 'Epistemic status'],
  ['primary_destination', 'Primary paper / destination'],
];
const option = (value, label = value) => `<option value="${e(value)}">${e(label)}</option>`;
function destination(value) {
  return e(value)
    .replace(/\bP[1-7]\b/g, (id) => `<a href="${papers.find((p) => p.id === id).route}">${id}</a>`)
    .replace(/\bRN[1-4]\b/g, (id) => `<a href="/research/atlas?destination=${id}">${id}</a>`);
}
const atlasRows = atlas
  .map(
    (r) =>
      `<tr id="T${r.id}" data-thesis data-id="${r.id}" data-provenance="${e(r.provenance)}" data-epistemic_status="${e(r.epistemic_status)}" data-primary_destination="${e(r.primary_destination)}"><th scope="row"><a href="#T${r.id}">T${r.id}</a></th><td><h2>${e(r.title)}</h2><div class="atlas-tags"><span>${e(r.provenance)}</span><span>${e(r.epistemic_status)}</span></div>${r.id === '15' ? `<p class="historical-qualification">Historical conjecture · Not established. <a href="${papers[3].route}#${papers[3].toc.find((h) => h.text.startsWith('6. Why')).id}">Read P4’s counterexamples.</a></p>` : ''}<details><summary>Assumptions, falsifiers & prior art</summary><dl>${[
        ['assumptions', 'Assumptions'],
        ['falsifiers', 'Falsifiers'],
        ['prior_art', 'Prior art'],
        ['current_version', 'Version'],
      ]
        .map(([key, label]) => `<div><dt>${label}</dt><dd>${e(r[key])}</dd></div>`)
        .join(
          '',
        )}</dl></details></td><td><span class="atlas-field-label">Primary</span>${destination(r.primary_destination)}${r.secondary_links ? `<span class="atlas-field-label">Secondary</span>${destination(r.secondary_links)}` : ''}</td></tr>`,
  )
  .join('');
await page(
  '/research/atlas',
  'Superintelligence Research Atlas',
  '68 thesis records preserving provenance, epistemic status, assumptions, falsifiers and paper destinations.',
  `${titleBlock('Superintelligence Research Atlas', 'Research / 68 thesis records', 'The Atlas preserves the development of 68 distinct research theses and proposals. It records provenance, epistemic status, assumptions, falsifiers, prior art and the papers into which stronger ideas were consolidated.')}<div class="atlas-intro"><p>v0.1 · Source date 14 September 2026 · HTML published 15 September 2026</p><p>Historical formulations are preserved rather than silently rewritten. Labels describe the source’s classification: “REPLICATION” here is not evidence that a replication experiment was run. T14 remains CONJECTURE despite “Theorem” in its title. RN1–RN4 name research-note groups, not supplied standalone manuscripts.</p><details class="provenance-key"><summary>Provenance key & epistemic status</summary><dl>${Object.entries(
    provenance,
  )
    .map(([key, text]) => `<div><dt>${e(key)}</dt><dd>${e(text)}</dd></div>`)
    .join(
      '',
    )}</dl><p>Statuses in this dataset: ${[...new Set(atlas.map((r) => r.epistemic_status))].map(e).join(' · ')}. No new empirical status is assigned by this site.</p></details><p><a href="/research/sources/SUPERINTELLIGENCE_RESEARCH_ATLAS.csv">Download original CSV</a> · <a href="/research/clustering">Clustering matrix</a></p></div><form id="atlas-filters" class="atlas-filters" hidden><label class="atlas-search">Search all fields<input type="search" name="search" placeholder="e.g. control, evidence, T16" autocomplete="off"></label>${keys.map(([key, label]) => `<label>${label}<select name="${key}" aria-label="${e(label)}">${option('', 'All')}${[...new Set(atlas.map((r) => r[key]))].map((v) => option(v, key === 'id' ? `T${v}` : v)).join('')}</select></label>`).join('')}<button type="reset">Reset filters</button></form><p id="atlas-count" role="status">68 of 68 thesis records</p><noscript><p>All 68 records are available below. Enable JavaScript to use search and filters.</p></noscript><div class="atlas-table-wrap"><table class="atlas-table"><caption class="visually-hidden">The 68-thesis research Atlas; open a record’s details for assumptions, falsifiers and prior art.</caption><thead><tr><th scope="col">ID</th><th scope="col">Thesis & evidence status</th><th scope="col">Paper connections</th></tr></thead><tbody>${atlasRows}</tbody></table></div><p id="atlas-empty" hidden>No records match these filters. Reset them or try a broader search.</p>${authorship}`,
  { version: 'v0.1', date: '2026-09-14' },
);
const missing = [...new Set(documents.flatMap((d) => d.missing))];
await page(
  '/research/sources',
  'Sources, Versions & Publication Record',
  'A source inventory, hashes, extraction boundaries and publication caveats for the research archive.',
  `${titleBlock('Sources, versions & publication record', 'Research / Audit trail', 'The seven manuscripts and six supporting data/documents are preserved byte for byte. Two historical exports are published as clearly marked research extracts; their original files remain unchanged locally.')}<section class="source-record"><h2>Dates and authorship</h2><p>Programme and working manuscripts: 14 September 2026, v0.1. Historical conversations: 13 September 2026; the exports do not specify a timezone. First HTML archive publication and site update: 15 September 2026. Citation metadata uses the actual HTML publication date; original manuscript dates remain visible.</p><p>Author: ${author}. Assistant responses and third-party quotations retain separate attribution. This is independent work; no University of Westminster endorsement, peer review, journal acceptance or DOI is asserted.</p><h2>Source inventory</h2><div class="table-scroll" tabindex="0" role="region" aria-label="Source inventory"><table><thead><tr><th>Original filename</th><th>Published form</th><th>Source</th></tr></thead><tbody>${manifest.files.map((f) => `<tr><td>${e(f.original)}</td><td>${e(f.mode)}</td><td><a href="/research/sources/${f.published_source}">Download source</a></td></tr>`).join('')}</tbody></table></div><p><a href="/research/sources/source-manifest.json">Download machine-readable hashes and extraction ranges</a> · <a href="${repo}/commits/codex/asi-atlas/content/research">Git revision history</a></p><h2>Historical extraction boundaries</h2>${manifest.files
    .filter((f) => f.included_line_ranges)
    .map(
      (f) =>
        `<h3>${e(f.original)}</h3><p>Included original line ranges: ${f.included_line_ranges.map(([a, b]) => `${a}–${b}`).join(', ')}. The published source inserts explicit editorial markers between extracts. Research images are preserved; personal financial-account screenshots are excluded.</p><p>${e(f.omission_reason)}</p>`,
    )
    .join(
      '',
    )}<p>The generalization export’s unsupported EU-ban claim is retained with the later assistant correction at original lines 776–778. The Dario Amodei essay pasted inside that conversation is a third-party quotation (Q), not an original contribution. Neither the conversation’s news claims nor its assistant-generated assertions are validated research findings.</p><h2>Missing source-package files</h2><p>The original index refers to the following files, which were not supplied. No replacement manuscript, bibliography, code repository or result has been invented.</p><ul>${missing.map((f) => `<li><code>${e(f)}</code></li>`).join('')}</ul><h2>Bibliographic methodology</h2><p>References embedded in the manuscripts are reproduced as supplied. No BibTeX library was included. Links and bibliographic claims are distinct: a reachable URL does not establish that a citation is correct. The <a href="/research/novelty">novelty audit</a> is itself a dated source document, not a certification of global priority.</p><h3>Reference link check</h3><p>Checked ${e(linkCheck.checkedAt.slice(0, 10))}: ${reached} of ${linkCheck.results.length} linked external references responded successfully. Twelve returned access-denied responses to automated requests; two are account-specific conversation URLs. A blocked response does not establish that a reference is broken. Citation accuracy and the claims in historical discussions have not been independently certified.</p><p><a href="/research/sources/reference-link-check.json">Inspect each URL and its recorded response</a></p><h2>Publication readiness</h2><p>The <a href="/research/release-order">release plan</a> recommends waiting for empirical work before promoting P2, P3, P5 and P6, and stronger theory or data for P4. This archive makes those drafts public as proposals, with that assessment intact. P7’s preregistration is a proposed protocol, not evidence of completed registration or calibrated catastrophic-risk forecasts.</p><h2>Documented rendering repair</h2><p>P2 equation (8), original line 253, contains two backspace bytes followed by “eta_”. Only the displayed equation restores these to the surrounding notation’s beta_1 and beta_2. Both original bytes and the original source hash remain unchanged.</p><h2>Downloads and existing note</h2><p>No PDFs, DOI records or executable research repositories were supplied for P1–P7. Suggested URLs in their text remain visible as planning examples, not real downloads. HTML and Markdown are available now.</p><p>The earlier <a href="${note.route}">state-space research note</a> and its existing <a href="/research/state-space-framework-v0.1.pdf">two-page PDF</a> remain available separately. It predates this seven-paper package and is not silently merged into it.</p></section>${authorship}`,
);
await mkdir(path.join(output, 'assets'), { recursive: true });
await mkdir(path.join(output, 'sources'), { recursive: true });
await cp(path.join(content, 'documents'), path.join(output, 'sources'), { recursive: true });
await cp(path.join(content, 'images'), path.join(output, 'assets'), { recursive: true });
await copyFile(
  path.join(content, 'source-manifest.json'),
  path.join(output, 'sources/source-manifest.json'),
);
await copyFile(
  path.join(content, 'reference-link-check.json'),
  path.join(output, 'sources/reference-link-check.json'),
);
await copyFile(path.join(content, 'LICENSE.md'), path.join(output, 'sources/LICENSE.md'));
await copyFile(path.join(root, 'src/styles/research.css'), path.join(output, 'assets/base.css'));
await copyFile(
  path.join(root, 'scripts/research/archive.css'),
  path.join(output, 'assets/archive.css'),
);
await copyFile(
  path.join(root, 'scripts/research/archive.js'),
  path.join(output, 'assets/archive.js'),
);
await copyFile(
  path.join(root, 'node_modules/katex/dist/katex.min.css'),
  path.join(output, 'assets/katex.min.css'),
);
await cp(path.join(root, 'node_modules/katex/dist/fonts'), path.join(output, 'assets/fonts'), {
  recursive: true,
});
await writeFile(path.join(output, 'sources/routes.json'), JSON.stringify(routes, null, 2) + '\n');
await writeFile(
  path.join(output, 'sources/render-report.json'),
  JSON.stringify(
    documents.map((d) => ({
      file: d.file,
      route: d.route,
      title: d.title,
      mathExpressions: d.mathCount,
      unavailableSourceLinks: d.missing,
    })),
    null,
    2,
  ) + '\n',
);
await writeFile(
  path.join(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...navigation.filter(([id]) => !['map', 'publications'].includes(id)).map(([, , href]) => href), ...routes.map((r) => r.route)].map((route) => `<url><loc>${e(origin + route)}</loc><lastmod>${siteDate}</lastmod></url>`).join('')}</urlset>\n`,
);
await writeFile(
  path.join(root, 'public/robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  path.join(root, 'public/llms.txt'),
  `# Superintel — Moheet Khawaja\n\nIndependent research. Working proposals are not empirical results. Mathematics proves implications; evidence establishes premises.\n\n${routes.map((r) => `- [${r.title}](${origin + r.route})`).join('\n')}\n`,
);
console.log(
  `Rendered ${routes.length} static research routes, ${papers.length} papers and ${atlas.length} thesis records. ${documents.reduce((n, d) => n + d.mathCount, 0)} equations rendered.`,
);
