import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function ready(page: Page) {
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page).toHaveURL(/pos=/);
  await page.waitForTimeout(150);
}
async function dragState(page: Page, valid = true) {
  // Wait for the projected handle to settle after a cancelled gesture before
  // reading coordinates for the raw pointer events below.
  await page
    .getByRole('button', { name: 'Extract operational state from Host A', exact: true })
    .hover();
  const from = await page
    .getByRole('button', { name: 'Extract operational state from Host A', exact: true })
    .boundingBox();
  const to = await page
    .getByRole('button', { name: 'Host B compatible execution environment', exact: true })
    .boundingBox();
  if (!from || !to) throw Error('Missing state handle/drop target');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    valid ? to.x + to.width / 2 : from.x - 80,
    valid ? to.y + to.height / 2 : from.y + 140,
    { steps: 18 },
  );
  if (valid) await expect(page.locator('.operational-target')).toHaveClass(/eligible/);
  await page.mouse.up();
}
test('drag migration has distinct restoration phases, then stops A and resumes B', async ({
  page,
}) => {
  await page.goto('/');
  await ready(page);
  await dragState(page);
  await expect(page.locator('.transfer-live')).toContainText('Host B receives state');
  await expect(page.locator('.transfer-live')).toContainText('Compatibility check');
  await expect(page.getByTestId('host-a-status')).toContainText('INACTIVE');
  await expect(page.getByTestId('host-b-status')).toContainText('ACTIVE');
  await expect(page.locator('.transfer-live')).toContainText('Host B is now active');
  await expect(page.getByRole('group', { name: 'Transfer mode for dragging' })).toBeVisible();
  await expect(
    page.getByText('This does not imply that regulation or prohibition is impossible.', {
      exact: true,
    }),
  ).toBeVisible();
});
test('invalid drop and Escape cancel cleanly, then a new drag succeeds', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await ready(page);
  await dragState(page, false);
  await expect(page.getByTestId('host-a-status')).toContainText('ACTIVE');
  await expect(page.getByTestId('host-b-status')).toContainText('AVAILABLE');
  await page.locator('.operational-handle').hover();
  const source = await page.locator('.operational-handle').boundingBox();
  if (!source) throw Error('Missing source');
  await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
  await page.mouse.down();
  await page.mouse.move(source.x + 110, source.y + 10, { steps: 5 });
  await page.keyboard.press('Escape');
  await page.mouse.up();
  await expect(page.locator('.drag-guidance')).toHaveCount(0);
  await expect(page.getByTestId('host-b-status')).toContainText('AVAILABLE');
  await dragState(page);
  await expect(page.getByTestId('host-b-status')).toContainText('ACTIVE');
});
test('keyboard copy, fork and remote control preserve distinct host states', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await ready(page);
  const copy = page.getByRole('button', { name: 'Copy A → B', exact: true });
  await copy.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('host-a-status')).toContainText('ACTIVE');
  await expect(page.getByTestId('host-b-status')).toContainText('ACTIVE');
  await page.getByRole('button', { name: 'Fork A → B', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Fork lineage')).toContainText('Diverging histories');
  await page.getByLabel('Compare with remote control', { exact: true }).check();
  await expect(page.getByText('Remote control ≠ migration', { exact: true })).toBeVisible();
  await expect(page.locator('.operational-handle')).toBeVisible();
  await expect(page.locator('.communication-label')).toHaveText('commands + observations');
  await expect(page.getByTestId('host-b-status')).toContainText('Actuator · no local agent');
  await page.getByRole('button', { name: 'Reset demonstration', exact: true }).click();
  await expect(page.getByTestId('host-b-status')).toContainText('AVAILABLE');
});
test('settled simulation shares with new contexts and host presets retain inspection', async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Fork A → B', exact: true }).click();
  const other = await browser.newPage();
  await other.goto(page.url());
  await ready(other);
  await expect(other.getByLabel('Fork lineage')).toBeVisible();
  await other.close();
  await page.getByRole('button', { name: 'Host B', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-host-view', 'host-b');
  await expect(page.locator('canvas')).toHaveAttribute('data-state-hosts', 'b');
  await page.getByRole('button', { name: 'Inspect Substrate Mobility', exact: true }).click();
  await expect(page.getByLabel('Substrate mobility framework')).toContainText('Valid permissions');
  await page.getByRole('button', { name: 'Close inspector' }).click();
  await page.getByRole('button', { name: 'Dual host', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-host-view', 'dual');
  await page.locator('.part-inspection summary').click();
  await page.getByRole('button', { name: 'Inspect hands', exact: true }).click();
  await expect(page).toHaveURL(/cap=embodiment/);
  await expect(page).toHaveURL(/isolate=1/);
  await page.screenshot({ path: 'docs/screenshots/dual-host/hand-inspection.png', fullPage: true });
});
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
  { width: 844, height: 390 },
]) {
  test(`dual-host layout ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await ready(page);
    await expect(
      page.getByRole('button', { name: 'Inspect Host A graphite', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Inspect Host B pearl', exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: `docs/screenshots/dual-host/${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Migrate A → B', exact: true }).click();
    await expect(page.getByTestId('host-b-status')).toContainText('ACTIVE');
    await page.screenshot({
      path: `docs/screenshots/dual-host/migrated-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Inspect Substrate Mobility', exact: true }).click();
    await expect(page.getByLabel('Substrate mobility framework')).toBeVisible();
    await page.screenshot({
      path: `docs/screenshots/dual-host/dossier-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
test('touch dragging works without scrolling and non-WebGL mode supports every action', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  await ready(page);
  await page.locator('.operational-handle').scrollIntoViewIfNeeded();
  const a = await page.locator('.operational-handle').boundingBox(),
    b = await page.locator('.operational-target').boundingBox();
  if (!a || !b) throw Error('Missing touch targets');
  const client = await context.newCDPSession(page),
    initialScrollY = await page.evaluate(() => window.scrollY);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: a.x + a.width / 2, y: a.y + a.height / 2, id: 1 }],
  });
  for (let i = 1; i <= 12; i++)
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        {
          x: a.x + a.width / 2 + ((b.x + b.width / 2 - a.x - a.width / 2) * i) / 12,
          y: a.y + a.height / 2 + ((b.y + b.height / 2 - a.y - a.height / 2) * i) / 12,
          id: 1,
        },
      ],
    });
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.getByTestId('host-b-status')).toContainText('ACTIVE');
  expect(await page.evaluate(() => window.scrollY)).toBe(initialScrollY);
  await context.close();
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await fallback.emulateMedia({ reducedMotion: 'reduce' });
  await fallback.goto('/');
  await expect(
    fallback.getByText('3D is unavailable in this browser.', { exact: false }),
  ).toBeVisible();
  await fallback.getByRole('button', { name: 'Fork A → B', exact: true }).click();
  await expect(fallback.getByLabel('Fork lineage')).toBeVisible();
  await fallback.getByLabel('Compare with remote control', { exact: true }).check();
  await expect(fallback.getByText('Remote control ≠ migration', { exact: true })).toBeVisible();
  await fallback.close();
});

test('fork divergence is delayed; reset cancels restoration without making network requests', async ({
  page,
}) => {
  await page.goto('/');
  await ready(page);
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: 'Migrate A → B', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demonstration', exact: true }).click();
  await page.waitForTimeout(2100);
  await expect(page.getByTestId('host-b-status')).toContainText('AVAILABLE');
  await expect(page.locator('canvas')).toHaveAttribute('data-transfer-phase', 'ready');
  await page.getByRole('button', { name: 'Fork A → B', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-transfer-phase', 'complete');
  await expect(page.getByLabel('Fork lineage')).toHaveCount(0);
  await expect(page.getByLabel('Fork lineage')).toContainText('Diverging histories', {
    timeout: 4000,
  });
  await expect(page.locator('canvas')).toHaveAttribute('data-state-hosts', 'a,b');
  expect(requests).toEqual([]);
});
