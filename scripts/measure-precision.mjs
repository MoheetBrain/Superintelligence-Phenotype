import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForLoadState('networkidle');
  const before = await page.locator('canvas').evaluate((el) => ({ ...el.dataset }));
  await page.waitForTimeout(500);
  const after = await page.locator('canvas').evaluate((el) => ({ ...el.dataset }));
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');
  const heapBefore = (await client.send('Performance.getMetrics')).metrics.find(
    (x) => x.name === 'JSHeapUsedSize',
  )?.value;
  await page.getByRole('button', { name: 'Hide annotations', exact: true }).click();
  const box = await page.locator('canvas').boundingBox();
  const sample = page.evaluate(
    () =>
      new Promise((resolve) => {
        const samples = [];
        let previous;
        function frame(now) {
          if (previous !== undefined) samples.push(now - previous);
          previous = now;
          if (samples.length < 90) requestAnimationFrame(frame);
          else resolve(samples);
        }
        requestAnimationFrame(frame);
      }),
  );
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  for (let i = 0; i < 55; i++) {
    await page.mouse.move(
      box.x + box.width / 2 + Math.sin(i / 16) * 130,
      box.y + box.height / 2 + Math.cos(i / 16) * 30,
    );
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  const intervals = await sample;
  const sorted = [...intervals].sort((a, b) => a - b);
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const heapAfter = (await client.send('Performance.getMetrics')).metrics.find(
    (x) => x.name === 'JSHeapUsedSize',
  )?.value;
  const report = {
    measuredAt: new Date().toISOString(),
    browser: browser.version(),
    viewport: page.viewportSize(),
    triangles: Number(after.triangles),
    drawCalls: Number(after.drawCalls),
    geometries: Number(after.geometries),
    bodyHeightRatio: Number(after.bodyHeightRatio),
    idleAdditionalRenders: Number(after.renderCount) - Number(before.renderCount),
    idleObservationMs: 500,
    animationFrameSample: {
      samples: intervals.length,
      meanIntervalMs: mean,
      p95IntervalMs: sorted[Math.floor(sorted.length * 0.95)],
      approximateCallbacksPerSecond: 1000 / mean,
    },
    jsHeapBytes: { before: heapBefore, after: heapAfter },
    limits:
      'Local headless Chromium, no throttling. requestAnimationFrame callbacks during scripted orbit measure browser scheduling, not GPU frame time or physical-device FPS. Heap is one process snapshot, not a retained-memory/leak measurement.',
  };
  await writeFile('docs/precision-performance.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
