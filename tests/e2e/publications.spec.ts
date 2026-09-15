import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

const routes: { route: string; title: string; type: string }[] = JSON.parse(
  fs.readFileSync('public/research/sources/routes.json', 'utf8'),
);

for (const { route, title } of routes) {
  test(`static publication renders without JavaScript: ${route}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle(`${title} · Superintel`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('.archive-author')).toHaveText('Moheet Khawaja');
    await expect(page.locator('.document-authorship strong')).toHaveText('Author: Moheet Khawaja');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await expect(page.locator('.research-nav a')).toHaveCount(6);
    if (route === '/research/atlas') await expect(page.locator('[data-thesis]')).toHaveCount(72);
    await context.close();
  });
}

test('Atlas filters combine, survive reload, reset, and resolve thesis share links', async ({
  page,
}) => {
  await page.goto('/research/atlas');
  const rows = page.locator('[data-thesis]:visible');
  await expect(rows).toHaveCount(72);
  await page.getByRole('searchbox', { name: 'Search all fields' }).fill('T16');
  await expect(rows).toHaveCount(1);
  await expect(rows).toHaveAttribute('id', 'T16');
  await page.reload();
  await expect(rows).toHaveCount(1);
  await expect(page.getByRole('searchbox')).toHaveValue('T16');
  await page.getByLabel('ID', { exact: true }).selectOption('17');
  await expect(rows).toHaveCount(0);
  await expect(page.locator('#atlas-empty')).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(rows).toHaveCount(72);
  await page.getByLabel('Provenance', { exact: true }).selectOption('A→U');
  await expect(rows).not.toHaveCount(72);
  expect(
    await rows.evaluateAll((elements) =>
      elements.every((el) => el.getAttribute('data-provenance') === 'A→U'),
    ),
  ).toBeTruthy();
  await page.goto('/research/atlas?destination=RN1');
  expect(
    await rows.evaluateAll(
      (elements) =>
        elements.length > 0 &&
        elements.every((el) => el.getAttribute('data-primary_destination')?.startsWith('RN1')),
    ),
  ).toBeTruthy();
  await page.goto('/research/atlas?id=1#T16');
  await expect(page.locator('#T16')).toBeVisible();
  await expect(page.locator('#T16 details')).toHaveAttribute('open', '');
  await page.locator('#T16 a[href^="/research/papers/"]').first().click();
  await expect(page.locator('.paper-theses a[href="/research/atlas#T16"]')).toBeVisible();
});

test('paper section links reach rendered mathematics and the new navigation reaches the archive', async ({
  page,
}) => {
  await page.goto('/?section=framework');
  await page
    .getByRole('navigation', { name: 'Research sections' })
    .getByRole('link', { name: /06.*Research/ })
    .click();
  await expect(page.locator('h1')).toHaveText('Formal Publications & Research');
  await page.locator('.read-paper').first().click();
  await page
    .getByRole('navigation', { name: 'On this page' })
    .getByRole('link', { name: '3. Formal model', exact: true })
    .click();
  await expect(page).toHaveURL(/#3-formal-model/);
  const target = page.locator('[id="3-formal-model"]');
  await expect
    .poll(() => target.evaluate((el) => Math.abs(el.getBoundingClientRect().top) < 120))
    .toBeTruthy();
  await expect(page.locator('.katex').first()).toBeVisible();
});

test('publication templates pass accessibility checks on desktop and mobile', async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/research',
      '/research/atlas',
      '/research/papers/hazardous-inference-frontier',
      '/research/papers/embodiment-threshold',
      '/research/sources',
      '/research/history/evolution-and-strategy',
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${width} ${route}`,
      ).toBeTruthy();
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${width} ${route}`,
      ).toEqual([]);
    }
  }
});

test('later extension filter and theorem link expose P8 assumptions and proof', async ({
  page,
}) => {
  await page.goto('/research/atlas');
  await page.getByLabel('Corpus', { exact: true }).selectOption('Later research extension');
  const rows = page.locator('[data-thesis]:visible');
  await expect(rows).toHaveCount(4);
  await page.reload();
  await expect(rows).toHaveCount(4);
  await page.getByLabel('Epistemic status', { exact: true }).selectOption('THEOREM');
  await expect(rows).toHaveCount(1);
  await expect(rows).toHaveAttribute('id', 'T72');
  await page.getByRole('link', { name: 'Read the assumptions and proof.' }).click();
  await expect(page).toHaveURL(/embodiment-threshold#8-embodiment-only-delay-bound-theorem/);
  await expect(page.locator('[id="8-embodiment-only-delay-bound-theorem"]')).toBeInViewport();
  await expect(page.getByRole('heading', { name: 'Proof by cases' })).toBeVisible();
  await expect(page.locator('.document-authorship strong')).toHaveText('Author: Moheet Khawaja');
});
