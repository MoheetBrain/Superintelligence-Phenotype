import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { legalDocuments } from '../../src/content/legal';
import { company, home, navigation } from '../../src/content/site';
import { uiText } from '../../src/lib/ui-text';
import { expect, test } from './fixtures';

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 1024;

const menuButton = (page: Page) => page.locator('[data-nav-toggle]');
const primaryNav = (page: Page) => page.getByRole('navigation', { name: uiText.primaryNavLabel });

async function headerBottom(page: Page): Promise<number> {
  const box = await page.locator('[data-site-header]').boundingBox();
  return (box?.y ?? 0) + (box?.height ?? 0);
}

test.describe('home page', () => {
  test('renders the hero and every section', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(home.hero.headline);
    for (const id of ['recover', 'how', 'why', 'sectors', 'about', 'contact']) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    await expect(page.getByText(company.relationship).first()).toBeVisible();
  });

  for (const link of navigation.primary) {
    test(`navigation "${link.label}" scrolls to its section`, async ({ page }) => {
      await page.goto('/');
      const id = link.href.split('#')[1];
      if (isMobile(page)) await menuButton(page).click();
      await primaryNav(page).getByRole('link', { name: link.label, exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      const heading = page.locator(`#${id}-heading`);
      await expect(heading).toBeInViewport();
      // The sticky header must not cover the section heading once scrolling settles.
      const bottom = await headerBottom(page);
      await expect
        .poll(async () => (await heading.boundingBox())?.y ?? -1, { timeout: 5_000 })
        .toBeGreaterThanOrEqual(bottom);

      if (isMobile(page)) await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false');
    });
  }

  test('primary call to action leads to the contact section', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: home.hero.primaryCta.label }).click();
    await expect(page.locator('#contact-heading')).toBeInViewport();
    const cta = page.getByRole('link', { name: home.contact.primaryCta.label });
    await expect(cta).toHaveAttribute('href', home.contact.primaryCta.href);
    await expect(
      page.locator('#contact').getByRole('link', { name: company.email }),
    ).toHaveAttribute('href', `mailto:${company.email}`);
  });
});

test.describe('mobile navigation', () => {
  test('menu opens and closes with the button, Escape and link selection', async ({ page }) => {
    await page.goto('/');
    const button = menuButton(page);
    const nav = primaryNav(page);

    if (!isMobile(page)) {
      await expect(button).toBeHidden();
      await expect(nav.getByRole('link', { name: navigation.primary[0].label })).toBeVisible();
      return;
    }

    await expect(button).toBeVisible();
    await expect(button).toHaveAccessibleName(uiText.menuButton);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toHaveAttribute('aria-controls', 'site-nav');
    await expect(nav).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: navigation.cta.label })).toBeVisible();

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();

    await button.click();
    await nav.getByRole('link', { name: navigation.primary[0].label }).focus();
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();
    await expect(button).toBeFocused();

    await button.click();
    await nav.getByRole('link', { name: navigation.primary.at(-1)!.label }).click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('enquiry composer', () => {
  const { form } = home.contact;
  const values = {
    name: 'Jane Smith',
    company: 'Smith & Sons (Holdings) Ltd',
    email: 'jane.smith@example.com',
    message: 'Unapplied credits across two units?\nRoughly 3 years & 2 entities.',
  };

  async function fillComposer(page: Page) {
    const composer = page.locator('form[data-composer]');
    await composer.getByLabel(form.fields.name, { exact: true }).fill(values.name);
    await composer.getByLabel(form.fields.company, { exact: true }).fill(values.company);
    await composer.getByLabel(form.fields.email, { exact: true }).fill(values.email);
    await composer.getByLabel(form.fields.message, { exact: true }).fill(values.message);
    return composer;
  }

  function expectComposedUrl(url: string) {
    expect(url.startsWith(`mailto:${company.email}?subject=`)).toBe(true);
    const query = url.slice(url.indexOf('?') + 1);
    const params = Object.fromEntries(
      query.split('&').map((pair) => {
        const [key, value] = pair.split('=');
        return [key, decodeURIComponent(value)];
      }),
    );
    expect(params.subject).toBe(form.emailSubject);
    expect(params.body).toContain(`${form.fields.name}: ${values.name}`);
    expect(params.body).toContain(`${form.fields.company}: ${values.company}`);
    expect(params.body).toContain(`${form.fields.email}: ${values.email}`);
    expect(params.body).toContain(`${form.fields.message}:`);
    expect(params.body).toContain(values.message.replace('\n', '\r\n'));
  }

  test('shows labelled, required fields and the behaviour notes', async ({ page }) => {
    await page.goto('/#contact');
    const composer = page.locator('form[data-composer]');
    for (const label of Object.values(form.fields).slice(0, 4)) {
      await expect(composer.getByLabel(label, { exact: true })).toHaveAttribute('required', '');
    }
    await expect(composer.getByLabel(form.fields.email, { exact: true })).toHaveAttribute(
      'type',
      'email',
    );
    await expect(page.getByText(form.behaviourNote)).toBeVisible();
    await expect(page.getByText(form.confidentialityNote)).toBeVisible();
  });

  test('does not compose an email while fields are invalid', async ({ page }) => {
    await page.goto('/#contact');
    await page.evaluate(() => {
      const target = window as unknown as { composed: string[] };
      target.composed = [];
      document
        .querySelector('form[data-composer]')!
        .addEventListener('composer:mailto', (event) => {
          event.preventDefault();
          target.composed.push((event as CustomEvent<{ url: string }>).detail.url);
        });
    });
    const composer = await fillComposer(page);
    await composer.getByLabel(form.fields.email, { exact: true }).fill('not-an-email');
    await page.getByRole('button', { name: form.submitLabel }).click();
    expect(
      await page.evaluate(() => (window as unknown as { composed: string[] }).composed),
    ).toEqual([]);
    await expect(composer.locator(':invalid')).toHaveCount(1);
  });

  test('composes a mailto URL with the subject and all four fields', async ({ page }) => {
    await page.goto('/#contact');
    const composed = page.evaluate(
      () =>
        new Promise<string>((resolve) => {
          document
            .querySelector('form[data-composer]')!
            .addEventListener('composer:mailto', (event) => {
              event.preventDefault(); // observe without handing off to a mail app
              resolve((event as CustomEvent<{ url: string }>).detail.url);
            });
        }),
    );
    await fillComposer(page);
    await page.getByRole('button', { name: form.submitLabel }).click();
    expectComposedUrl(await composed);
    await expect(page).toHaveURL(/\/#contact$/);
  });

  test('hands the composed email to the mail client via navigation', async ({ page, headless }) => {
    // Headless Chromium records the mailto: navigation without launching an external application.
    test.skip(!headless, 'would open a real mail application');
    await page.goto('/#contact');
    await fillComposer(page);
    const request = page.waitForRequest((candidate) => candidate.url().startsWith('mailto:'));
    await page.getByRole('button', { name: form.submitLabel }).click();
    expectComposedUrl((await request).url());
  });
});

test.describe('legal pages', () => {
  for (const doc of legalDocuments) {
    test(`${doc.path} responds 200 with its own heading and metadata`, async ({ page }) => {
      const response = await page.goto(doc.path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(doc.title);
      await expect(page).toHaveTitle(new RegExp(`^${doc.title}`));
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        doc.metaDescription,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://superintel.site${doc.path}`,
      );
      await expect(page.getByText(company.relationship).first()).toBeVisible();
    });
  }
});

test.describe('not found', () => {
  test.use({ allowedConsoleErrors: ['status of 404'] });

  test('an unknown route shows the branded 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(uiText.notFound.title);
    await page.getByRole('link', { name: uiText.notFound.homeLink }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(home.hero.headline);
  });

  test('404.html is served directly and is not indexable', async ({ page }) => {
    const response = await page.goto('/404.html');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(uiText.notFound.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('navigation stays reachable and email remains the contact route', async ({ page }) => {
    await page.goto('/');
    await expect(menuButton(page)).toBeHidden();
    for (const link of navigation.primary) {
      await expect(
        primaryNav(page).getByRole('link', { name: link.label, exact: true }),
      ).toBeVisible();
    }
    await expect(page.locator('form[data-composer]')).toBeHidden();
    await expect(page.getByRole('link', { name: home.contact.primaryCta.label })).toBeVisible();
    await expect(page.locator('#contact').getByRole('link', { name: company.email })).toBeVisible();
  });
});

test.describe('static files', () => {
  test('sitemap, robots and icons are served', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('<loc>https://superintel.site/privacy/</loc>');
    const robots = await request.get('/robots.txt');
    expect(await robots.text()).toContain('Sitemap: https://superintel.site/sitemap.xml');
    for (const path of ['/favicon.svg', '/apple-touch-icon.png', '/og-image.png']) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });

  test('pages carry the production security headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
  });
});

test.describe('accessibility', () => {
  const paths = ['/', ...legalDocuments.map((doc) => doc.path), '/404.html'];

  for (const path of paths) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      const blocking = results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? ''),
      );
      expect(
        blocking.map(
          (violation) =>
            `${violation.id}: ${violation.nodes.map((node) => node.target).join(', ')}`,
        ),
      ).toEqual([]);
    });
  }

  test('the open mobile menu has no serious or critical axe violations', async ({ page }) => {
    await page.goto('/');
    if (isMobile(page)) await menuButton(page).click();
    const results = await new AxeBuilder({ page }).include('[data-site-header]').analyze();
    const blocking = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    );
    expect(blocking.map((violation) => violation.id)).toEqual([]);
  });
});
