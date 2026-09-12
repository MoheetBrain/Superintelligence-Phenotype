import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const [tag = 'pass-1', stage = 'Clay', finish = 'GRAPHITE'] = process.argv.slice(2);
const dir = 'docs/screenshots/precision';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  await page.goto('http://127.0.0.1:3016/?robotDebug=1');
  await page.getByRole('region', { name: 'Development robot comparison' }).waitFor();
  await page.getByRole('button', { name: finish, exact: true }).click();
  await page.getByRole('button', { name: stage, exact: true }).click();
  const report = [];
  for (const [view, suffix] of [
    ['FRONT', 'front'],
    ['3/4 LEFT', 'three-quarter'],
    ['LEFT SIDE', 'side'],
    ['BACK', 'back'],
    ['RIGHT SIDE', 'right-side'],
    ['3/4 RIGHT', 'right-three-quarter'],
  ]) {
    await page.getByRole('button', { name: view, exact: true }).click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${dir}/${tag}-${suffix}.png` });
    report.push({
      view,
      url: page.url(),
      render: await page.locator('canvas').evaluate((el) => ({ ...el.dataset })),
      debug: await page.locator('.robot-debug').innerText(),
    });
  }
  await writeFile(`${dir}/${tag}.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(
    JSON.stringify(
      report.map(({ view, render }) => ({ view, render })),
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
