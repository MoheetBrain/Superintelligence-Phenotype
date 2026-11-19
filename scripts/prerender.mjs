/**
 * Prerenders every route to static HTML after the client and SSR builds.
 *
 *   vite build                                   -> dist/ (browser CSS + JS, .vite/manifest.json)
 *   vite build --ssr src/entry-server.tsx         -> dist-ssr/entry-server.js
 *   node scripts/prerender.mjs                   -> dist/index.html, dist/<route>/index.html, 404.html, sitemap.xml, robots.txt
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js');
const manifestPath = join(dist, '.vite', 'manifest.json');

/** Fonts used above the fold on every page; preloaded to avoid a late swap. */
const PRELOAD_FONTS = [
  /^inter-latin-wght-normal-.*\.woff2$/,
  /^source-serif-4-latin-opsz-normal-.*\.woff2$/,
];

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entry = (source) => {
  const chunk = manifest[source];
  if (!chunk) throw new Error(`Missing manifest entry for ${source}`);
  return chunk;
};

const styleEntry = entry('src/styles/main.css');
const scriptEntry = entry('src/client/main.ts');
const assetFiles = await readdir(join(dist, 'assets'));

const assets = {
  styles: [`/${styleEntry.file}`],
  scripts: [`/${scriptEntry.file}`],
  fontPreloads: PRELOAD_FONTS.map((pattern) => {
    const match = assetFiles.find((file) => pattern.test(file));
    if (!match) throw new Error(`Font asset not found for ${pattern}`);
    return `/assets/${match}`;
  }),
};

const { routes, renderRoute, renderSitemap, renderRobots } = await import(
  pathToFileURL(ssrEntry).href
);

for (const route of routes) {
  const outFile = join(dist, route.file);
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, renderRoute(route, assets), 'utf8');
  console.log(`  prerendered ${route.path.padEnd(12)} -> dist/${route.file}`);
}

await writeFile(join(dist, 'sitemap.xml'), renderSitemap(), 'utf8');
await writeFile(join(dist, 'robots.txt'), renderRobots(), 'utf8');
console.log('  wrote dist/sitemap.xml, dist/robots.txt');

// The build manifest and SSR bundle are build-time artefacts only.
await rm(join(dist, '.vite'), { recursive: true, force: true });
await rm(join(root, 'dist-ssr'), { recursive: true, force: true });
