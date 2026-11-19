import { routes, renderRoute, type PageAssets, type Route } from '../../src/entry-server';

export const testAssets: PageAssets = {
  styles: ['/assets/styles.css'],
  scripts: ['/assets/main.js'],
  fontPreloads: ['/assets/font.woff2'],
};

export interface RenderedPage {
  route: Route;
  html: string;
}

export function renderAll(): RenderedPage[] {
  return routes.map((route) => ({ route, html: renderRoute(route, testAssets, 2026) }));
}

/** All id attribute values in an HTML string. */
export function idsIn(html: string): Set<string> {
  return new Set(Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]));
}

/** All href attribute values in an HTML string, with entities decoded. */
export function hrefsIn(html: string): string[] {
  return Array.from(html.matchAll(/\shref="([^"]*)"/g), (match) => match[1].replace(/&amp;/g, '&'));
}

/** Visible-ish text: tags stripped, entities decoded, whitespace collapsed. */
export function textOf(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
