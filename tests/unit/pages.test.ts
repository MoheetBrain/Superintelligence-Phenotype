import { describe, expect, it } from 'vitest';
import { legalDocuments } from '../../src/content/legal';
import { company, home, navigation, site } from '../../src/content/site';
import { homeRoute, renderRobots, renderSitemap, routes } from '../../src/entry-server';
import { hrefsIn, idsIn, renderAll, textOf } from './helpers';

const pages = renderAll();
const homeHtml = pages.find(({ route }) => route.path === '/')!.html;
const homeIds = idsIn(homeHtml);

describe('company identification', () => {
  it.each(pages.map((page) => [page.route.path, page] as const))(
    '%s shows the legal name, company number, registered office and relationship line',
    (_path, { html }) => {
      const text = textOf(html);
      expect(text).toContain(company.legalName);
      expect(text).toContain('17347944');
      expect(text).toContain(company.companyNumber);
      expect(text).toContain(company.registeredOffice.join(', '));
      expect(text).toContain(company.relationship);
      expect(hrefsIn(html)).toContain(company.companiesHouseUrl);
    },
  );

  it('states the jurisdiction only as recorded in the content', () => {
    const text = textOf(homeHtml);
    if (company.jurisdiction) {
      expect(text).toContain(`Registered in ${company.jurisdiction}`);
    } else {
      expect(text).not.toContain('Registered in');
    }
  });
});

describe('content safety', () => {
  const forbidden = ['MKM', 'Kitwave', 'Parfetts', 'Blakemore', 'Lords Group'];

  it.each(pages.map((page) => [page.route.path, page] as const))(
    '%s names no prospective client',
    (_path, { html }) => {
      for (const name of forbidden) {
        expect(html.toLowerCase(), `found "${name}"`).not.toContain(name.toLowerCase());
      }
    },
  );

  it('does not hard-code the enquiry address outside content', () => {
    expect(homeHtml).toContain(`mailto:${company.email}`);
  });
});

describe('links and anchors', () => {
  it.each(pages.map((page) => [page.route.path, page] as const))(
    '%s has in-page anchors that all resolve to an existing id',
    (_path, { html }) => {
      const ids = idsIn(html);
      for (const href of hrefsIn(html)) {
        if (href.startsWith('#')) {
          expect(ids.has(href.slice(1)), `missing #${href.slice(1)}`).toBe(true);
        } else if (href.startsWith('/#')) {
          expect(homeIds.has(href.slice(2)), `missing home #${href.slice(2)}`).toBe(true);
        }
      }
    },
  );

  it('renders the home sections in order with their content ids', () => {
    const order = [
      home.recover.id,
      home.how.id,
      home.why.id,
      home.sectors.id,
      home.about.id,
      home.contact.id,
    ];
    const positions = order.map((id) => homeHtml.indexOf(`id="${id}"`));
    expect(positions.every((position) => position > 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('links every primary and footer navigation item', () => {
    const hrefs = hrefsIn(homeHtml);
    for (const link of [...navigation.primary, navigation.cta, ...navigation.footer]) {
      expect(hrefs).toContain(link.href);
    }
  });

  it('links internal pages that exist', () => {
    const paths = new Set(routes.map((route) => route.path));
    for (const { html } of pages) {
      for (const href of hrefsIn(html)) {
        if (href.startsWith('/') && !href.startsWith('/#') && !href.startsWith('/assets/')) {
          const path = href.split('#')[0];
          const known =
            paths.has(path) ||
            ['/favicon.svg', '/apple-touch-icon.png', '/noscript.css'].includes(path);
          expect(known, `unknown internal link ${href}`).toBe(true);
        }
      }
    }
  });
});

describe('document head', () => {
  it.each(pages.map((page) => [page.route.path, page] as const))(
    '%s has language, title, description and social metadata',
    (_path, { route, html }) => {
      expect(html.startsWith('<!doctype html><html lang="en-GB">')).toBe(true);
      expect(html).toContain(`<title>${route.meta.title.replace(/&/g, '&amp;')}</title>`);
      expect(html).toContain(
        '<meta name="viewport" content="width=device-width, initial-scale=1"/>',
      );
      expect(html).toContain(`<meta property="og:image" content="${site.origin}${site.ogImage}"/>`);
      expect(html).toContain('<meta property="og:locale" content="en_GB"/>');
      expect(html).toContain('<meta name="twitter:card" content="summary_large_image"/>');
      expect(html).toContain(`<meta name="theme-color" content="${site.themeColor}"/>`);
      expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>');
      if (route.meta.noindex) {
        expect(html).toContain('<meta name="robots" content="noindex"/>');
        expect(html).not.toContain('rel="canonical"');
      } else {
        expect(html).toContain(`<link rel="canonical" href="${site.origin}${route.path}"/>`);
        expect(html).toContain(`<meta property="og:url" content="${site.origin}${route.path}"/>`);
      }
    },
  );

  it.each(pages.map((page) => [page.route.path, page] as const))(
    '%s loads nothing from another origin and has no inline styles or scripts',
    (_path, { html }) => {
      const resources = [
        ...Array.from(
          html.matchAll(/<(?:script|img|iframe|source)[^>]*\ssrc="([^"]+)"/g),
          (m) => m[1],
        ),
        ...Array.from(html.matchAll(/<link[^>]*\shref="([^"]+)"/g), (m) => m[1]),
      ].filter((url) => !url.startsWith(site.origin));
      for (const url of resources) expect(url, url).toMatch(/^\/(?!\/)/);
      expect(html).not.toMatch(/\sstyle="/);
      expect(html).not.toMatch(/<style[\s>]/);
      const inlineScripts = Array.from(
        html.matchAll(/<script(?![^>]*\ssrc=)([^>]*)>/g),
        (m) => m[1],
      );
      for (const attributes of inlineScripts) expect(attributes).toContain('application/ld+json');
    },
  );

  it('gives each legal page its own title, description and h1', () => {
    for (const doc of legalDocuments) {
      const page = pages.find(({ route }) => route.path === doc.path)!;
      expect(page.route.meta.description).toBe(doc.metaDescription);
      expect(page.html).toMatch(new RegExp(`<h1[^>]*>${doc.title.replace(/&/g, '&amp;')}</h1>`));
    }
  });

  it('has exactly one h1 per page', () => {
    for (const { html } of pages) expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });
});

describe('sitemap and robots', () => {
  it('lists the canonical, indexable pages', () => {
    const sitemap = renderSitemap();
    const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);
    expect(locs).toEqual([
      `${site.origin}/`,
      ...legalDocuments.map((doc) => `${site.origin}${doc.path}`),
    ]);
    expect(locs).toContain(`${site.origin}${homeRoute.path}`);
  });

  it('allows crawling and points to the sitemap', () => {
    const robots = renderRobots();
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`Sitemap: ${site.origin}/sitemap.xml`);
  });
});
