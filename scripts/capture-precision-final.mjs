import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const directory = 'docs/screenshots/precision';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
const report = [];
async function ready() {
  await page.locator('canvas').waitFor();
  await page.waitForFunction(() => location.hash.includes('pos='));
  await page.waitForTimeout(300);
}
async function capture(name) {
  await page.locator('.scene-panel').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${directory}/${name}.png` });
  report.push({
    name,
    viewport: page.viewportSize(),
    url: page.url(),
    rendering: await page.locator('canvas').evaluate((el) => ({ ...el.dataset })),
  });
}
async function camera(position, target) {
  const url = new URL(page.url());
  const state = new URLSearchParams(url.hash.slice(1));
  state.set('pos', position.join(','));
  state.set('target', target.join(','));
  url.hash = state.toString();
  await page.goto(url.href);
  await ready();
}
try {
  await page.goto('http://127.0.0.1:4173/?robotDebug=1');
  await ready();
  if (await page.locator('.robot-debug').count()) throw Error('Debug mode leaked into production');
  await page.goto('http://127.0.0.1:4173/');
  await ready();
  await page.getByRole('button', { name: 'Scene settings', exact: true }).click();
  await page.getByRole('button', { name: 'Front view', exact: true }).click();
  await page.getByRole('button', { name: 'Close Scene settings', exact: true }).click();
  await capture('final-dual-front');
  await page.getByRole('button', { name: 'Host A', exact: true }).click();
  await capture('final-host-a-front');
  let state = new URLSearchParams(new URL(page.url()).hash.slice(1));
  const target = state.get('target').split(',').map(Number);
  const pos = state.get('pos').split(',').map(Number);
  const distance = Math.hypot(...pos.map((value, i) => value - target[i]));
  await camera(
    [target[0] - distance * 0.53, target[1] + 0.25, target[2] + distance * 0.848],
    target,
  );
  await capture('final-host-a-three-quarter');
  await camera([-3.3, 4.85, 6.8], [0, 4.85, 0]);
  await capture('final-host-a-close');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4173/');
  await ready();
  await capture('final-mobile-390x844');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(
    'http://127.0.0.1:3016/?robotDebug=1#v=3&view=body&layers=all&isolate=0&explode=0&pos=-3.3,4.85,6.8&target=0,4.85,0&host=host-a&transfer=migrate&phase=ready&finish=Coral',
  );
  await page.getByRole('region', { name: 'Development robot comparison' }).waitFor();
  await page.getByRole('button', { name: 'Materials', exact: true }).click();
  await page.getByRole('button', { name: 'Guides', exact: true }).click();
  await camera([-3.3, 4.85, 6.8], [0, 4.85, 0]);
  await capture('detail-review-upper');
  await camera([-1.7, 2.55, 3.4], [-0.6, 2.55, 0]);
  await capture('detail-review-hands');
  await writeFile(`${directory}/capture-metrics.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
