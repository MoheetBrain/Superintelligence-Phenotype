import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';
import { legalDocuments } from './content/legal';
import { site } from './content/site';
import { Document, type PageAssets, type PageMeta } from './components/Document';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { uiText } from './lib/ui-text';

export type { PageAssets } from './components/Document';

export interface Route {
  /** URL path, e.g. "/privacy/". */
  path: string;
  /** Output file relative to dist/, e.g. "privacy/index.html". */
  file: string;
  /** Included in sitemap.xml. */
  indexable: boolean;
  meta: PageMeta;
  render: () => ReactElement;
}

function titleFor(pageTitle: string): string {
  return `${pageTitle} | ${site.brand}`;
}

export const homeRoute: Route = {
  path: '/',
  file: 'index.html',
  indexable: true,
  meta: { path: '/', title: site.title, description: site.description },
  render: () => <HomePage />,
};

export const legalRoutes: Route[] = legalDocuments.map((doc) => ({
  path: doc.path,
  file: `${doc.path.replace(/^\/|\/$/g, '')}/index.html`,
  indexable: true,
  meta: { path: doc.path, title: titleFor(doc.title), description: doc.metaDescription },
  render: () => <LegalPage doc={doc} />,
}));

export const notFoundRoute: Route = {
  path: '/404.html',
  file: '404.html',
  indexable: false,
  meta: {
    path: '/404.html',
    title: titleFor(uiText.notFound.title),
    description: uiText.notFound.metaDescription,
    noindex: true,
  },
  render: () => <NotFoundPage />,
};

export const routes: Route[] = [homeRoute, ...legalRoutes, notFoundRoute];

/** Finds a page route by request path, accepting "/privacy" and "/privacy/index.html" forms. */
export function findRoute(pathname: string): Route | undefined {
  const normalised = pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  return routes.find((route) => route.indexable && route.path === normalised);
}

/** Renders a complete HTML document for a route. */
export function renderRoute(
  route: Route,
  assets: PageAssets,
  year = new Date().getFullYear(),
): string {
  const markup = renderToStaticMarkup(
    <Document meta={route.meta} assets={assets} year={year}>
      {route.render()}
    </Document>,
  );
  return `<!doctype html>${markup}`;
}

export function renderSitemap(): string {
  const urls = routes
    .filter((route) => route.indexable)
    .map((route) => `  <url>\n    <loc>${site.origin}${route.path}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`;
}
