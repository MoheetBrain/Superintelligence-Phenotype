import { test, expect } from '@playwright/test';

test('inspection can hide overlays without changing execution state or camera', async ({
  page,
}) => {
  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect.poll(() => canvas.getAttribute('data-state-hosts')).toBe('a');
  const url = page.url();
  await page.getByRole('button', { name: 'Hide annotations', exact: true }).click();
  await expect(page.locator('.operational-handle')).toBeHidden();
  await expect(page.locator('.floating-host-label').first()).toBeHidden();
  await expect.poll(() => canvas.getAttribute('data-state-hosts')).toBe('');
  expect(page.url()).toBe(url);
  await expect(page.getByTestId('host-a-status')).toContainText('ACTIVE');
  await page.getByRole('button', { name: 'Show annotations', exact: true }).click();
  await expect(page.locator('.operational-handle')).toBeVisible();
  await expect.poll(() => canvas.getAttribute('data-state-hosts')).toBe('a');
});

test('public orbit clamps at both polar limits and keeps a working camera', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect.poll(() => canvas.getAttribute('data-polar-angle')).not.toBeNull();
  await page.getByRole('button', { name: 'Hide annotations', exact: true }).click();
  const box = (await canvas.boundingBox())!;
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  for (const delta of [-1500, 1500]) {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x, start.y + delta, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(250);
    const angle = (Number(await canvas.getAttribute('data-polar-angle')) * 180) / Math.PI;
    expect(angle).toBeGreaterThanOrEqual(55 - 0.01);
    expect(angle).toBeLessThanOrEqual(120 + 0.01);
    expect(Math.min(Math.abs(angle - 55), Math.abs(angle - 120))).toBeLessThan(0.01);
  }
});
