/**
 * Generates the committed raster images in public/ by screenshotting small HTML templates:
 *   public/og-image.png          1200×630 Open Graph / Twitter card
 *   public/apple-touch-icon.png  180×180 home-screen icon
 *
 * Run once after changing the brand or hero headline:  npm run images
 * Requires Node 22.18+ (native TypeScript type stripping, to read the content modules)
 * and Playwright's Chromium (npx playwright install chromium).
 */
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { site, home } = await import(join(root, 'src/content/site.ts'));
const { uiText } = await import(join(root, 'src/lib/ui-text.ts'));

const fontData = async (path) =>
  `data:font/woff2;base64,${(await readFile(join(root, 'node_modules', path))).toString('base64')}`;
const inter = await fontData('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const serif = await fontData(
  '@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-normal.woff2',
);

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const mark = (size) => `
  <svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="6" fill="#0b1f33"/>
    <rect x="8.5" y="8" width="4" height="16" rx="0.75" fill="#ffffff"/>
    <rect x="19.5" y="8" width="4" height="16" rx="0.75" fill="#ffffff"/>
    <rect x="12.5" y="14.25" width="7" height="3.5" fill="#5fb08c"/>
  </svg>`;

const baseStyles = `
  @font-face { font-family: 'Inter'; src: url(${inter}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Serif'; src: url(${serif}) format('woff2'); font-weight: 200 900; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; }
  body { -webkit-font-smoothing: antialiased; }
`;

const ogTemplate = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><style>
  ${baseStyles}
  body { width: 1200px; height: 630px; background: #ffffff; color: #0b1f33; font-family: 'Inter', sans-serif;
         display: flex; flex-direction: column; justify-content: space-between; padding: 72px 80px 64px;
         border-bottom: 12px solid #0b1f33; }
  .brand { display: flex; align-items: center; gap: 18px; }
  .brand-name { font-family: 'Serif', serif; font-size: 32px; font-weight: 620; letter-spacing: -0.01em; line-height: 1.1; }
  .brand-descriptor { margin-top: 4px; font-size: 18px; color: #556070; }
  h1 { font-family: 'Serif', serif; font-size: 76px; font-weight: 560; line-height: 1.05; letter-spacing: -0.02em;
       max-width: 900px; text-wrap: balance; }
  .foot { display: flex; align-items: center; gap: 16px; font-size: 19px; font-weight: 600;
          letter-spacing: 0.09em; text-transform: uppercase; color: #1f5f4a; }
  .foot::before { content: ''; width: 40px; height: 2px; background: currentColor; }
</style></head><body>
  <div class="brand">${mark(64)}<div><div class="brand-name">${escapeHtml(site.brand)}</div>
    <div class="brand-descriptor">${escapeHtml(uiText.brandDescriptor)}</div></div></div>
  <h1>${escapeHtml(home.hero.headline)}</h1>
  <div class="foot">${escapeHtml(home.hero.eyebrow)}</div>
</body></html>`;

const touchIconTemplate = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${baseStyles}
  body { width: 180px; height: 180px; background: #0b1f33; display: grid; place-items: center; }
</style></head><body>
  <svg width="180" height="180" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" fill="#0b1f33"/>
    <rect x="9.5" y="9" width="3.5" height="14" rx="0.6" fill="#ffffff"/>
    <rect x="19" y="9" width="3.5" height="14" rx="0.6" fill="#ffffff"/>
    <rect x="13" y="14.5" width="6" height="3" fill="#5fb08c"/>
  </svg>
</body></html>`;

const browser = await chromium.launch();
try {
  const outputs = [
    { file: 'public/og-image.png', html: ogTemplate, width: 1200, height: 630 },
    { file: 'public/apple-touch-icon.png', html: touchIconTemplate, width: 180, height: 180 },
  ];
  for (const { file, html, width, height } of outputs) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(root, file), clip: { x: 0, y: 0, width, height } });
    await page.close();
    console.log(`  wrote ${file} (${width}×${height})`);
  }
} finally {
  await browser.close();
}
