/**
 * Full-page screenshots for design review. Requires a running preview server:
 *   npm run build && npm run preview
 *   npm run screenshots            # writes to $TMPDIR/hr-shots by default
 *
 * Environment: BASE_URL (default http://127.0.0.1:4173), SHOTS_DIR, SHOTS_EXTRA=1 for extra widths,
 * SHOTS_SEGMENT=<px> to also write the full page as consecutive segments of that height.
 */
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const outDir = process.env.SHOTS_DIR ?? join(process.env.TMPDIR ?? tmpdir(), 'hr-shots');

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
];
if (process.env.SHOTS_EXTRA) {
  viewports.push(
    { name: 'tablet-820', width: 820, height: 1180 },
    { name: 'laptop-1100', width: 1100, height: 800 },
    { name: 'mobile-320', width: 320, height: 640, isMobile: true, hasTouch: true },
  );
}

const pages = [
  { name: 'home', path: '/' },
  { name: 'privacy', path: '/privacy/' },
];
if (process.env.SHOTS_EXTRA)
  pages.push({ name: 'terms', path: '/terms/' }, { name: '404', path: '/404.html' });

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    const { name: viewportName, ...options } = viewport;
    const context = await browser.newContext({
      viewport: { width: options.width, height: options.height },
      deviceScaleFactor: 1,
      isMobile: options.isMobile ?? false,
      hasTouch: options.hasTouch ?? false,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (const target of pages) {
      await page.goto(new URL(target.path, baseUrl).href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const file = join(outDir, `${target.name}-${viewportName}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
      const segment = Number(process.env.SHOTS_SEGMENT ?? 0);
      if (segment > 0) {
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0, index = 0; y < height; y += segment, index += 1) {
          const clip = { x: 0, y, width: options.width, height: Math.min(segment, height - y) };
          const part = join(outDir, 'segments', `${target.name}-${viewportName}-${index}.png`);
          await mkdir(join(outDir, 'segments'), { recursive: true });
          await page.screenshot({ path: part, fullPage: true, clip });
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
