import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('research navigation, original artifact links and downloadable note', async ({
  page,
  request,
}) => {
  await page.goto('/?section=framework');
  const nav = page.getByRole('navigation', { name: 'Research sections' });
  await expect(nav.getByRole('link')).toHaveCount(5);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('State Vector Framework');
  await expect(
    page.getByText(
      'This is a proposed modelling framework, not an empirical claim that these variables are sufficient.',
    ),
  ).toBeVisible();
  await nav.getByRole('link', { name: /AI Safety Timeline/ }).click();
  await expect(page.locator('.research-timeline time')).toHaveCount(4);
  await expect(page.locator('.research-timeline a').first()).toHaveAttribute(
    'href',
    /commit\/789af6f4/,
  );
  await expect(
    page.getByRole('heading', { name: 'Earlier writing: archive incomplete' }),
  ).toBeVisible();
  await nav.getByRole('link', { name: /Research Notes/ }).click();
  await expect(page.getByRole('heading', { name: /A State-Space Framework/ })).toBeVisible();
  const pdf = await request.get('/research/state-space-framework-v0.1.pdf');
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI Safety Timeline');
  await page.reload();
  await expect(nav.locator('[aria-current="page"]')).toHaveText(/AI Safety Timeline/);
});

test('forecast target controls update scenario results and retain numerical caveat', async ({
  page,
  request,
}) => {
  await page.goto('/?section=forecasting');
  await expect(page.locator('.sensitivity-table')).toContainText('May 2034');
  await page.getByRole('button', { name: 'Public ASI', exact: true }).click();
  await expect(page.locator('.sensitivity-table')).toContainText('Nov 2035');
  await expect(page.locator('.sensitivity-table')).not.toContainText('May 2034');
  await expect(page.getByRole('button', { name: 'Public ASI', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'AGI', exact: true }).click();
  await expect(page.locator('.sensitivity-table')).toContainText('Jul 2031');
  await expect(page.locator('.numerical-note')).toContainText('criterion was not met');
  const response = await request.get('/research/forecast-sensitivity-2026-09-14.json');
  expect((await response.json()).scenarios).toHaveLength(3);
});

test('legacy atlas share links still open the selected capability', async ({ page }) => {
  await page.goto('/#v=2&view=body&layers=all&isolate=0&explode=0&cap=metacognition');
  await expect(
    page.getByTestId('inspector').getByRole('heading', { name: 'Metacognition', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Research sections' })
    .getByRole('link', { name: /State Vector/ })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('State Vector Framework');
  await page.goBack();
  await expect(
    page.getByTestId('inspector').getByRole('heading', { name: 'Metacognition', exact: true }),
  ).toBeVisible();
});

test('research sections remain accessible and fit a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const section of ['framework', 'timeline', 'forecasting', 'research']) {
    await page.goto(`/?section=${section}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    const violations = (
      await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    ).violations;
    expect(violations).toEqual([]);
  }
});
