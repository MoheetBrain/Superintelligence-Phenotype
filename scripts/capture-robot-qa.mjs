import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const [tag = 'clay-front', view = 'FRONT', stage = 'Clay', host = 'Host A'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
await page.goto('http://127.0.0.1:3016/?robotDebug=1');
await page.getByRole('region', { name: 'Development robot comparison' }).waitFor();
await page.getByRole('button', { name: host, exact: true }).click();
await page.getByRole('button', { name: stage, exact: true }).click();
await page.getByRole('button', { name: view, exact: true }).click();
await page.locator('.scene-panel').scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await mkdir('docs/screenshots/reconstruction', { recursive: true });
await page.screenshot({ path: `docs/screenshots/reconstruction/${tag}.png` });
console.log(
  JSON.stringify({
    url: page.url(),
    render: await page.locator('canvas').evaluate((el) => ({ ...el.dataset })),
    debug: await page.locator('.robot-debug').innerText(),
  }),
);
await browser.close();
