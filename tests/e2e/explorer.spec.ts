import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PerspectiveCamera, Vector3 } from 'three';
import { parseState } from '../../src/state/shareState';
import { capabilities } from '../../src/data/capabilities';

const localPickPoints: readonly (readonly [number, number, number])[] = [
  [0, 0.2, 0.25],
  [0, -0.012, 0.27],
  [0, 0.66, -0.1],
  [0, 0, 0.1],
  [0.4, 0.12, 0.4],
  [-1.02, -0.06, 0.3],
  [0, 0, 0.2],
  [-0.4, 0.56, 0.1],
  [-1.25, -0.01, 0.14],
  [0, 0, 0.05],
  [0, 0.27, 0.3],
  [-1.12, 0.37, 0.17],
];
async function ready(page: Page) {
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect.poll(() => new URL(page.url()).hash).toContain('pos=');
  await page.waitForTimeout(250);
}
async function canvasPoint(page: Page, point: readonly number[]) {
  const box = await page.locator('canvas').boundingBox();
  if (!box) throw new Error('No canvas');
  const state = parseState(new URL(page.url()).hash);
  const camera = new PerspectiveCamera(34, box.width / box.height, 0.05, 250);
  camera.position.fromArray(state.camera.position);
  camera.lookAt(new Vector3().fromArray(state.camera.target));
  camera.updateMatrixWorld(true);
  const p = new Vector3().fromArray(point).project(camera);
  return { x: box.x + ((p.x + 1) * box.width) / 2, y: box.y + ((1 - p.y) * box.height) / 2 };
}
async function openList(page: Page) {
  if (!(await page.getByRole('dialog', { name: 'List view', exact: true }).count()))
    await page.getByRole('button', { name: 'Search atlas' }).click();
}
async function choose(page: Page, name: string) {
  await openList(page);
  await page
    .getByRole('dialog', { name: 'List view', exact: true })
    .getByRole('button', { name: `Explore ${name}`, exact: true })
    .click();
}
async function controls(page: Page) {
  await page.getByRole('button', { name: 'Scene settings', exact: true }).click();
}
async function closeControls(page: Page) {
  await page.getByRole('button', { name: 'Close Scene settings', exact: true }).click();
}
test('real canvas Metacognition journey, evidence, isolate, reset, orbit', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await ready(page);
  const point = await canvasPoint(page, [0.43, 5.95, 0.2]);
  await page.mouse.click(point.x, point.y);
  await expect(page.getByRole('heading', { name: 'Metacognition', exact: true })).toBeVisible();
  await expect(page.getByText('Hypothetical example · not an observed result')).toBeVisible();
  await page.getByRole('button', { name: 'Evidence', exact: true }).click();
  await expect(page.getByTestId('inspector').getByText('Observed', { exact: true })).toBeVisible();
  await expect(page.getByText(/Models and self-evaluation tasks studied/)).toBeVisible();
  await page.getByRole('button', { name: 'Isolate context' }).click();
  await expect(page).toHaveURL(/isolate=1/);
  await page.getByRole('button', { name: 'Exit isolation' }).click();
  await expect(page).toHaveURL(/isolate=0/);
  await page.getByRole('button', { name: 'Reset explorer' }).click();
  await expect(page.getByTestId('inspector')).toHaveCount(0);
  await ready(page);
  const canvas = await page.locator('canvas').boundingBox();
  if (!canvas) throw new Error('No canvas');
  const before = page.url();
  await page.mouse.move(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
  await page.mouse.down();
  await page.mouse.move(canvas.x + canvas.width / 2 + 80, canvas.y + canvas.height / 2 + 25, {
    steps: 12,
  });
  await page.mouse.up();
  await page.waitForTimeout(250);
  expect(page.url()).not.toBe(before);
  await expect(page.getByTestId('inspector')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('all twelve separated visual groups are independently raycast-selectable', async ({
  page,
}) => {
  await page.goto('/');
  await ready(page);
  await controls(page);
  await page.getByRole('button', { name: 'Front view', exact: true }).click();
  await page.locator('#explode').press('End');
  await closeControls(page);
  await ready(page);
  for (let i = 0; i < 12; i++) {
    const box = await page.locator('canvas').boundingBox();
    if (!box) throw new Error('No canvas');
    const aspect = box.width / box.height,
      columns = aspect < 0.8 ? 2 : aspect > 1.8 ? 4 : 3,
      rows = Math.ceil(12 / columns);
    const local = localPickPoints[i];
    const point = await canvasPoint(page, [
      ((i % columns) - (columns - 1) / 2) * 3.5 + local[0],
      (rows - 1 - Math.floor(i / columns)) * 3.1 + 1.5 + local[1],
      local[2],
    ]);
    await page.mouse.click(point.x, point.y);
    await expect(
      page
        .getByTestId('inspector')
        .getByRole('heading', { name: capabilities[i].name, exact: true }),
    ).toBeVisible();
    await page.waitForTimeout(230);
  }
});
test('hidden-layer search, filters, related links and reset maintain parity', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await controls(page);
  await page.getByRole('button', { name: 'Hide all', exact: true }).click();
  await expect(page.getByRole('switch', { checked: true })).toHaveCount(0);
  await closeControls(page);
  await openList(page);
  await page.getByRole('textbox', { name: 'Search concepts' }).fill('resource layers');
  await choose(page, 'Ecology and Resources');
  await expect(page).toHaveURL(/layers=ecology/);
  await page
    .getByTestId('inspector')
    .getByRole('button', { name: 'Substrate Mobility', exact: true })
    .click();
  await expect(
    page.getByTestId('inspector').getByRole('heading', { name: 'Substrate Mobility', exact: true }),
  ).toBeVisible();
  await page.getByText('Limits & important distinctions', { exact: true }).click();
  await expect(page.getByText(/Migration is not remote control:/)).toBeVisible();
  await controls(page);
  await page.getByRole('switch', { name: 'Show Substrate Mobility', exact: true }).uncheck();
  await expect(page.getByTestId('inspector')).toHaveCount(0);
  await closeControls(page);
  await openList(page);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByLabel('Future-hypothesis evidence filter').selectOption('Speculative');
  await expect(page.getByRole('dialog').getByRole('button', { name: /Explore / })).toHaveCount(1);
  await page.getByRole('button', { name: 'Close List view', exact: true }).click();
  await page.getByRole('button', { name: 'Reset explorer' }).click();
  await openList(page);
  await expect(page.getByLabel('Future-hypothesis evidence filter')).toHaveValue('all');
  await expect(page.getByRole('textbox', { name: 'Search concepts' })).toHaveValue('');
});
test('share link restores meaningful state in another browser context and supports Back/Forward', async ({
  page,
  browser,
}) => {
  await page.goto('/');
  await ready(page);
  await choose(page, 'Metacognition');
  await controls(page);
  await page.locator('#explode').press('Home');
  for (let i = 0; i < 68; i++) await page.locator('#explode').press('ArrowRight');
  await page.getByRole('button', { name: 'Side', exact: true }).click();
  await closeControls(page);
  await ready(page);
  await page.getByRole('button', { name: 'Share view', exact: true }).click();
  const link = await page.getByRole('textbox', { name: 'View link', exact: true }).inputValue();
  const state = parseState(new URL(link).hash);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const other = await context.newPage();
  await other.goto(link);
  await ready(other);
  await expect(other.getByRole('heading', { name: 'Metacognition', exact: true })).toBeVisible();
  expect(parseState(new URL(other.url()).hash).camera).toEqual(state.camera);
  expect(parseState(new URL(other.url()).hash).explode).toBe(0.68);
  await context.close();
  await page.getByRole('button', { name: 'Close Share view', exact: true }).click();
  await page.getByRole('button', { name: 'Memory', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Memory and Operational Continuity', exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Metacognition', exact: true })).toBeVisible();
  await page.goForward();
  await expect(
    page.getByRole('heading', { name: 'Memory and Operational Continuity', exact: true }),
  ).toBeVisible();
});
test('clipboard failure provides a selectable local link', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
      configurable: true,
    }),
  );
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Share view', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Clipboard access is unavailable');
  await expect(page.getByRole('textbox', { name: 'View link' })).toHaveValue(/#v=2/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Share view', exact: true })).toBeFocused();
});
test('fallback and context loss leave the full HTML catalogue usable', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto('/');
  await expect(
    page.getByText('3D is unavailable in this browser.', { exact: false }),
  ).toBeVisible();
  await choose(page, 'Metacognition');
  await expect(page.getByRole('heading', { name: 'Metacognition', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Measure', exact: true }).click();
  await expect(page.getByText('Not measured for this project.')).toBeVisible();
});
test('context loss and repeated scene remounts have a functioning catalogue', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  for (let i = 0; i < 4; i++) {
    await controls(page);
    await page.getByRole('button', { name: /Network/ }).click();
    await expect(page.getByText('Planned—not implemented.')).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.getByRole('button', { name: 'Return to Body' }).click();
    await ready(page);
  }
  await page
    .locator('canvas')
    .evaluate((c) => c.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.getByText(/The device paused this 3D session/)).toBeVisible();
  await choose(page, 'Substrate Mobility');
  await expect(
    page.getByTestId('inspector').getByRole('heading', { name: 'Substrate Mobility', exact: true }),
  ).toBeVisible();
});
test('malformed shared links recover without broken controls', async ({ page }) => {
  await page.goto('/#v=1&cap=unknown&isolate=1&explode=NaN&pos=Infinity,1,0&layers=invalid');
  await ready(page);
  await expect(page.getByTestId('inspector')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset explorer' }).click();
  await expect(page).toHaveURL(/layers=all/);
});
test('multitouch pinching does not select on either finger lift', async ({ page, context }) => {
  await page.goto('/');
  await ready(page);
  const p = await canvasPoint(page, [0.43, 5.95, 0.2]);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: p.x, y: p.y, id: 1 }],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { x: p.x, y: p.y, id: 1 },
      { x: p.x + 45, y: p.y + 25, id: 2 },
    ],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { x: p.x - 15, y: p.y, id: 1 },
      { x: p.x + 60, y: p.y + 25, id: 2 },
    ],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [{ x: p.x + 60, y: p.y + 25, id: 2 }],
  });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.getByTestId('inspector')).toHaveCount(0);
  await ready(page);
  await page.getByRole('button', { name: 'Reset explorer' }).click();
  await ready(page);
  const tap = await canvasPoint(page, [0.43, 5.95, 0.2]);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: tap.x, y: tap.y, id: 3 }],
  });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.getByRole('heading', { name: 'Metacognition', exact: true })).toBeVisible();
  await cdp.detach();
});
test('orientation changes refit a separated selection without losing state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await ready(page);
  await choose(page, 'Metacognition');
  await controls(page);
  await page.locator('#explode').press('End');
  await closeControls(page);
  await ready(page);
  await page.setViewportSize({ width: 844, height: 390 });
  await ready(page);
  await expect(page.getByRole('heading', { name: 'Metacognition', exact: true })).toBeVisible();
  expect(parseState(new URL(page.url()).hash).explode).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Reset explorer' }).click();
  expect(parseState(new URL(page.url()).hash).explode).toBe(0);
});
test('keyboard selection and enlarged text remain usable', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Open Mind group', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Metacognition', exact: true }).first().focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Metacognition', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Close inspector' }).click();
  await expect(
    page.getByRole('button', { name: 'Explore Metacognition', exact: true }).first(),
  ).toBeFocused();
  await page.addStyleTag({ content: ':root {font-size:200%}' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await choose(page, 'Substrate Mobility');
  await expect(
    page.getByTestId('inspector').getByRole('heading', { name: 'Substrate Mobility', exact: true }),
  ).toBeVisible();
});
test('production entry requests only successful local assets', async ({ page }, testInfo) => {
  test.skip(process.env.E2E_DEV === '1', 'Transfer budget applies to the production bundle.');
  const failures: string[] = [];
  page.on('requestfailed', (r) => failures.push(r.url()));
  page.on('response', (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  await page.goto('/');
  await ready(page);
  const resources = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((e) => ({
      name: e.name,
      transferSize: (e as PerformanceResourceTiming).transferSize,
      encodedBodySize: (e as PerformanceResourceTiming).encodedBodySize,
    })),
  );
  expect(failures).toEqual([]);
  expect(resources.every((r) => new URL(r.name).origin === new URL(page.url()).origin)).toBe(true);
  const bytes = resources.reduce((n, r) => n + r.transferSize, 0);
  expect(bytes).toBeLessThan(2_000_000);
  await testInfo.attach('initial-transfer', {
    body: JSON.stringify({ bytes, resources }, null, 2),
    contentType: 'application/json',
  });
  await page.screenshot({ path: 'docs/screenshots/production-body.png', fullPage: true });
  await choose(page, 'Metacognition');
  await page.screenshot({ path: 'docs/screenshots/production-metacognition.png', fullPage: true });
});
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
  { width: 844, height: 390 },
]) {
  test(`viewport ${viewport.width}x${viewport.height}: catalogue, controls, accessibility and screenshot`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await ready(page);
    await expect(page.getByRole('button', { name: 'Reset explorer' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: `docs/screenshots/after-immersive/${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
    await choose(page, 'Metacognition');
    await expect(page.getByRole('heading', { name: 'Metacognition', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Isolate context' }).click();
    await expect(page.getByRole('button', { name: 'Exit isolation' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    await testInfo.attach('axe', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });
    expect(results.violations).toEqual([]);
  });
}

test('former profile content now opens through the spatial hierarchy and List view', async ({
  page,
}) => {
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Open Beyond one body group' }).click();
  await page.getByRole('button', { name: 'Explore Persistence', exact: true }).click();
  const inspector = page.getByTestId('inspector');
  await expect(inspector.getByRole('heading', { name: 'Persistence', exact: true })).toBeFocused();
  await expect(inspector.getByText(/This is not immortality/)).toBeVisible();
  await expect(
    inspector.getByText('Scenario, not an empirical result.', { exact: false }),
  ).toBeVisible();
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations).toEqual([]);
  await inspector
    .getByRole('button', { name: 'Read the Memory and Operational Continuity dossier' })
    .click();
  await expect(
    inspector.getByRole('heading', { name: 'Memory and Operational Continuity', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Measure', exact: true }).click();
  await expect(page.getByText('Not measured for this project.')).toBeVisible();
  await page.getByRole('button', { name: 'Close inspector' }).click();
  await openList(page);
  await expect(page.locator('.list-profiles button')).toHaveCount(15);
});

test('landing identity, qualified date and real 3D cloud selection', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ARTIFICIAL SUPERINTELLIGENCE');
  await expect(page.getByTestId('inspector')).toHaveCount(0);
  await expect(page.locator('.profile-card-grid,.forms-grid,.phenotype-overview')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 2)).toBe(
    true,
  );
  await page.getByRole('button', { name: /Possible arrival: 2030–2035/ }).click();
  await expect(
    page.getByRole('dialog').getByText(/Arrival could be earlier, later, or fail/),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  const point = await canvasPoint(page, [-2.6, 4.9, 0.1]);
  await page.mouse.click(point.x, point.y);
  await expect(page).toHaveURL(/group=mind/);
  await expect(
    page.getByRole('navigation', { name: 'Capability clouds' }).getByRole('button'),
  ).toHaveCount(6);
  await page
    .getByRole('button', { name: 'Explore Cognition and Epistemic Reach', exact: true })
    .click();
  await expect(
    page
      .getByTestId('inspector')
      .getByRole('heading', { name: 'Cognition and Epistemic Reach', exact: true }),
  ).toBeVisible();
});

test('subtopics, Back and old/new shared links restore the same reading level', async ({
  page,
  browser,
}) => {
  await page.goto('/#v=1&cap=cognition');
  await ready(page);
  await page.locator('#topic-cognition-4').click();
  await expect(
    page
      .getByTestId('inspector')
      .getByRole('heading', { name: 'Cross-domain transfer', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Share view', exact: true }).click();
  const link = await page.getByRole('textbox', { name: 'View link' }).inputValue();
  const other = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await other.goto(link);
  await ready(other);
  await expect(
    other
      .getByTestId('inspector')
      .getByRole('heading', { name: 'Cross-domain transfer', exact: true }),
  ).toBeVisible();
  await other.screenshot({ path: 'docs/screenshots/after-immersive/restored-subtopic.png' });
  await other.close();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(page.locator('#topic-cognition-4')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Overview', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Evidence', exact: true }).click();
  await choose(page, 'Memory and Operational Continuity');
  await expect(page.getByRole('button', { name: 'Overview', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(await page.locator('.inspector-content').evaluate((e) => e.scrollTop)).toBe(0);
});

test('strength tasks and precision steps change the visible mechanical context', async ({
  page,
}) => {
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Open Physical capabilities group' }).click();
  await page.getByRole('button', { name: 'Explore Physical Strength', exact: true }).click();
  await page.getByRole('button', { name: 'Try a strength task' }).click();
  await expect(page.getByRole('region', { name: 'Interactive explanation' })).toContainText(
    'NOT A VALIDATED SIMULATION',
  );
  await page.getByRole('button', { name: 'Reach for a basketball finish', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute(
    'data-context',
    'substrate-mobility,embodiment,agency',
  );
  await expect(page.getByText(/Intelligence cannot supply missing actuator power/)).toBeVisible();
  await page.getByRole('button', { name: 'Back one level' }).click();
  await page.getByRole('button', { name: 'Explore Precision', exact: true }).click();
  await page.getByRole('button', { name: 'Step through the feedback loop' }).click();
  await page.getByRole('button', { name: '3 Planning', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-context', 'agency');
  await expect(
    page
      .getByRole('region', { name: 'Interactive explanation' })
      .getByRole('heading', { name: 'Planning', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Next stage', exact: true }).click();
  await expect(page.locator('canvas')).toHaveAttribute('data-context', 'self-improvement');
  await page.screenshot({ path: 'docs/screenshots/after-immersive/precision.png' });
});

test('remote, migration and copying show execution states and conditional failure', async ({
  page,
  browser,
}) => {
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Open Beyond one body group' }).click();
  await page.getByRole('button', { name: 'Explore Different execution arrangements' }).click();
  const ledger = page.getByLabel('Host execution status');
  await expect(ledger).toContainText('A runs');
  await expect(ledger).toContainText('B idle');
  await page.getByRole('button', { name: 'Migration', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(ledger).toContainText('A stopped');
  await expect(ledger).toContainText('B · checkpoint');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(ledger).toContainText('B runs');
  await page.getByRole('button', { name: 'Copying', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(ledger).toContainText('A runs · state α');
  await expect(ledger).toContainText('B runs · state β');
  await page.getByLabel('Robot body available', { exact: true }).uncheck();
  await expect(page.getByText(/Body unavailable. Physical actions stop/)).toBeVisible();
  await page
    .getByLabel('Compute or recoverable state, compatible resources and access available', {
      exact: true,
    })
    .uncheck();
  await expect(
    page.getByRole('heading', { name: 'Required resources unavailable', exact: true }),
  ).toBeVisible();
  await expect(ledger.locator('[data-running=true]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Share view', exact: true }).click();
  const link = await page.getByRole('textbox', { name: 'View link' }).inputValue();
  const other = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await other.goto(link);
  await ready(other);
  await expect(other.getByRole('button', { name: 'Copying', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(other.getByLabel('Robot body available', { exact: true })).not.toBeChecked();
  await other.close();
  await page.keyboard.press('Escape');
  await page
    .getByLabel('Compute or recoverable state, compatible resources and access available', {
      exact: true,
    })
    .check();
  await page.locator('.inspector-content').evaluate((e) => (e.scrollTop = 0));
  await page.screenshot({ path: 'docs/screenshots/after-immersive/copying.png' });
});
