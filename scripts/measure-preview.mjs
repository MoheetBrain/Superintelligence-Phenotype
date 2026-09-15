import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failures = [];
  page.on('requestfailed', (r) => failures.push(r.url()));
  page.on('pageerror', (e) => failures.push(e.message));
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('networkidle');
  const measurements = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return [navigation, ...performance.getEntriesByType('resource')].map((e) => ({
      url: e.name,
      transferBytes: e.transferSize,
      encodedBodyBytes: e.encodedBodySize,
      decodedBodyBytes: e.decodedBodySize,
    }));
  });
  const totalTransferBytes = measurements.reduce((n, r) => n + r.transferBytes, 0);
  const rendering = [];
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(400);
    const before = await page.locator('canvas').evaluate((c) => ({ ...c.dataset }));
    await page.waitForTimeout(500);
    const after = await page.locator('canvas').evaluate((c) => ({ ...c.dataset }));
    rendering.push({
      viewport,
      triangles: Number(after.triangles),
      geometries: Number(after.geometries),
      projectedBodyBoundsHeightRatio: Number(after.bodyHeightRatio),
      idleAdditionalRenders: Number(after.renderCount) - Number(before.renderCount),
      idleObservationMs: 500,
    });
  }
  const report = {
    rendering,
    measuredAt: new Date().toISOString(),
    browser: browser.version(),
    viewport: { width: 1440, height: 900 },
    origin: 'http://127.0.0.1:4173',
    totalTransferBytes,
    measurements,
    failures,
    note: 'Cold browser context against local Vite static preview. Includes navigation and resource transfer sizes reported by Resource Timing. No cache reuse or throttling; this is not a real-device performance result.',
  };
  await writeFile('docs/preview-transfer.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (failures.length || totalTransferBytes > 2000000) process.exitCode = 1;
} finally {
  await browser.close();
}
